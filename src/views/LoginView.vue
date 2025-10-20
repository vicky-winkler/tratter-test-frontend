<template>
    <div class="pl-12 pr-12 pt-6 flex justify-between">
        <div class="bg-zinc-900" style="width: 100%">
            <h1 class="p-2 pl-6 font-bold bg-zinc-800 uppercase text-white text-left text-3xl">LOGIN </h1>
        </div>


        <Button class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-none text-center" @click="shutdown()"
            style="border-radius: 0px; min-width: 20%; width: 25%;" label="Delete" severity="danger">
            <div class="flex gap-6">
                <i class="pi pi-power-off" style="font-size: 2rem"></i>
                <p class="text-2xl uppercase">Shut down</p>
            </div>
        </Button>

        <!-- return button (TODO: only enabled when not TEST is running!!) -->
    </div>
    <div id="app">
        <div class="pl-12 pr-12 pt-6" style="width: 100%">
            <div class="bg-zinc-800" id="login">
                <ProgressBar v-if="loginProcessing" mode="indeterminate" class="rounded-none"
                    style="border-radius: 0px; height: 6px;"></ProgressBar>
                <!-- Login Form -->
                <div id="form">
                    <form class="flex justify-center gap-0" @submit.prevent="login">
                        <!-- User ID -->
                        <div class="card flex justify-center p-4 gap-6 " style="width: 35%;">
                            <label class=" text-white text-right text-center text-3xl py-6" for="user">User ID </label>
                            <InputText class="use-keyboard-input text-3xl" type="text"
                                style="border-radius: 0px; font-size: xx-large; width: 60%;" id="user" v-model="userID"
                                autocomplete="off"> </InputText>
                        </div>
                        <!-- Password -->
                        <div class="card flex justify-center p-4  gap-6" style="width: 35%;">
                            <label class=" text-white text-right text-center text-3xl py-6" for="user">Password</label>
                            <InputText class="use-keyboard-input "
                                style="border-radius: 0px; font-size: xx-large; width: 90%;" type="password" id="pw"
                                v-model="password"> </InputText>
                        </div>
                        <Button class="rounded-none m-4" style="border-radius: 0px; width: 20%;" type="submit">
                            <p class="text-3xl text-white uppercase font-bold">Login</p>
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- LOGOS -->
    <div class="pl-12 pr-12 pt-6 pb-6 card flex justify-between footer-bottom">
        <img src="../assets/imgs/logos/consteed_wide_yellow.png" alt="Image Consteed" width="340"/>
        <img src="../assets/imgs/logos/tratter.png" alt="Image Tratter" width="340"/>
    </div>


    <Toast position="top-center" />
    <ConfirmDialog></ConfirmDialog>
    <template>
        <Dialog v-model:visible="storageFull" modal header="Error" :draggable="false" :style="{ width: '35%' }"
            :pt="{ header: { style: { backgroundColor: errorColor , color: 'black', fontWeight: 'bold', textTransform: 'uppercase' } }}">
            <p class="text-surface-500 dark:text-surface-400 pt-2">ID: 102</p>
            <p class="text-surface-500 dark:text-surface-400 ">Storage is full on this machine! <br> Please contact your administrator</p>
            <div class="flex justify-end gap-2">
            <Button severity="danger" type="button" label="OK" @click="storageFull = false"></Button>
          </div>
        </Dialog>
    </template>

</template>


<script setup>
// VUE
import { ref, onMounted, onUnmounted } from "vue";
import router from "../router";
import { Buffer } from 'buffer';

// Messaging & Commands
import slip from 'slip';
import { wsAddress } from '../services/websocket/mainWebSocket';
import { FrontEndCommand} from "../services/backendMessaging/commandEnums";
import { decodeMessage } from '../services/backendMessaging/backendCommands';
import { frontEndCommand, frontEndAckCommand, frontEndLoginCommand, } from '../services/backendMessaging/backendCommands';


// Stores and Data
import { useTestConfigStore } from '../store/testConfigStore';


// Graphics Components
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import { useConfirm } from "primevue/useconfirm";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import ConfirmDialog from 'primevue/confirmdialog';
import Dialog from 'primevue/dialog';


/* CODE STARTS HERE */


const confirm = useConfirm();
const toast = useToast();

const loginProcessing = ref(false);
const storageFull = ref(false);

var connection = null
window.Buffer = Buffer;
const testConfigStore = useTestConfigStore();
const errorColor = ref('#dc2626');



onUnmounted(() => {
    document.body.removeChild(keyboard);
    connection.close();
})

