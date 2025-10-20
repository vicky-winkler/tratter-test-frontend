<template>
    <!-- title + BACK Button -->
    <div class="pl-12 pr-12 pt-6 flex justify-between">
      <div class="bg-zinc-900" v-if="activeToggle === true" style="width: 80%">
        <h1 class="p-2 pl-6 font-bold bg-zinc-800 text-white text-left text-3xl">STEP-RECAL-TEST-PANEL</h1>
      </div>
      <div class="bg-zinc-900" v-else style="width: 100%">
        <h1 class="p-2 pl-6 font-bold bg-zinc-800 uppercase text-white text-left text-3xl">STEP-RECAL-TEST-PANEL</h1>
      </div>
      <button v-if="store.testRunning" style="width: 20%;"
        class=" bg-orange-400 hover:bg-red-400 text-white font-semibold py-2 px-4 rounded-none text-center"
        @click="abortTest">Stop Test
      </button>
      <router-link style="width: 20%" :to="{ name: 'mainScreenView' }"
        class="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-4 rounded-none uppercase text-xl text-center">Back to Menu
      </router-link>
    </div>
    <!-- Progress bar -->
    <div class="pl-12 pr-12 pb-6">
      <ProgressBar v-if="store.testRunning"   mode="indeterminate" class="rounded-none" style="border-radius: 0px; height: 6px;"></ProgressBar>
      <ProgressBar v-else :value="0" class="rounded-none" style="border-radius: 0px; height: 6px;"></ProgressBar>
    </div>
  
  
  <!-- Results Header -->
    <div class="pl-12 pr-12 pb-6">
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
        <div class="bg-zinc-400" style="width: 24.7%;">
          <h1 v-if="!store.sensorState" class="p-2 bg-zinc-400 uppercase text-white text-center text-2xl">Mac Address</h1>
          <h1 v-else-if="store.sensorState" class="p-2 font-bold bg-green-400 uppercase text-black text-center text-2xl">{{ store.macAddress }}</h1>
        </div>
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
      <LightbarrierVisualComponent v-if="overallStore.lightbarrier" :color="overallStore.lightBarrierColorId"></LightbarrierVisualComponent>
      <RecalSensorTestingComponent class="rounded-none" style="width: 40%; min-height: 50vh;" ref="recalSensorTestingComponentRef"></RecalSensorTestingComponent>
      <ChartRecalComponent  class="rounded-none" style="width: 60%; min-height: 50vh;" ref="chartComponentRef"></ChartRecalComponent>
      <LightbarrierVisualComponent v-if="overallStore.lightbarrier" :color="overallStore.lightBarrierColorId"></LightbarrierVisualComponent>
    </div> 
  
      <!-- Instructions -->
    <div v-if="store.instruction === 'Please hold the Yellow-Button on the Shoe for 3 seconds until the LEDs are showing.' " class="pl-12 pr-12 pt-6 pb-6" >
      <vue-countdown ref="countdownBLE" v-if="countingBLE" :time="timeBLE" :interval="100" :auto-start="false" :emit-events="false" v-slot="{hours, minutes, seconds}">
        <h1 class="p-2 font-bold bg-zinc-800 uppercase text-white text-center text-2xl"> {{ store.instruction }} {{ formatTime(minutes) }} : {{ formatTime(seconds) }}</h1>
      </vue-countdown>
    </div>
    <div v-else-if="store.instruction !== '' " class="pl-12 pr-12 pt-6 pb-6" >
      <h1 class="p-2 font-bold bg-zinc-800 uppercase text-white text-center text-2xl">{{ store.instruction }}</h1>
    </div>

  
    <!-- RFID Modal -->
    <template>
      <Dialog v-model:visible="rfidModalVisible" modal header="RFID" :style="{ width: '35%' }">
        <RfidWarningModal />
      </Dialog>
    </template>

    <!-- ERROR Modal -->
    <template>
      <Dialog v-model:visible="store.errorActive" modal header="ERROR" :draggable="false" :style="{ width: '35%' }" class="custom-error-dialog"
        :pt="{ header: { style: { backgroundColor: errorColor, color: 'black', fontWeight: 'bold', textTransform: 'uppercase' }}}">
        <p>Error ID: {{ store.errorID }}</p>
        <p v-html="store.errorMessage"></p>
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
import { connection } from '../services/websocket/mainWebSocket';
import { FrontEndCommand, BackEndCommand, OscDataType } from "../services/backendMessaging/commandEnums";
import { wsAddress } from '../services/websocket/mainWebSocket';
import { decodeMessage, frontEndCommand } from '../services/backendMessaging/backendCommands';


// Stores & Data
import { useTestStationStore } from '../store/testStationStore';
import { useTestConfigStore } from '../store/testConfigStore';
import { useOverallStore } from '../store/overallStore';

