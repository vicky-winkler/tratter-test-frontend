<template>
  <!-- Header -->
  <div class="pl-12 pr-12 pt-6 flex justify-between">
    <div class="bg-zinc-900" style="width: 80%">
      <h1 class="p-2 pl-6 font-bold bg-zinc-800 uppercase text-white text-left text-3xl">MENU </h1>
    </div>

    <router-link style="width: 20%" :to="{ name: 'mainScreenView' }"
      class="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-4 rounded-none uppercase text-xl text-center">Back to
      Menu</router-link>
  </div>

  
  <div class="m-12 mt-6 bg-zinc-800">

    <!-- Operation Mode -->
    <div class="card flex justify-left pt-6 gap-12 pb-6">
      <label class="text-white text-right text-2xl text-center text-l py-2" style="width: 30%;">Test mode</label>
      <SelectButton :allowEmpty=false v-model="operationMode" v-on:change="operationModeChange"
        :options="operationOptions" aria-labelledby="basic" />
    </div>

    <!-- Abort Button -->
    <!-- <div class="card flex justify-right severity-danger pb-6 gap-12">
      <label class="text-white text-right text-2xl text-center text-l py-2" style="width: 30%;"  for="sCount">Abort Twincat</label>
      <Button @click="abortTwinCat" severity="contrast" style="border-radius: 0px;"> <p class="text-xl">Abort Twincat</p></Button>
    </div> -->


    <!-- Change Tool Button-->
    <div class="card flex justify-right severity-danger pb-6 gap-12">
      <label class="text-white text-right text-2xl text-center text-l py-2" style="width: 30%;"  for="sCount">Change Tool</label>
      <Button @click="changeTool" severity="contrast" style="border-radius: 0px;"> <p class="text-xl">Change Tool</p></Button>
    </div>

        <!-- Calibrate GoDex Label Printer Button-->
    <div class="card flex justify-right severity-danger pb-6 gap-12">
      <label class="text-white text-right text-2xl text-center text-l py-2" style="width: 30%;" for="sCount">Calibrate GoDex</label>
      <Button @click="calibrateGoDex" severity="contrast" style="border-radius: 0px;"> <p class="text-xl">Calibrate</p></Button>
    </div>

    <!-- CSV EXPORT Button-->
    <div class="card flex justify-right severity-danger pb-6 gap-12">
      <label class="text-white text-right text-2xl text-center text-l py-2" style="width: 30%;"  for="sCount">Data Backup</label>
      <Button @click="storeResultsUSB" severity="contrast" style="border-radius: 0px;"> <p class="text-xl">Export to USB</p></Button>
    </div>

    <!-- Change Tool Dialog -->
    <template>
      <Dialog v-model:visible="changeToolDialog" modal :style="{ width: '35%' }">
        <div class="flex justify-between gap-0">
          <ProgressSpinner />
          <div class="text-surface-500 text-2xl dark:text-surface-400 p-8 ">Machine is preparing for Tool Change, please wait until it stops moving!</div>
        </div>
      </Dialog>
    </template>


    <!-- CSV Dialog -->
    <template>
      <Dialog v-model:visible="usbExport" modal :style="{ width: '35%' }">
        <div class="flex justify-between gap-0">
          <ProgressSpinner />
          <div class="text-surface-500 text-2xl dark:text-surface-400 p-8 ">Exporting data to USB, this may take a while...</div>
        </div>
      </Dialog>
    </template>

    <!-- Error Dialog -->
    <template>
      <div class="card flex justify-center">
        <Dialog v-model:visible="store.errorActive" modal header="Error" :style="{ width: '25rem' }">
          <span class="text-surface-500 dark:text-surface-400 block mb-8">{{ store.errorID }}</span>
          <span class="text-surface-500 dark:text-surface-400 block mb-8">{{ store.errorMessage }}</span>
          <div class="flex justify-end gap-2">
            <Button type="button" severity="danger" label="OK" @click="store.errorActive = false"></Button>
          </div>
        </Dialog>
      </div>
    </template>
    <Toast position="bottom-center" />

  </div>
  
</template>