onMounted(() => {
    if (!connection || connection.readyState === WebSocket.CLOSED) {
        establishConnection()
    }

    frontEndCommand(connection, FrontEndCommand.LoginView);
    console.log("notified backend about new view - login " + FrontEndCommand.LoginView);
    Keyboard.init();

    // storageFull.value = true;
    // localStorage.setItem("authToken", true);
    // localStorage.setItem("adminToken", true);
    //router.push('mainScreenView');
    // router.push('qualitySingleCellView');
})





const decoder = new slip.Decoder({
    onMessage: (msg) => processMessage(decodeMessage(msg)),
    maxMessageSize: 209715200,
    bufferSize: 2048,
});




// Establish WebSocket Connection
function establishConnection() {
    connection = new WebSocket(wsAddress);
    connection.binaryType = 'arraybuffer';

    connection.onopen = function (event) {
        console.log(event);
    };
    connection.onmessage = (event) => {
        const dataBuffer = Buffer.from(event.data);
        decoder.decode(dataBuffer);
    };

    connection.onerror = function (event) {
        setTimeout(establishConnection, 5000);
    };
}

// Handle incoming Messages from Backend
function processMessage(decodedOscMessage) {
    // Extract CommandType from Address
    const commandType = decodedOscMessage.address.split('/')[2]

    // CommandID
    const commandID = decodedOscMessage.args[1].value;

    console.log("Message received" + commandType + " , " + commandID)


    // Handle Login
    if (commandID === FrontEndCommand.LoginUser) {
        if (commandType === "DATA") {
            processLogin(decodedOscMessage);
        }
        else if (commandType === "ERR") {
            console.log("ERROR LOGGING IN " + decodedOscMessage.args[2].value)
            toast.add({ severity: 'contrast', summary: 'Login Failed', detail: 'Invalid User ID and/or password!', life: 3000 });
        }

        loginProcessing.value = false;
    }

    // Handle Settings
    else if (commandID === FrontEndCommand.Settings) {
        if (commandType === "DATA") {
            processSettings(decodedOscMessage);
            // move to main screen view //TODO possibly only when Settings data correctly processed??
            router.push('mainScreenView')
        }
        else if (commandType === "ERR") {
            console.log("ERROR Settings")
        }

    // Storage ERROR
    } else if (commandID === FrontEndCommand.StorageFull) {
        if(commandType === "ERR"){
            storageFull.value = true;
        }       
    }
}


// Check if User allowed + Admin or not
function processLogin(decodedOscMessage) {
    const loginData = decodedOscMessage.args[3].value.split(",")

    console.log("LOGIN DATA:");
    console.log(loginData)

    localStorage.setItem("authToken", true);
    localStorage.setItem("adminToken", parseInt(loginData[1]) ? true : false);

    testConfigStore.username = loginData[0];

}


// Set Settings Store => move on to main Screen View
function processSettings(decodedOscMessage) {

    console.log("SETTINGS...");

    const settingsBlob = decodedOscMessage.args[5];

    var bytesArray = new Uint8Array(settingsBlob.value);

    var view = new DataView(bytesArray.buffer);

    // Operation Modus, 
    console.log("Operation Modus: " + view.getUint16(0, true))

    // add to Store
    testConfigStore.testModeID = view.getUint16(0, true)


    // if ok send ACK to backend!
    frontEndAckCommand(connection, FrontEndCommand.Settings);

}


const userID = ref("");
const hidePassword = ref(true);
const password = ref("");

// Login Fon Button Press
async function login() {

    // needed for virtual Keyboard input!
    userID.value = user.value
    password.value = pw.value

    const encoder = new TextEncoder();
    const data = encoder.encode(password.value);

    const hash = await crypto.subtle.digest('SHA-256', data)
    const hash64encoded = btoa(String.fromCharCode(...new Uint8Array(hash)));

    console.log("Hashed Password: " + hash64encoded);

    // user = MatrikelNr not Username
    frontEndLoginCommand(connection, FrontEndCommand.LoginUser, user.value, hash64encoded);
    console.log("notified backend about user login " + FrontEndCommand.LoginUser);
    loginProcessing.value = true;

}



// Shutdown Button pressed
const shutdown = () => {
    confirm.require({
        message: 'Are you sure you want to proceed?',
        header: 'Teststation Shutdown',
        rejectProps: {
            label: 'Cancel',
            severity: 'contrast',
            outlined: false
        },
        acceptProps: {
            label: 'Shut down',
            severity: 'danger'
        },
        accept: () => {
            toast.add({ severity: 'contrast', summary: 'Confirmed', detail: 'Teststation is shutting down...', life: 5000 });
            frontEndCommand(connection, FrontEndCommand.ShutDown)
            console.log("notified backend about system shutdown " + FrontEndCommand.ShutDown);
        },
        reject: () => {
            toast.add({ severity: 'contrast', summary: 'Rejected', detail: 'Shutdown cancelled', life: 3000 });
        }
    });
};









