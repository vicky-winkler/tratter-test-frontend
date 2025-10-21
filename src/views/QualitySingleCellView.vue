<template>
  <!-- title + BACK Button -->
  <div class="pl-12 pr-12 pt-6 flex justify-between">
    <div class="bg-zinc-900" v-if="activeToggle === true" style="width: 80%">
      <h1 class="p-2 pl-6 font-bold bg-zinc-800 text-white text-left text-3xl">QUALITY-SINGLE-CELL-PANEL</h1>
    </div>
    <div class="bg-zinc-900" v-else style="width: 100%">
      <h1 class="p-2 pl-6 font-bold bg-zinc-800 uppercase text-white text-left text-3xl">QUALITY-SINGLE-CELL-PANEL</h1>
    </div>
    <button v-if="store.testRunning" style="width: 20%;"
      class=" bg-orange-400 hover:bg-red-400 text-white font-semibold py-2 px-4 rounded-none text-center"
      @click="abortTest">Stop Test
    </button>
    <button v-else style="width: 20%;"
      class=" bg-orange-400 hover:bg-red-400 text-white font-semibold py-2 px-4 rounded-none text-center"
      @click="startNewTest">Start New Test
    </button>
    <router-link style="width: 20%" :to="disabledBackToMenu ? '' : { name: 'mainScreenView' }" 
      :class="[
      'bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-4 rounded-none uppercase text-xl text-center',
      { 'pointer-events-none opacity-50': disabledBackToMenu }]">Back to Menu
    </router-link>
  </div>

      <!-- Progress bar -->
    <div class="pl-12 pr-12 pb-6">
      <ProgressBar v-if="store.testRunning"  mode="indeterminate" class="rounded-none" style="border-radius: 0px; height: 6px;"></ProgressBar>
      <ProgressBar v-else :value="0" class="rounded-none" style="border-radius: 0px; height: 6px;"></ProgressBar>
    </div>
  

  <!-- MAIN -->
  <div class=" pl-12 pr-12 flex gap-6 align-items-end justify-between">
    <LightbarrierVisualComponent v-if="overallStore.lightbarrier" :color="overallStore.lightBarrierColorId"></LightbarrierVisualComponent>
    <!-- MAIN between light barriers -->
    <QualityTableComponent class="rounded-none" style="width: 55%; min-height: 50vh;" ref="qualityTableComponentRef" 
      @open-keyboard="(...args) => Keyboard.open(...args)"
      @close-keyboard="() => Keyboard.close()"
      @update-manual-input="onUpdateManualInput"
      @submit-manual-input="onSubmitManualInput"
      >
    </QualityTableComponent>
    <ChartQualityComponent class="rounded-none" style="width: 45%; min-height: 50vh;" ref="qualityChartComponentRef"></ChartQualityComponent>
    <LightbarrierVisualComponent v-if="overallStore.lightbarrier" :color="overallStore.lightBarrierColorId"></LightbarrierVisualComponent>
  </div> 

    <!-- Instructions -->
  <div v-if="store.instruction && finalResult" class="pl-12 pr-12 pt-6 pb-6" >
    <h1 v-if="store.instruction === 'PASS'" class="p-2 font-bold bg-green-400 uppercase text-black text-center text-2xl">{{ store.instruction }}</h1>
    <h1 v-else class="p-2 font-bold bg-red-400 uppercase text-black text-center text-2xl">{{ store.instruction }}</h1>
  </div>
  <div v-else-if="store.instruction !== '' " class="pl-12 pr-12 pt-6 pb-6" >
    <h1 class="p-2 font-bold bg-zinc-800 uppercase text-white text-center text-2xl">{{ store.instruction }}</h1>
  </div>


  <!-- ERROR Modal -->
  <template>
    <Dialog v-model:visible="store.errorActive" modal header="ERROR" :style="{ width: '35%' }" :draggable="false">
      <p>Error ID: {{ store.errorID }}</p>
      <p>Message: {{  store.errorMessage }}</p>
    </Dialog>
  </template>

  <ConfirmDialog></ConfirmDialog>

</template>


<script setup>

// VUE
import slip from 'slip';
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import router from "../router";


// Messaging & Commands
import { connection, getConnection } from '../services/websocket/mainWebSocket';
import { FrontEndCommand, BackEndCommand, OscDataType } from "../services/backendMessaging/commandEnums";
import { wsAddress } from '../services/websocket/mainWebSocket';
import { decodeMessage, frontEndCommand, backEndCommand } from '../services/backendMessaging/backendCommands';


// Stores & Data
import { useTestStationStore } from '../store/testStationStore';
import { useTestConfigStore } from '../store/testConfigStore';
import { useOverallStore } from '../store/overallStore';
import { useQualitySingleCellStore } from '../store/qualitySingleCellStore';