<script setup>
// Vue
import { onMounted, onBeforeMount, ref } from 'vue';
import { RouterLink } from "vue-router";
import router from '../router';
import { Buffer } from 'buffer';

// Messaging & Commands
import slip from 'slip';
import { connection } from '../services/websocket/mainWebSocket';
import { BackEndCommand, FrontEndCommand } from '../services/backendMessaging/commandEnums';
import { frontEndCommand, frontEndSettingsData, decodeMessage } from '../services/backendMessaging/backendCommands';

// Stores & Data
import { useTestConfigStore } from '../store/testConfigStore';
import useTestStationStore from '../store/testStationStore';

// Graphic Components
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import SelectButton from 'primevue/selectbutton';
import Button from 'primevue/button';


/* CODE STARTS HERE */

const toast = useToast();
window.Buffer = window.Buffer || Buffer;
const store = useTestStationStore("default")

const operationMode = ref('Boot');
const operationOptions = ref(['Boot', 'Conditioning', 'StepRecalibration', 'Quality Single Cell']);
const operationOptionsLong = ref(['Sensor', 'Boot', 'Conditioning', 'Recalibration', 'StepRecalibration', 'Quality Single Cell']);

// const size = ref('S');
// const sizeOptions = ref(['S', 'M', 'L', 'XL']);

const testConfigStore = useTestConfigStore()

const usbExport = ref(false)
const changeToolDialog = ref(false)

const previousOperationMode = ref(-1);

onBeforeMount(() => {
  operationMode.value = operationOptionsLong.value[testConfigStore.testModeID-1]
  // size.value = sizeOptions.value[testConfigStore.sizeID]
  previousOperationMode.value = testConfigStore.testModeID;
})


onMounted(() => {
  if (connection && connection.readyState === WebSocket.OPEN) {
    frontEndCommand(connection, FrontEndCommand.SettingsView);
    console.log("notified backend about new view - settings " + FrontEndCommand.SettingsView);
    listenToWebsocket();
  }    
})


// listen to websocket 8585
function listenToWebsocket(){
   connection.onmessage = (event) => {
    const dataBuffer = Buffer.from(event.data);
    decoder.decode(dataBuffer);
  };
}

// decode message
const decoder = new slip.Decoder({
    onMessage: (msg) => processData(decodeMessage(msg)),
    maxMessageSize: 209715200,
    bufferSize: 2048,
});



// interpret Websocket message
function processData(decodedOscMessage){
  console.log(decodedOscMessage)
  // Extract CommandType from Address
  const commandType = decodedOscMessage.address.split('/')[2]

  // CommandID
  const commandID = decodedOscMessage.args[1].value;

  if(commandType === "ACK"){
    console.log("ACK received! cmd id: " + commandID)
    if(commandID === FrontEndCommand.ExportCSV){
      console.log("export received 145")
      usbExport.value = false;
      toast.add({severity: 'contrast', summary: 'Data Export Successful!', detail: 'You can remove the USB stick now', life: 5000 });
    } 
    // Confirm Tool Change
    else if(commandID === FrontEndCommand.ChangeTool){
      console.log("Tool can now be changed!");
      toast.add({severity: 'contrast', summary: 'Tool Change', detail: 'Tool can now be changed!'});
    }
    // Operation Modus change SUCCESS
    else if(commandID === FrontEndCommand.OperationMode){
      toast.add({severity: 'success', summary: 'Operation Modus', detail: 'Successfully changed to ' + operationOptionsLong.value[testConfigStore.testModeID-1], life: 5000});
    } 
  }
  else if(commandType === "NACK"){
    console.log("NACK received! cmd id: " + commandID)
    if(commandID === FrontEndCommand.ExportCSV){
      usbExport.value = false;
      toast.add({severity: 'contrast', summary: 'Data Export Failed!', detail: 'Data export failed. Please check the USB drive and try again!', life: 5000 });
    } 
    // Tool Change FAILED
    else if(commandID === FrontEndCommand.ChangeTool){
      console.log("Tool can NOT be changed!");
      toast.add({severity: 'danger', summary: 'Tool Change', detail: 'Error starting Tool change. Please try again!' });
    }
    // Operation Modus change FAILED
    else if(commandID === FrontEndCommand.OperationMode){
      revertOperationModus();
      toast.add({severity: 'error', summary: 'Operation Modus', detail: 'Error Changing Operation Modus to ' + operationOptions.value[testConfigStore.testModeID - 1], life: 5000});
    }    
  }else if(commandType === "ERR"){
    // ERROR CSV Export
    if(commandID === FrontEndCommand.ExportCSV){
      console.log("error received")
      usbExport.value = false;
      store.errorActive = true;
      store.errorID = decodedOscMessage.args[1].value
      store.errorMessage = decodedOscMessage.args[2].value
    }
    // General ERROR
    else {
      console.log("error received")
      store.errorActive = true;
      store.errorID = decodedOscMessage.args[1].value
      store.errorMessage = decodedOscMessage.args[2].value
    }
  }
}