// Components
import ChartRecalComponent from '../components/TestPanelComponents/ChartRecalComponent.vue';
import RfidWarningModal from '../components/TestPanelComponents/RfidWarningModal.vue';
import RecalSensorTestingComponent from '../components/TestPanelComponents/RecalSensorTestingComponent.vue';
import LightbarrierVisualComponent from '../components/Lightbarrier/LightbarrierVisualComponent.vue';
import LightBarrierModal from '../components/Lightbarrier/LightBarrierModal.vue';


// Primevue
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ProgressBar from 'primevue/progressbar';
import ConfirmDialog from "primevue/confirmdialog";

// Other Components
import VueCountdown from '@chenfengyuan/vue-countdown';

/* CODE STARTS HERE */

const testConfigStore = useTestConfigStore();
const store = useTestStationStore("default")
const overallStore = useOverallStore("default");

const activeToggle = ref(true);
const chartComponentRef = ref(null);
const recalSensorTestingComponentRef = ref(null);


const currentInstruction = ref("")
const currentInstructionIcon = ref("")
const rfidModalVisible = ref(false);
const keepRed = ref(false);
const startButtonPressed = ref(false);
const errorColor = ref('#dc2626');

//countdown - BLE
const timeBLE = ref(60000); //1min = 60.000
const countingBLE = ref(false);
const countdownBLE = ref();