// KEYBOARD!!!

// Keyboard Standard: Letters and Numbers
const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden", "bg-zinc-800");
        this.elements.main.id = "keyboard"
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "@", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "+", "z", "ä", "c", "v", "b", "n", "m", ",", ".", "-",
            "space", "done"
        ];

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "p", "enter", "-"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button", "hover:bg-red-700");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide", "pi", "pi-backward");
                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });

                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable", "pi", "pi-caret-up");
                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                    });

                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide", "pi", "pi-arrow-left");
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide", "pi", "pi-minus");
                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark", "pi", "pi-check");

                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    });

                    break;

                default:
                    keyElement.textContent = key.toLowerCase();
                    keyElement.addEventListener("click", () => {

                        switch (key) {
                            case ",": this.properties.value += this.properties.capsLock ? ";" : ","; break;
                            case ".": this.properties.value += this.properties.capsLock ? ":" : "."; break;
                            case "-": this.properties.value += this.properties.capsLock ? "_" : "-"; break;
                            case "+": this.properties.value += this.properties.capsLock ? "*" : "+"; break;
                            case "1": this.properties.value += this.properties.capsLock ? "!" : "1"; break;
                            case "2": this.properties.value += this.properties.capsLock ? "\"" : "2"; break;
                            case "3": this.properties.value += this.properties.capsLock ? "§" : "3"; break;
                            case "4": this.properties.value += this.properties.capsLock ? "$" : "4"; break;
                            case "5": this.properties.value += this.properties.capsLock ? "%" : "5"; break;
                            case "6": this.properties.value += this.properties.capsLock ? "&" : "6"; break;
                            case "7": this.properties.value += this.properties.capsLock ? "/" : "7"; break;
                            case "8": this.properties.value += this.properties.capsLock ? "(" : "8"; break;
                            case "9": this.properties.value += this.properties.capsLock ? ")" : "9"; break;
                            case "0": this.properties.value += this.properties.capsLock ? "=" : "0"; break;

                            default:
                                this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        }



                        this._triggerEvent("oninput");
                    });

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                switch (key.textContent) {
                    case ",": case ";": key.textContent = this.properties.capsLock ? ";" : ","; break;
                    case ".": case ":": key.textContent = this.properties.capsLock ? ":" : "."; break;
                    case "-": case "_": key.textContent = this.properties.capsLock ? "_" : "-"; break;
                    case "+": case "*": key.textContent = this.properties.capsLock ? "*" : "+"; break;
                    case "1": case "!": key.textContent = this.properties.capsLock ? "!" : "1"; break;
                    case "2": case "\"": key.textContent = this.properties.capsLock ? "\"" : "2"; break;
                    case "3": case "§": key.textContent = this.properties.capsLock ? "§" : "3"; break;
                    case "4": case "$": key.textContent = this.properties.capsLock ? "$" : "4"; break;
                    case "5": case "%": key.textContent = this.properties.capsLock ? "%" : "5"; break;
                    case "6": case "&": key.textContent = this.properties.capsLock ? "&" : "6"; break;
                    case "7": case "/": key.textContent = this.properties.capsLock ? "/" : "7"; break;
                    case "8": case "(": key.textContent = this.properties.capsLock ? "(" : "8"; break;
                    case "9": case ")": key.textContent = this.properties.capsLock ? ")" : "9"; break;
                    case "0": case "=": key.textContent = this.properties.capsLock ? "=" : "0"; break;

                    default:
                        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
                }
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};



</script>

<style>
.keyboard {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 5px 0;
    background: #004134;
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
    user-select: none;
    transition: bottom 0.4s;
}

.keyboard--hidden {
    bottom: -100%;
}

.keyboard__keys {
    text-align: center;
}

.keyboard__key {
    height: 75px;
    width: 8%;
    max-width: 100px;
    margin: 7px;
    border-radius: 0px;
    border: none;
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    font-size: 2.75rem;
    outline: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: top;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
    position: relative;
}

.keyboard__key:active {
    background: #27272a;
}

.keyboard__key--wide {
    width: 12%;
    font-size: 2rem !important;

}

.keyboard__key--extra-wide {
    width: 36%;
    max-width: 500px;
    font-size: 2rem !important;
}

.keyboard__key--activatable::after {
    content: '';
    top: 10px;
    right: 10px;
    position: absolute;
    width: 8px;
    height: 8px;
    background: rgba(185, 178, 178, 0.4);
    border-radius: 50%;
}

.keyboard__key--active::after {
    background: #ffffff;
}

.keyboard__key--dark {
    background: #34d399
}




.footer-bottom {
  bottom: 0;
  position: fixed;
  width: 100%;
}



</style>
