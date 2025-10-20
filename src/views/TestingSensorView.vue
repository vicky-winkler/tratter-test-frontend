<template>
  <!-- Header: Title + BACK Button -->
  <div class="pl-12 pr-12 pb-0 pt-6 flex justify-between">
    <div class="bg-zinc-900" v-if="activeToggle === true" style="width: 80%">
      <h1 class="p-2 pl-6 font-bold bg-zinc-800 text-white text-left text-3xl">SENSOR-TEST-PANEL </h1>
    </div>
    <div class="bg-zinc-900" v-else style="width: 100%">
      <h1 class="p-2 pl-6 font-bold bg-zinc-800 uppercase text-white text-left text-3xl">SENSOR-TEST-PANEL </h1>
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
    <!-- <div v-if="!store.testRunning && !store.testStationInitializing && store.overallResult === 0"
      class="flex-1 justify-content-center py-2 bg-zinc-400 text-white uppercase text-2xl">Ready
    </div> -->
    <!-- Results -->
    <div class="gap-6 flex flex-row justify-between">
      <!-- Sensor Size -->
      <div class="bg-zinc-400" style="width: 10%;">
        <h1 v-if="!store.sensorState" class="p-2 bg-zinc-400 uppercase text-white text-center text-2xl">SIZE</h1>
        <h1 v-else-if="store.sensorState" class="p-2 font-bold bg-green-400 uppercase text-black text-center text-2xl">{{ store.size }}</h1>
      </div>
      <!-- Sensor Id = Sensor QR Code -->
      <div class="bg-zinc-400" style="width: 30.4%;">
        <h1 v-if="!store.sensorState" class="p-2 bg-zinc-400 uppercase text-white text-center text-2xl">Sensor ID</h1>
        <h1 v-else-if="store.sensorState" class="p-2 font-bold bg-green-400 uppercase text-black text-center text-2xl">{{ store.sensorId }}</h1>
      </div>
      <!-- Sensor Orientation L/R-->
      <div class="bg-zinc-400" style="width: 10%;">
        <h1 v-if="!store.rfidState" class="p-2 bg-zinc-400 uppercase text-white text-center text-2xl">L / R</h1>
        <h1 v-else-if="store.rfidState" class="p-2 font-bold bg-green-400 uppercase text-black text-center text-2xl">{{ store.orientation }}</h1>
      </div>
      <!-- Sensor UUID (rfid) -->
      <div class="bg-zinc-400" style="width: 24.6%;">
        <h1 v-if="!store.rfidState" class="p-2 bg-zinc-400 uppercase text-white text-center text-2xl">UUID</h1>
        <h1 v-else-if="store.rfidState" class="p-2 font-bold bg-green-400 uppercase text-black text-center text-2xl">{{ store.uuid }}</h1>
      </div>
      <!-- Result Sensor -->
      <!-- <div class="bg-zinc-400" style="width: 15.55%;">
        <h1 v-if="store.sensorTestResult === 0" class="p-2 bg-zinc-400 uppercase text-white text-center text-2xl">Sensor</h1>
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
    <TestingComponent class="rounded-none " style="width: 40%; min-height: 50vh;" ref="testingComponentRef"></TestingComponent>
    <ChartComponent  class="rounded-none" style="width: 60%; min-height: 50vh;" ref="chartComponentRef"></ChartComponent>
  </div> 

  <!-- Instructions -->
  <div v-if="store.instruction !== '' " class="pl-12 pr-12 pt-6 pb-6" >
    <h1 class="p-2 font-bold bg-zinc-800 uppercase text-white text-center text-2xl">{{ store.instruction }}</h1>
  </div>
  


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

    <!-- RFID Modal -->
    <template>
      <Dialog v-model:visible="rfidModalVisible" modal header="RFID" :style="{ width: '60%' }">
          <RfidWarningModal />
      </Dialog>
    </template>


    <!-- SPINNER - Initializing -->
    <template>
        <Dialog v-model:visible="store.testStationInitializing" modal :style="{ width: '35%' }">
          <div class="flex justify-between gap-0">
            <ProgressSpinner />
            <div class="text-surface-500 uppercase text-4xl dark:text-surface-400 p-8 ">Initializing...</div>
          </div>
        </Dialog>
    </template>

</template>

<script setup>
// VUE
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from "vue-router";

// Messaging and Commands
import slip from 'slip';
import { connection } from '../services/websocket/mainWebSocket';
import { frontEndCommand, decodeMessage } from '../services/backendMessaging/backendCommands';
import { BackEndCommand, FrontEndCommand, OscDataType } from '../services/backendMessaging/commandEnums';

// Stores & Data
import { useTestStationStore } from '../store/testStationStore';
import { useTestConfigStore } from '../store/testConfigStore';

// Graphic Components
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import ProgressBar from 'primevue/progressbar';
import ConfirmDialog from 'primevue/confirmdialog';


// OBJ Components
import TestingComponent from "../components/TestPanelComponents/TestingComponent.vue";
import ChartComponent from '../components/TestPanelComponents/ChartComponent.vue';
import RfidWarningModal from '../components/TestPanelComponents/RfidWarningModal.vue';




/* CODE STARTS HERE */