onMounted(() => {
  // Send View Command
  if (connection) {
      frontEndCommand(connection, FrontEndCommand.TestingView);
      console.log("Testing View - listen Websocket");
      listenToWebsocket();
  }

  store.testStationInitializing = true

  // rfidModalVisible.value = true;
  overallStore.lightbarrier = true;
  keepRed.value = false;
  startButtonPressed.value = false;
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
    if(commandID === BackEndCommand.StepRecalMeasurementData || commandID === BackEndCommand.BootMeasurementData || commandID === BackEndCommand.StepRecalRecordCalibration){
        console.log("Measurement Data Recal");
        chartComponentRef.value.processMessage(decodedOscMessage);
    }
    // if DATA + Size Orientation RFID
    else if(commandID === BackEndCommand.StepRecalSizeOrientationRFID){
        console.log("Size, Orientation + RFID");
        setSizeOrientationAndUUID(decodedOscMessage);
        rfidModalVisible.value = false;
    }
    // if DATA + RFID => Testing Component
    else if(commandID === BackEndCommand.StepRecalMacAddress){
        console.log("Mac Address");
        setMacAddress(decodedOscMessage);
    }
    // if DATA + Instruction
    else if(commandID === FrontEndCommand.Instructions){
        console.log("Instructions");
        setInstruction(decodedOscMessage);
    }
       // if DATA + FinalResults => TestingComponent
    else if(commandID === BackEndCommand.StepRecalFinalResults){
      console.log("Final Results - 8 ints");
      recalSensorTestingComponentRef.value.processMessage(decodedOscMessage);
      setOverallResult(decodedOscMessage);
    }
  }


  // CMD
  else if(commandType === "CMD"){
    // if CMD + INIT_TESTING => Chart + TestingComponent
    if(commandID === BackEndCommand.StepRecalInitTesting){
      console.log("InitTesting");
      // chartComponentRef.value.processMessage(decodedOscMessage);
    }
    // if CMD + ReadyToTest = Operative ReadRFID
    else if(commandID === BackEndCommand.StepRecalReadRFID){
      console.log("RFID Scanned");
      reset();

      store.testRunning = true;  
      store.testStationInitializing = false;
      chartComponentRef.value.processMessage(decodedOscMessage);
      console.log("TestRunning State == " + store.testRunning);
    }
    // if CMD + Resetting/StopRoutine => TestingComponent
    else if(commandID === BackEndCommand.StepRecalResetting){
      console.log("Resetting/ReadyToTest/ReadRFID");
      // Reset
      store.testRunning = false;
      reset();
    }
    // if CMD + LightBarrierReset
    else if(commandID === BackEndCommand.StepRecalLightBarrierReset){
      console.log("Lightbarrier reset");
      keepRed.value = true;
      overallStore.lightBarrierColorId = 2;
    }
    else if(commandID === BackEndCommand.StepRecalButtonPressed){
      console.log("Button Pressed");
      startButtonPressed.value = true;
    }
  }
  // ACK
  else if(commandType === "ACK"){
    if(commandID === BackEndCommand.StepRecalReadRFID){
      console.log("rfid ok");
    }
    // Lightbarrier (OFF)
    else if(commandID === FrontEndCommand.LightBarrier){
      console.log("light OFF");

      if(keepRed.value){
        console.log("keep red OFF");
        overallStore.lightBarrierColorId = 2;
      }
      else if(startButtonPressed.value){
        // remains RED
        console.log("startButtonPressed OFF");
        overallStore.lightBarrierColorId = 2;
      }
      else{
        // GREEN
        console.log("green OFF");
        overallStore.lightBarrierColorId = 1;
      }
      
    }
    // LightBarrier Reset completed in backend
    else if(commandID === BackEndCommand.StepRecalLightBarrierReset){
      // clear chart & do not keep red
      console.log("Light reset completed");
      keepRed.value = false;
      startButtonPressed.value = false;
      overallStore.lightBarrierColorId = 1; // GREEN
      chartComponentRef.value?.ResetChart();
    }
  }
  // NACK
  else if(commandType === "NACK"){
    if(commandID === BackEndCommand.StepRecalReadRFID){
      console.log("rfid not ok")
      store.errorActive = true;
      store.errorID = 0;
      store.errorMessage = "No RFID!"
    }
    // Lightbarrier (ON)
    else if(commandID === FrontEndCommand.LightBarrier){
      console.log("light ON");
      if(keepRed.value){
        console.log("keep red ON");
        overallStore.lightBarrierColorId = 2;
      }

      if(startButtonPressed.value){
        // RED => issue
        console.log("startButtonPressed ON");
        overallStore.lightBarrierColorId = 2;
      }
      else{
        // WHITE (not an issue)
        console.log("else - white ON");
        overallStore.lightBarrierColorId = 0;
      }
    }
  }

  // ERR => TestingComponent
  else if(commandType === "ERR"){
    console.log("error");
    if (decodedOscMessage.args[1].value === -1) { 
      store.errorActive = false;
      store.errorID = -1
      store.errorMessage = ""
    } 
    else {

      // Warning!
      if(decodedOscMessage.args[2].value === 'Loadcells are not responding!'|| decodedOscMessage.args[2].value === 'Loadcells are unbalanced!'|| decodedOscMessage.args[2].value === 'Not Enough values for evaluation!')
      {
        store.errorMessage = "Message: " + decodedOscMessage.args[2].value + "<br>Repeat after 1h!"
        errorColor.value = '#facc15'; // Tailwind yellow-400
      }
      // Error
      else
      {
        store.errorMessage = "Message: " + decodedOscMessage.args[2].value
        errorColor.value = '#dc2626'; // Tailwind red-600
      }

      store.errorID = decodedOscMessage.args[1].value
      store.errorActive = true;
      console.log("error active")

      // stop test and reset
      store.testRunning = false;
      // reset();
    }
  }

// ACK/NACK
  else {
    console.log("ELSE!!");

    /*
    if(commandID === BackEndCommand.StepRecalReadRFID && commandType == "NACK"){
    console.log("rfid not ok")
    store.errorActive = true;
    store.errorID = 0;
    store.errorMessage = "No RFID!"
    }
    else if(commandID === BackEndCommand.StepRecalReadRFID && commandType == "ACK"){
    console.log("rfid ok");
    }
    */
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



// Sets overall Result when sensorTestResult is done -> 8 int last is overall result
function setOverallResult(decodedOscMessage)
{
  // check okResult
  /*
  var okResult = true;
  for(var i = 0; i < 7; i++){
    if(!decodedOscMessage.args[5].value[i]){
      okResult = false;
      break;
    }
  }
  */

  var okResult = decodedOscMessage.args[5].value[7];

  console.log("result: " + okResult);

  // qr and rfid and sensor values OK
  if(store.uuid && store.macAddress && okResult){
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
function setInstruction(decodedOscMessage) {
  if (decodedOscMessage.args[2].value === OscDataType.String) {

    const instructionText = decodedOscMessage.args[3].value
    store.instruction = instructionText

    if (instructionText === 'Please hold the Yellow-Button on the Shoe for 3 seconds until the LEDs are showing.') {
      countingBLE.value = true
      // wait until vue-countdown is rendered
      nextTick(() => {
        if (countdownBLE.value) {
          countdownBLE.value.start()
        }
      })
    } else {
      countingBLE.value = false
    }
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
  startButtonPressed.value = false;
  keepRed.value = false;

  timeBLE.value = 60000;
  countingBLE.value = false;

  // Error Modal
  store.errorActive = false;
  store.errorID = -1
  store.errorMessage = ""

  chartComponentRef.value?.ResetChart();
  recalSensorTestingComponentRef.value?.resetTestingComponent();

}


  function formatTime(num) {
    return String(num).padStart(2, '0')
  }






// Stop Test
function abortTest(){
  frontEndCommand(connection, FrontEndCommand.Stop);
  console.log("abort pressed");
}



</script>


<style scoped>
/* Custom header style */
.custom-dialog-header {
  background-color: #dc2626; /* Tailwind green-500 = #22c55e,  Tailwind-red-600 = #dc2626 */
  color: white;
  font-weight: bold;
  text-transform: uppercase;
}

/* Optional: adjust content border to match */
.custom-dialog-content {
  border-top: 2px solid #dc2626;
}

</style>