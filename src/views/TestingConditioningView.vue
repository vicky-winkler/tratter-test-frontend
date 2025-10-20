<template>
  <!-- HEADER: title + BACK Button -->
  <div class="pl-12 pr-12 pt-6 flex justify-between">
    <div class="bg-zinc-900" v-if="activeToggle === true" style="width: 80%">
        <h1 class="p-2 pl-6 font-bold bg-zinc-800 text-white text-left text-3xl">CONDITIONING-TEST-PANEL</h1>
    </div>
    <div class="bg-zinc-900" v-else style="width: 100%">
        <h1 class="p-2 pl-6 font-bold bg-zinc-800 uppercase text-white text-left text-3xl">CONDITIONING-TESTPANEL</h1>
    </div>
    <button v-if="store.testRunning" style="width: 20%;"
      class=" bg-orange-400 hover:bg-red-400 text-white font-semibold py-2 px-4 rounded-none text-center"
      @click="abortTest">Stop Test
    </button>
    <router-link style="width: 20%" :to="{ name: 'mainScreenView' }"
        class="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-4 rounded-none uppercase text-xl text-center">Back to Menu</router-link>
  </div>

    <!-- Progress Bar -->
    <div class="pl-12 pr-12">
      <ProgressBar v-if="store.testRunning" mode="indeterminate" class="rounded-none" style="border-radius: 0px; height: 6px;"></ProgressBar>
      <ProgressBar v-else :value="0" class="rounded-none" style="border-radius: 0px; height: 6px;"></ProgressBar>
    </div>


    <ConfirmDialog></ConfirmDialog>

    <!-- Body SENSOR STACK & TEST DURATION TIMER & SCAN Sensor Component -->
    <div class="pl-12 pr-12 pb-6 pt-6 flex gap-6">
      <LightbarrierVisualComponent v-if="overallStore.lightbarrier" :color="overallStore.lightBarrierColorId"></LightbarrierVisualComponent>
      <TestDurationTimerComponent v-if="enableTestDurationTimerComponent" class="w-1/2 flex-none" ref="TestDurationTimerComponentRef"></TestDurationTimerComponent>
      <ScanSensorComponent v-else class="w-1/2 flex-none" ref="ScanSensorComponentRef"></ScanSensorComponent>
      <SensorStackComponent class="flex flex-auto" ref="SensorStackComponentRef" @select-heating-time="showTestDurationTimerComponent" @unselect-heating-time="hideTestDurationTimerComponent"></SensorStackComponent>
      <LightbarrierVisualComponent v-if="overallStore.lightbarrier" :color="overallStore.lightBarrierColorId"></LightbarrierVisualComponent>
    </div>
  

      <!-- Instructions -->
    <div v-if="store.instruction !== '' " class="pl-12 pr-12 pt-6 pb-6" >
      <h1 class="p-2 font-bold bg-zinc-800 uppercase text-white text-center text-2xl">{{ store.instruction }}</h1>
    </div>


    <!-- SPINNER - Initializing -->
    <template>
        <Dialog v-model:visible="store.testStationInitializing" modal :style="{ width: '35%' }">
          <div class="flex justify-between gap-0">
            <ProgressSpinner />
            <div class="text-surface-500 uppercase text-4xl dark:text-surface-400 p-8 ">Initializing...</div>
          </div>
        </Dialog>
    </template>


    <!-- ERROR -->
    <template>
        <Dialog class="flex flex-col justify-left" v-model:visible="store.errorActive" modal header="Error" :style="{ width: '35%' }">
          <span class="text-surface-500 dark:text-surface-400  mb-8">ID: {{ store.errorID }}</span>
          <br>
          <span class="text-surface-500 dark:text-surface-400  mb-8">{{ store.errorMessage }}</span>
          <div class="flex justify-end gap-2">
            <Button severity="danger" type="button" label="OK" @click="store.errorActive = false"></Button>
          </div>
        </Dialog>
    </template>

    <!-- RESULT -->
    <template>
        <Dialog v-model:visible="resultModal" modal header="Result" :style="{ width: '35%' }">
          <h1 class="bg-emerald-400 text-white text-5xl text-center py-4" v-if="store.finalGrade === 1">OK</h1>
          <h1 class="bg-red-400 text-white text-5xl text-center py-4" v-if="store.finalGrade === 2">NOT OK</h1>
        </Dialog>
    </template>