// Button -> Store Results on USB
function storeResultsUSB(){
  frontEndCommand(connection, FrontEndCommand.ExportCSV);
  usbExport.value = true;
  //toast.add({severity: 'contrast', summary: 'Data export', detail: 'Data export to USB initiated. This may take a few seconds', life: 5000 });
  console.log("notified backend about data export request: " + FrontEndCommand.ExportCSV);
}

// Button -> Change Tool Command
function changeTool(){
  frontEndCommand(connection, FrontEndCommand.ChangeTool);
  // changeToolDialog.value = true;
  //toast.add({severity: 'contrast', summary: 'Data export', detail: 'Data export to USB initiated. This may take a few seconds', life: 5000 });
  console.log("notified backend about tool change: " + FrontEndCommand.ChangeTool);
}


// Button -> Calibrate GoDexPritner command
function calibrateGoDex(){
  frontEndCommand(connection, FrontEndCommand.CalibrateGoDex);
  console.log("notified backend about tool change: " + FrontEndCommand.CalibrateGoDex);
}



// Abort Twincat
function abortTwinCat(){
  frontEndCommand(connection, FrontEndCommand.Stop);
  console.log("notified backend about abort Twincat: " + FrontEndCommand.Stop);
}


// Set Operation Mode const operationOptions = ref(['Sensor', 'Boot', 'Conditioning', 'Recalibration', 'StepRecalibration', 'Quality Single Cell']);
function operationModeChange(event) {
  // set previous operation Mode
  previousOperationMode.value = testConfigStore.testModeID;

  // determine Operation Mode
  var operatingMode = 0;

  if(event.value === operationOptions.value[0]){
    operatingMode = 2;
  }
  else if(event.value === operationOptions.value[1]){
   operatingMode = 3;
  }
  else if(event.value === operationOptions.value[2]){
   operatingMode = 5;
  }
  else if(event.value === operationOptions.value[3]){
   operatingMode = 6;
  }



  // for (let i = 0; i < 6; i++) {
  //   if (event.value === operationOptions.value[i]) {
  //     operatingMode = i+1;
  //     break;
  //   }
  // }

  // update Store and visuals
  testConfigStore.testModeID = operatingMode;

  // send to Backend if connected
  if (connection && connection.readyState === WebSocket.OPEN) {
    frontEndSettingsData(connection, FrontEndCommand.OperationMode, operatingMode);



    console.log("notified backend about new setting - operation mode: " + FrontEndCommand.OperationMode + " value: " + testConfigStore.testModeID);

  }
  else{
    // Backend Not Connected
    console.log("Backend not reachable...");
    revertOperationModus();
  }
}


// go back to previous operation mode when failed (e.g. bad connection to twincat or no connection to backend)
function revertOperationModus(){
  console.log("Revert Operation Modus to " + operationOptions.value[previousOperationMode.value-1]);
  toast.add({severity: 'error', summary: 'Operation Modus', detail: 'Error Changing Operation Modus to ' + operationOptions.value[testConfigStore.testModeID - 1], life: 5000});
  testConfigStore.testModeID = previousOperationMode.value;
  operationMode.value = operationOptions.value[testConfigStore.testModeID-1]

}



</script>