// Custom Components
import LightbarrierVisualComponent from '../components/Lightbarrier/LightbarrierVisualComponent.vue';
import LightBarrierModal from '../components/Lightbarrier/LightBarrierModal.vue';
import QualityTableComponent from '../components/QualitySingleCell/QualityTableComponent.vue';
import ChartQualityComponent from '../components/QualitySingleCell/ChartQualityComponent.vue';

// Primevue
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ProgressBar from 'primevue/progressbar';
import ConfirmDialog from "primevue/confirmdialog";

/* CODE STARTS HERE */

const testConfigStore = useTestConfigStore();
const store = useTestStationStore("default")
const overallStore = useOverallStore("default");
const qualitySingleCellStore = useQualitySingleCellStore();

const activeToggle = ref(true);

const currentInstruction = ref("")
const currentInstructionIcon = ref("")
const keepRed = ref(false);

const qualityTableComponentRef = ref();
const qualityChartComponentRef = ref();

const disabledBackToMenu = ref(false);
const finalResult = ref(false);


onMounted(() => {
  // Send View Command

  store.testStationInitializing = true
  store.testRunning = false;

  overallStore.lightbarrier = true;

  Keyboard.init()

  testQualitySubComponents();

  reset();

})




async function testQualitySubComponents() {
  await nextTick(); // wait for child refs & DOM to be ready
  console.log("qualityTable nextTick");

  if (qualityTableComponentRef.value) {
    qualityTableComponentRef.value.setTargetPressure(1234);
    qualityTableComponentRef.value.setLoadCellResult(1111);
    qualityTableComponentRef.value.activateManualInput();
    
  } else {
    console.warn("QualityTableComponent not ready yet");
  }

}




onUnmounted(() => {
  Keyboard.close()
  reset();
})







// Set Instructions
function setInstruction(decodedOscMessage){
  if (decodedOscMessage.args[2].value === OscDataType.String) { 

    store.instruction = decodedOscMessage.args[3].value;

  }
}

// PASS / FAIL instruction
function setFinalResult(decodedOscMessage){
  if (decodedOscMessage.args[2].value === OscDataType.String) { 

    store.instruction = decodedOscMessage.args[3].value;
    finalResult.value = true;

  }

}



function convertByteToInt(value) {
  const bytes = value instanceof Uint8Array
    ? value
    : new Uint8Array(value instanceof ArrayBuffer ? value : value);

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return view.getInt32(0, true);
}





// reset after test
function reset()
{

  qualityTableComponentRef.value?.resetQualityTable();
  qualityChartComponentRef.value?.resetChart();

  disabledBackToMenu.value = false;
  finalResult.value = false;

  // Reset testStore
  store.overallResult = 0;
  store.testRunning = false;
  store.instruction = "";


}




// Stop Test
function abortTest(){
  backEndCommand(connection, FrontEndCommand.Stop);
  console.log("abort pressed");
}


function startNewTest(){
  reset();
  backEndCommand(connection, BackEndCommand.QualitySingleNewTest);
}



// Keyboard functions
function onUpdateManualInput(value) {
  console.log("Updated manual input:", value);
  const store = useQualitySingleCellStore();
  store.manualInputResults[store.currentIndex] = value;
}

// submits to backend and closes keyboard
function onSubmitManualInput(value) {
  console.log("Submitting manual input:", value);

  //TEMP BEGIN
  qualityTableComponentRef.value.deactivateManualInput();
  qualitySingleCellStore.currentIndex++;
  
  qualityTableComponentRef.value.setTargetPressure(qualitySingleCellStore.currentIndex*1000);
  qualityTableComponentRef.value.setLoadCellResult(qualitySingleCellStore.currentIndex*1001);
  qualityTableComponentRef.value.activateManualInput();
  //TEMP END


  Keyboard.close();
}



// KEYBOARD
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
          element.dispatchEvent(new Event('input')); // ensures v-model updates TODO test this
        });
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace", "done"
    ];

    keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      const insertLineBreak = false // ["p", "enter", "-"].indexOf(key) !== -1;

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
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark", "pi", "pi-arrow-down");

          keyElement.addEventListener("click", () => {
            this.close();
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
    if (typeof this.eventHandlers[handlerName] === "function") {
      console.log("Keyboard triggering event:", handlerName, "with value:", this.properties.value);
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

  /*
  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },
  */

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue ?? "";
    this.eventHandlers.oninput = (value) => {
      // Convert to number for InputNumber
      const numericValue = Number(value);
      console.log("Keyboard input:", value, "→ numeric:", numericValue);
      oninput(numericValue); // call original handler
    };
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },


  close() {
    this.properties.value = "";
    // this.eventHandlers.oninput = oninput;
    // this.eventHandlers.onclose = onclose;
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
  box-shadow: 0 0 50px rgba(0,0,0,0.5);
  user-select: none;
  transition: bottom 0.4s;
  z-index: 9999; /* <-- add this */
}

.keyboard--hidden {
  bottom: -100%;
}

.keyboard__keys {
  text-align: center;
}

.keyboard__key {
  height: 75px;
  width: 7%;
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
  background: #e0b778
}
</style>