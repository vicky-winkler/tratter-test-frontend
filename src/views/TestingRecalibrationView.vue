<template>
    <!-- title + BACK Button -->
    <div class="pl-12 pr-12 pb-6 pt-6 flex justify-between">
      <div class="bg-zinc-900" v-if="activeToggle === true" style="width: 80%">
        <h1 class="p-2 pl-6 font-bold bg-zinc-800 text-white text-left text-3xl">RECALIBRATION-TEST-PANEL</h1>
      </div>
      <div class="bg-zinc-900" v-else style="width: 100%">
        <h1 class="p-2 pl-6 font-bold bg-zinc-800 uppercase text-white text-left text-3xl">RECALIBRATION-TEST-PANEL</h1>
      </div>
      <button v-if="store.testRunning" style="width: 20%;"
        class=" bg-orange-400 hover:bg-red-400 text-white font-semibold py-2 px-4 rounded-none text-center"
        @click="abortTest">Stop Test
      </button>
      <router-link style="width: 20%" :to="{ name: 'mainScreenView' }"
        class="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-4 rounded-none uppercase text-xl text-center">Back to Menu
        </router-link>
    </div>
  
     <!-- Below Title Header -->
    <div class="pl-12 pr-12">
      <ConfirmDialog></ConfirmDialog>
      <ProgressBar v-if="store.testRunning" mode="indeterminate" class="rounded-none" style="border-radius: 0px; height: 6px;"></ProgressBar>
      <ProgressBar v-else :value="0" class="rounded-none" style="border-radius: 0px; height: 6px;"></ProgressBar>
    </div>
  
  
  
  <!-- Results Header -->
    <div class="pl-12 pr-12 pt-6 pb-6">
      <!-- Ready evtl. store.rfidState === false && store.sensorState === false && store.sensorTestResult === 0 && store.overallResult === 0 -->
      <div v-if="!store.testRunning && !store.testStationInitializing && store.overallResult === 0"
        class="flex-1 justify-content-center py-2 bg-zinc-400 text-white uppercase text-2xl">Ready
      </div>
      <!-- Results -->
      <div v-else class="gap-6 flex flex-row justify-between">
        <!-- Sensor Size -->
        <div class="bg-zinc-400" style="width: 10%;">
          <h1 v-if="!store.rfidState" class="p-2 bg-zinc-400 uppercase text-white text-center text-2xl">SIZE</h1>
          <h1 v-else-if="store.rfidState" class="p-2 font-bold bg-green-400 uppercase text-black text-center text-2xl">{{ store.size }}</h1>
        </div>
        <!-- Sensor UUID (rfid) old: 20% -->
        <div class="bg-zinc-400" style="width: 30.3%;">
          <h1 v-if="!store.rfidState" class="p-2 bg-zinc-400 uppercase text-white text-center text-2xl">UUID</h1>
          <h1 v-else-if="store.rfidState" class="p-2 font-bold bg-green-400 uppercase text-black text-center text-2xl">{{ store.uuid }}</h1>
        </div>
        <!-- Sensor Orientation L/R-->
        <div class="bg-zinc-400" style="width: 10%;">
          <h1 v-if="!store.rfidState" class="p-2 bg-zinc-400 uppercase text-white text-center text-2xl">L / R</h1>
          <h1 v-else-if="store.rfidState" class="p-2 font-bold bg-green-400 uppercase text-black text-center text-2xl">{{ store.orientation }}</h1>
        </div>
        <!-- MacAddress = EcuDeviceID old: 19.45% -->
        <!-- <div class="bg-zinc-400" style="width: 24.7%;">
          <h1 v-if="!store.sensorState" class="p-2 bg-zinc-400 uppercase text-white text-center text-2xl">Mac Address</h1>
          <h1 v-else-if="store.sensorState" class="p-2 font-bold bg-green-400 uppercase text-black text-center text-2xl">{{ store.macAddress }}</h1>
        </div> -->
        <!-- Result Sensor/Boot -->
        <!-- <div class="bg-zinc-400" style="width: 15.55%;">
          <h1 v-if="store.sensorTestResult === 0" class="p-2 bg-zinc-400 uppercase text-white text-center text-2xl">Boot</h1>
          <h1 v-if=" store.sensorTestResult === 1" class="p-2 font-bold bg-green-400 uppercase text-black text-center text-2xl">PASS</h1>
          <h1 v-else-if="store.sensorTestResult === 2" class="p-2 font-bold bg-red-400 uppercase text-white text-center text-2xl">FAIL</h1>
        </div> -->
        <!-- TOTAL Result -->
        <div class="bg-zinc-400" style="width: 25%;">
          <h1 v-if="store.overallResult === 0" class="p-2 font-bold bg-zinc-800 uppercase text-white text-center text-2xl">Test Result</h1>
          <h1 v-if=" store.overallResult === 1" class="p-2 font-bold bg-green-400 uppercase text-black text-center text-2xl">PASS</h1>
          <h1 v-else-if="store.overallResult === 2" class="p-2 font-bold bg-red-400 uppercase text-white text-center text-2xl">FAIL</h1>
        </div>
      </div>
    </div>
  
  
  
    <!-- Chart and Testing Component -->
    <div class=" pl-12 pr-12 flex gap-6 align-items-end justify-between">
      <BootResultComponent class="rounded-none" style="width: 40%; min-height: 50vh;" ref="bootResultComponentRef"></BootResultComponent>
      <ChartBootComponent  class="rounded-none" style="width: 60%; min-height: 50vh;" ref="chartComponentRef"></ChartBootComponent>
    </div> 
  
      <!-- Instructions -->
    <div v-if="store.instruction !== '' " class="pl-12 pr-12 pt-6 pb-6" >
      <h1 class="p-2 font-bold bg-zinc-800 uppercase text-white text-center text-2xl">{{ store.instruction }}</h1>
    </div>
  
    <!-- RFID Modal -->
    <template>
      <Dialog v-model:visible="rfidModalVisible" modal header="RFID" :style="{ width: '35%' }">
        <RfidWarningModal />
      </Dialog>
    </template>
  
  </template>
  
  
  <script setup>
  
  // VUE
  import slip from 'slip';
  import { ref, onMounted, onUnmounted } from "vue";
  import router from "../router";
  
  
  // Messaging & Commands
  import { connection } from '../services/websocket/mainWebSocket';
  import { FrontEndCommand, BackEndCommand, OscDataType } from "../services/backendMessaging/commandEnums";
  import { wsAddress } from '../services/websocket/mainWebSocket';
  import { decodeMessage, frontEndCommand, backEndCommand} from '../services/backendMessaging/backendCommands';
  
  
  // Stores & Data
  import { useTestStationStore } from '../store/testStationStore';
  import { useTestConfigStore } from '../store/testConfigStore';
  
  
  // Components
  import TestingComponent from "../components/TestPanelComponents/TestingComponent.vue";
  import ChartBootComponent from '../components/TestPanelComponents/ChartBootComponent.vue';
  import RfidWarningModal from '../components/TestPanelComponents/RfidWarningModal.vue';
  import BootResultComponent from '../components/BootTest/BootResultComponent.vue';
  
  // Primevue
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  
  
  /* CODE STARTS HERE */
  
  const testConfigStore = useTestConfigStore();
  const store = useTestStationStore("default")
  
  
  const activeToggle = ref(true);
  const chartComponentRef = ref(null);
  const bootResultComponentRef = ref(null);
  
  
  const currentInstruction = ref("")
  const currentInstructionIcon = ref("")
  const rfidModalVisible = ref(false);
  
  
  
  onMounted(() => {
    // Send View Command
    if (connection) {
      frontEndCommand(connection, FrontEndCommand.TestingView);
      console.log("Testing View - listen Websocket");
      listenToWebsocket();
    }
  
    store.testStationInitializing = true
  
    rfidModalVisible.value = true;
    
  
  })
  
  
  
  onUnmounted(() => {
    reset();
  })
  
  
  
  // listen to websocket 8585
  function listenToWebsocket() {
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
  
  
  // interpret Websocket message and evaluate/push to child component!!
  function processData(decodedOscMessage){
  
    // Extract CommandType from Address
    const commandType = decodedOscMessage.address.split('/')[2]
  
    // CommandID
    const commandID = decodedOscMessage.args[1].value;
  
    // DATA
    if(commandType === "DATA"){
        // If DATA + MeasurementData => Chart
      if(commandID === BackEndCommand.RecalRecordingDataBoot){
        console.log("Measurement Data Boot Recal");
        chartComponentRef.value.processMessage(decodedOscMessage);
      }
      else if(commandID === BackEndCommand.RecalRecordingDataCalibration){
        console.log("Measurement Data Calibration Recal");
        chartComponentRef.value.processMessage(decodedOscMessage);
      }
     // if DATA + FinalResults => TestingComponent
    //   else if(commandID === BackEndCommand.RecalFinalResult){
    //     console.log("Final Results - 10 ints");
    //     bootResultComponentRef.value.setResults(decodedOscMessage);
    //   }
      // if DATA + FinalStatusResults => TestingComponent
    //   else if(commandID === BackEndCommand.RecalFinalResult){
    //     console.log("Final Status Results");
    //     setOverallResult(decodedOscMessage);
    //   }
      // if DATA + Size Orientation RFID
      else if(commandID === BackEndCommand.RecalSizeOrientationRFID){
        console.log("Size, Orientation + RFID");
        setSizeOrientationAndUUID(decodedOscMessage);
        rfidModalVisible.value = false;
      }
      // if DATA + RFID => Testing Component
    //   else if(commandID === BackEndCommand.BootMacAddress){
    //     console.log("Mac Address");
    //     setMacAddress(decodedOscMessage);
    //   }
      // if DATA + Instruction
      else if(commandID === FrontEndCommand.Instructions){
        console.log("Instructions");
        setInstruction(decodedOscMessage);
      }
    }
  
  
    // CMD
    else if(commandType === "CMD"){
      // if CMD + INIT_TESTING => Chart + TestingComponent
      if(commandID === BackEndCommand.RecalInitTesting){
        console.log("InitTesting");
        
        // chartComponentRef.value.processMessage(decodedOscMessage);
  
  
      }
      // if CMD + ReadyToTest = Operative ReadRFID
      else if(commandID === BackEndCommand.RecalScanRFID){
        console.log("RFID Scanned");
        reset();
        store.testRunning = true;
        store.testStationInitializing = false;
        bootResultComponentRef.value.resetComponent();
        chartComponentRef.value.processMessage(decodedOscMessage);
      }
      // if CMD + Resetting/StopRoutine => TestingComponent
      else if(commandID === BackEndCommand.RecalResetTeststation){
        console.log("Resetting/ReadyToTest/ReadRFID");
  
        // Reset
        store.testRunning = false;
        reset();
  
      }
    }
  
  
    // ERR => TestingComponent
    else if(commandType === "ERR"){
      console.log("error");
  
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
        store.testRunning = false;
        reset();
      }
    }
  
  
    // ACK/NACK
    else {
      console.log("ELSE!!");
  
      if(commandID === BackEndCommand.RecalScanRFID && commandType == "NACK"){
        console.log("rfid not ok")
        store.errorActive = true;
        store.errorID = 0;
        store.errorMessage = "No RFID!"
      }
      else if(commandID === BackEndCommand.RecalScanRFID && commandType == "ACK"){
        console.log("rfid ok");
      }
    }
  }
  
  
  
  
  // Set Size, Orientation, UUID
  function setSizeOrientationAndUUID(decodedOscMessage)
  {
    if (decodedOscMessage.args[2].value === OscDataType.String) { 
  
      var args = decodedOscMessage.args[3].value.trim().split(",")
  
      // size
      store.size = args[0];
      // orientation
      store.orientation = args[1].trim() === "L" || args[1].trim() === "R" ? args[1].trim() : "";
      store.leftSensorOrientation = args[1] === "L" ? true : false  // TODO test if this does anything!!!
      // UUID
      store.uuid = args[2]
  
      store.rfidState = true;
    }
  }
  
  
  // Sets SensorId and Size
  function setMacAddress(decodedOscMessage)
  {
    if (decodedOscMessage.args[2].value === OscDataType.String) { 
      
      // macAddress
      store.macAddress = decodedOscMessage.args[3].value;
  
      store.sensorState = true;
    }
  }
  
  
  
  // Sets overall Result when sensorTestResult is done
  function setOverallResult(decodedOscMessage)
  {
  
    // console.log("Result all: ");
    // for(var i = 0; i < 5; i++){
    //   console.log(decodedOscMessage.args[5].value[i]);
    // }
  
  
    // check okResult
    var okResult = true;
    for(var i = 0; i < 5; i++){
      if(!decodedOscMessage.args[5].value[i]){
        okResult = false;
        break;
      }
    }
  
    // qr and rfid and sensor values OK
    if(store.rfidState && store.sensorState && okResult){
      // OK
      store.overallResult = 1
    }
    // not ok
    else {
      store.overallResult = 2
    }
  
    // Stop progress bar!
    store.testRunning = false;
  
  }
  
  
  // Set Instructions
  function setInstruction(decodedOscMessage){
    if (decodedOscMessage.args[2].value === OscDataType.String) { 
  
      store.instruction = decodedOscMessage.args[3].value;
  
    }
  }
  
  
  
  // reset after test
  function reset()
  {
  
    // Reset testStore
    store.finalGrade = 0;
    store.testRunning = false;
    store.serialNumber = "";
    store.sensorState = false,
    store.sensorID = "";
    store.size = 0;
    store.rfidState = false;
    store.uuid = "";
    store.orientation = "L";
    store.sensorTestResult = 0;
    store.overallResult = 0;
    store.macAddress = "";
    store.instruction = "";
  
    chartComponentRef.value?.ResetChart();
  
  }
  
  
  
  // Stop Test
  function abortTest(){
    backEndCommand(connection, FrontEndCommand.Stop);
    console.log("abort pressed");
  }
  
  
  
  </script>
  
  
  <style></style>