</template>


<script setup>
// VUE
import slip from 'slip';
import { ref, onMounted, onUnmounted, onBeforeMount } from "vue";


// Messaging & Commands
import { connection } from '../services/websocket/mainWebSocket';
import { FrontEndCommand, BackEndCommand, OscDataType } from "../services/backendMessaging/commandEnums";
import { decodeMessage, frontEndCommand, backEndCommand } from '../services/backendMessaging/backendCommands';


// Stores & Data
import { useTestConditioningStore } from '../store/testConditioningStore';
import { useOverallStore } from '../store/overallStore';

// Graphic Components
import ProgressSpinner from 'primevue/progressspinner';
import ProgressBar from 'primevue/progressbar';
import ConfirmDialog from 'primevue/confirmdialog';
import Dialog from 'primevue/dialog';
import Button from "primevue/button";


// Custom Components
import SensorStackComponent from "../components/Conditioning/SensorStackComponent.vue";
import TestDurationTimerComponent from "../components/Conditioning/TestDurationTimerComponent.vue";
import ScanSensorComponent from '../components/Conditioning/ScanSensorComponent.vue';
import LightbarrierVisualComponent from '../components/Lightbarrier/LightbarrierVisualComponent.vue';
import LightBarrierModal from '../components/Lightbarrier/LightBarrierModal.vue';

/* CODE STARTS HERE */
const store = useTestConditioningStore("default")
const overallStore = useOverallStore("default");

const SensorStackComponentRef = ref();
const TestDurationTimerComponentRef = ref();
const ScanSensorComponentRef = ref();
const enableTestDurationTimerComponent = ref(false);
const resultModal = ref(false);
const activeToggle = ref(true);


onBeforeMount(() => {
})


onUnmounted(() => {
  store.testStationInitializing = true
  reset();
})


onMounted(() => {
  // Send View Command
  if (connection) {
    frontEndCommand(connection, FrontEndCommand.TestingView);
    console.log("Testing View - listen Websocket");
    listenToWebsocket();
  }

  // TODO for testing purposes only
  // ScanSensorComponentRef.value.setSerialNumber("SN12308AAA");
  // ScanSensorComponentRef.value.setRfid("A93720870234");
  // ScanSensorComponentRef.value.setSizeAndOrientation("5", "L");
  // ScanSensorComponentRef.value.setQrCode("08120872140871134");
  // store.finalGrade = 2;
  // resultModal.value = true;
  overallStore.lightbarrier = true;

})

// listen to websocket 8585
function listenToWebsocket(){
   connection.onmessage = (event) => {
    const dataBuffer = Buffer.from(event.data);
    decoder.decode(dataBuffer);
  };
}


const decoder = new slip.Decoder({
    onMessage: (msg) => processMessage(decodeMessage(msg)),
    maxMessageSize: 209715200,
    bufferSize: 2048,
});