const store = useTestStationStore("default")
const testConfigStore = useTestConfigStore(); //TODO chech if this does something!



const activeToggle = ref(true);

const chartComponentRef = ref(null);
const testingComponentRef = ref(null);
const rfidModalVisible = ref(false);


onMounted(() => {
  // Send View Command
  if (connection) {
    console.log("Testing View - listen Websocket");
    frontEndCommand(connection, FrontEndCommand.TestingView);
    listenToWebsocket();
  }

  // set Initializing to true
  store.testStationInitializing = true
  rfidModalVisible.value = true;
  
  // TESTing ONLY TODO delete later
  // store.testRunning = true;
  // store.size = 3;
  // store.sensorState = true;
  // store.sensorId = "123456789098765434"
  // store.rfidState = true;
  // store.uuid = "ASDL235DAFVL34"
  // store.orientation = "L"
  // store.sensorTestResult = 2;
  // store.overallResult = 2;
  // store.instruction = "HALLO ICH BIN EINE INSTRUCTION";

})


onUnmounted(() => {
  console.log("unmounted testing view")
  if(connection){
    connection.onmessage = null
  }

  reset();
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


// interpret Websocket message and evaluate/push to child component!!
function processData(decodedOscMessage){

  // Extract CommandType from Address
  const commandType = decodedOscMessage.address.split('/')[2]

  // CommandID
  const commandID = decodedOscMessage.args[1].value;

  // DATA
  if(commandType === "DATA"){
      // If DATA + MeasurementData => Chart
    if(commandID === BackEndCommand.MeasurementData){
      console.log("Measurement Data");
      chartComponentRef.value.processMessage(decodedOscMessage);
    }
   // if DATA + FinalResults => TestingComponent
    else if(commandID === BackEndCommand.FinalResults){
      console.log("Final Results");
      testingComponentRef.value.processMessage(decodedOscMessage);
      setOverallResult(decodedOscMessage);
    }
    // if DATA + Size and SensorId
    else if(commandID === BackEndCommand.SizeAndSensorId){
      console.log("Size and SensorId");
      setSizeAndSensorId(decodedOscMessage);
      rfidModalVisible.value = false;
    }
    // if DATA + RFID 
    else if(commandID === BackEndCommand.RfidAndOrientation){
      console.log("RFid & Orientation");
      setRfidAndOrientation(decodedOscMessage);
    }
    // if DATA + Instruction
    else if(commandID === FrontEndCommand.Instructions){
      console.log("Instructions");
      setInstruction(decodedOscMessage);
    }
  }


  // CMD
  else if(commandType === "CMD"){
    // if CMD + INIT_TESTING => Chart
    if(commandID === BackEndCommand.InitTesting){
      console.log("InitTesting");
      reset();

      store.testRunning = true;

      chartComponentRef.value.processMessage(decodedOscMessage);

    }
    // if CMD + ReadyToTest = Operative
    else if(commandID === BackEndCommand.ReadyToTest){
      console.log("Ready to Test");
      store.testStationInitializing = false;

      chartComponentRef.value.processMessage(decodedOscMessage);


    }
    // if CMD + Resetting/StopRoutine 
    else if(commandID === BackEndCommand.Resetting || commandID === BackEndCommand.Stop || commandID === BackEndCommand.ReadyToTest){
      console.log("Resetting/StopRoutine/ReadyToTest/ReadRFID");

      // Reset
      store.testRunning = false;
      reset();

    }
  }


  // ERR
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

    if(commandID === BackEndCommand.ReadRFID && commandType == "NACK"){
      console.log("rfid not ok")
      store.errorActive = true;
      store.errorID = 0;
      store.errorMessage = "No RFID!"
    }
    else if(commandID === BackEndCommand.ReadRFID && commandType == "ACK"){
      console.log("rfid ok");
    }
  }
}





// Sets Rfid Uuid and Orientation
function setRfidAndOrientation(decodedOscMessage)
{
  if (decodedOscMessage.args[2].value === OscDataType.String) { 

    var args = decodedOscMessage.args[3].value.trim().split(",")

    store.uuid = args[0].trim();
    store.orientation = args[1].trim() === "L" || args[1].trim() === "R" ? args[1].trim() : "";
    // TODO test if this does anything!!!
    store.leftSensorOrientation = args[1] === "L" ? true : false
    store.rfidState = true;
  }
}

// Sets SensorId and Size
function setSizeAndSensorId(decodedOscMessage)
{
  if (decodedOscMessage.args[2].value === OscDataType.String) { 

    var args = decodedOscMessage.args[3].value.trim().split(",")

    store.sensorId = args[1].trim();
    store.size = args[0]; //TODO make INTEGER!

    store.sensorState = true;

  }
}



// Sets overall Result when sensorTestResult is done
function setOverallResult(decodedOscMessage)
{
  // check okResult
  var okResult = true;
  for(var i = 0; i < 7; i++){
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
  store.instruction = "";
  store.macAddress = "";

  testingComponentRef.value?.resetTestingComponent();
  //chartComponentRef.value.resetChart(); //OUTDATED
}





// Stop Test
function abortTest(){
  frontEndCommand(connection, FrontEndCommand.Stop);
  console.log("abort pressed");
}



</script>