// Backend Communication
function processMessage(decodedOscMessage) {
    // Extract CommandType from Address
    const commandType = decodedOscMessage.address.split('/')[2]

    // CommandID
    const commandID = decodedOscMessage.args[1].value;

    console.log("Message received" + commandType + " , " + commandID)

    // Handle DATA
    if(commandType === "DATA"){
      // if DATA + Instruction
      if(commandID === FrontEndCommand.Instructions){
        console.log("Instructions");
        setInstruction(decodedOscMessage);
      }
      // DATA Scan RFID
      if(commandID === BackEndCommand.OvenScanRfids){
        console.log("RFID" + decodedOscMessage.args[3].value);
        // SensorStackComponentRef.value.addSensor(decodedOscMessage.args[3].value);
        ScanSensorComponentRef.value.setRfid(decodedOscMessage.args[3].value);
      }
      // DATA QrCodeScanner
      if(commandID === BackEndCommand.OvenScanQrCode){
        // reset Sensor Component
        ScanSensorComponentRef.value?.resetComponent();

        // add QrCode
        ScanSensorComponentRef.value.setQrCode(decodedOscMessage.args[3].value);

        
      }
      // DATA Size And Orientation
      if(commandID === BackEndCommand.OvenSizeAndOrientation){
        setSizeAndOrientation(decodedOscMessage);
      }
      // DATA SerialNumber
      if(commandID === BackEndCommand.OvenSerialNumber){
        ScanSensorComponentRef.value.setSerialNumber(decodedOscMessage.args[3].value);
        SensorStackComponentRef.value.addSensor(decodedOscMessage.args[3].value);
      }

    }
    // Handle CMD
    else if(commandType === "CMD"){
      // Confirms that TwinCat is ready!
      if (commandID === BackEndCommand.OvenReadyToTest) {
        // Stop Spinner - Initializing
        store.testStationInitializing = false;
      }
      // After Start Button
      else if(commandID === BackEndCommand.OvenTesting){
        startButtonPressed();
      }
      // SCAN RFIDs - OLD
      else if(commandID === BackEndCommand.OvenScanRfids){
        reset(); //- gives reference ERROR (initially!!! - as component not defined!)
      }
      else if(commandID === BackEndCommand.OvenScanQrCode){
        reset(); //- gives reference ERROR (initially!!! - as component not defined!)
      }
    }
    else if(commandType === "ACK"){
      // FINAL RESULT OK
      if(commandID === BackEndCommand.OvenFinalResult){
        // TestDurationTimerComponentRef.value.stopCountdown();
        store.testRunning = false;
        enableTestDurationTimerComponent.value = false;
        store.finalGrade = 1;
        resultModal.value = true;
      }
      // Lightbarrier (OFF)
      else if(commandID === FrontEndCommand.LightBarrier){
        overallStore.Lightbarrier = true;
        if(store.testRunning){
          // remains RED
          overallStore.lightBarrierColorId = 2;
        }
        else{
          // GREEN
          overallStore.lightBarrierColorId = 1;
        }
       
      }
    }
    else if(commandType === "NACK"){
      // FINAL RESULT FAILED
      if(commandID === BackEndCommand.OvenFinalResult){
        // TestDurationTimerComponentRef.value.stopCountdown();
        store.testRunning = false;
        enableTestDurationTimerComponent.value = false;
        store.finalGrade = 2;
        resultModal.value = true;
      }
      // Lightbarrier (ON)
      else if(commandID === FrontEndCommand.LightBarrier){
        overallStore.Lightbarrier = true;
        console.log("lightbarrier NACK..." + overallStore.Lightbarrier);
         if(store.testRunning){
          // RED => issue
          overallStore.lightBarrierColorId = 2;
        }
        else{
          // WHITE (not an issue)
          overallStore.lightBarrierColorId = 0;
        }
      }
    }
    // Handle ERROR
    else if(commandType === "ERR"){
      console.log("ERROR received!");

      if (decodedOscMessage.args[1].value === -1) { 
        store.errorActive = false;
        store.errorID = -1
        store.errorMessage = ""
      } else {
        store.errorActive = true;
        store.errorID = decodedOscMessage.args[1].value
        store.errorMessage = decodedOscMessage.args[2].value
        console.log("error active")

        // stop test and reset
        // store.testRunning = false;
        // reset();
      }
    }
}



// shows TestDuration panel
function showTestDurationTimerComponent(){
  console.log('show test duration');
  enableTestDurationTimerComponent.value = true;
}

function hideTestDurationTimerComponent(){
  console.log('hide test duration');
  enableTestDurationTimerComponent.value = false;
}

// start button pressed
function startButtonPressed(){
  SensorStackComponentRef.value.disableScanning();
  TestDurationTimerComponentRef.value.startCountdown();
  // progress bar
  store.testRunning = true;
}



// Reset last values when scanning new Sole
function reset() {
  ScanSensorComponentRef.value?.resetComponent();
  SensorStackComponentRef.value?.resetComponent();
  TestDurationTimerComponentRef.value?.resetComponent();
  store.finalGrade = 0;
  // overallStore.lightBarrierColorId = 1;
}


// Set Instructions
function setInstruction(decodedOscMessage){
  if (decodedOscMessage.args[2].value === OscDataType.String) { 

    store.instruction = decodedOscMessage.args[3].value;

  }
}


// abort Test = Stop Button
function abortTest(){
  backEndCommand(connection, FrontEndCommand.Stop);
  console.log("abort pressed");
}


function setSizeAndOrientation(decodedOscMessage){
  var args = decodedOscMessage.args[3].value.trim().split(",");

  ScanSensorComponentRef.value.setSizeAndOrientation(args[0], args[1]);

  SensorStackComponentRef.value.setSize(args[0]);
}



</script>


<style>
</style>