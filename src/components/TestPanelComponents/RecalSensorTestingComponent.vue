<template>
  <div class="pl-6 pr-6 pb-6 pt-0 border rounded border-b dark:bg-zinc-800 dark:border-gray-800"
    style="position: relative;">

    <!-- Placeholder Image -->
    <img :src="baseImage" v-if="store.orientation === ''"
      style="width: 90%; position: absolute; top: 6.0%; left: 3.5%; z-index: 0;" />
    <!-- Placeholder Image LEFT Orientation = L -->
    <img v-else-if="store.orientation === 'L'" :src="baseLeftImage"
      style="width: 90%; ; position: absolute; top: 6.0%; left: 3.5%; z-index: 0;" />
    <!-- Placeholder Image LEFT Orientation = L -->
    <img v-else :src="baseLeftImage"
      style="width: 90%; transform: scaleX(-1);; position: absolute; top: 6.0%; left: 3.5%; z-index: 0;" />

    <!-- Fail and Success Pads -->
    <template v-for="(item, index) in failImages" :key="index">
      <img :src="failImages[index]" v-if="store.testStates[index] === 2"
        style="width: 90%;; position: absolute;  top: 6%; left: 3.5%; z-index: 1;" />     
      <img :src="successImages[index]" v-else-if="store.testStates[index] === 1"
        style="width: 90%; position: absolute;  top: 6%; left: 3.5%; z-index: 1;" />      
    </template>

    <!-- R_Temp Pad -->
    <img :src="rTempsImage" v-if="store.testStates[7] === 1"
      style="width: 90%; position: absolute; top: 6%; left: 3.5%; z-index: 0;" />
    <img :src="rTempfImage" v-else-if="store.testStates[7] === 2"
      style="width: 90%; position: absolute; top: 6%; left: 3.5%; z-index: 0;" />

      <!-- R_Fix Pad -->
    <img :src="rFixsImage" v-if="store.testStates[8] === 1"
      style="width: 90%; position: absolute; top: 6%; left: 3.5%; z-index: 0;" />
    <img :src="rFixfImage" v-else-if="store.testStates[8] === 2"
      style="width: 90%; position: absolute; top: 6%; left: 3.5%; z-index: 0;" />



  </div>
</template>

<script setup>
// Vue
import { ref, onMounted, onUnmounted, onBeforeMount } from 'vue';

// Messaging & Communication
import slip from 'slip';
import { Buffer } from 'buffer';
import { connection } from '../../services/websocket/mainWebSocket';
import { decodeMessage } from '../../services/backendMessaging/backendCommands';
import { wsAddress } from '../../services/websocket/mainWebSocket';
import { BackEndCommand } from '../../services/backendMessaging/commandEnums';

// Stores & Data
import { useTestConfigStore } from '../../store/testConfigStore';
import { useTestStationStore } from '../../store/testStationStore';

// Graphics Component
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import ConfirmDialog from 'primevue/confirmdialog';


// Images
import baseImage from "../../assets/imgs/sensor_viz/base_unknown.png"
import baseLeftImage from "../../assets/imgs/sensor_viz/base_left.png"

import rTempfImage from "../../assets/imgs/sensor_viz/fail/rTemp_fail.png"
import rTempsImage from "../../assets/imgs/sensor_viz/ok/rTemp_success.png"

import rFixfImage from "../../assets/imgs/sensor_viz/fail/rFix_fail.png"
import rFixsImage from "../../assets/imgs/sensor_viz/ok/rFix_success.png"

import s1fImage from "../../assets/imgs/sensor_viz/fail/s1_fail_labeled.png"
import s2fImage from "../../assets/imgs/sensor_viz/fail/s2_fail_labeled.png"
import s3fImage from "../../assets/imgs/sensor_viz/fail/s3_fail_labeled.png"
import s4fImage from "../../assets/imgs/sensor_viz/fail/s4_fail_labeled.png"
import s5fImage from "../../assets/imgs/sensor_viz/fail/s5_fail_labeled.png"
import s6fImage from "../../assets/imgs/sensor_viz/fail/s6_fail_labeled.png"
import s7fImage from "../../assets/imgs/sensor_viz/fail/s7_fail_labeled.png"
import s1sImage from "../../assets/imgs/sensor_viz/ok/s1_success_labeled.png"
import s2sImage from "../../assets/imgs/sensor_viz/ok/s2_success_labeled.png"
import s3sImage from "../../assets/imgs/sensor_viz/ok/s3_success_labeled.png"
import s4sImage from "../../assets/imgs/sensor_viz/ok/s4_success_labeled.png"
import s5sImage from "../../assets/imgs/sensor_viz/ok/s5_success_labeled.png"
import s6sImage from "../../assets/imgs/sensor_viz/ok/s6_success_labeled.png"
import s7sImage from "../../assets/imgs/sensor_viz/ok/s7_success_labeled.png"



/* CODE STARTS HERE */

window.Buffer = window.Buffer || Buffer;

const store = useTestStationStore("default")
const testConfigStore = useTestConfigStore()
const failImages = [s1fImage, s2fImage, s3fImage, s4fImage, s5fImage, s6fImage, s7fImage];
const successImages = [s1sImage, s2sImage, s3sImage, s4sImage, s5sImage, s6sImage, s7sImage];



onBeforeMount(() => {
  // Reset States
  resetTestingComponent();
})

onUnmounted(() => {
})


// TODO needs fixing for Left and Right!!!!


// process received message
function processMessage(decodedOscMessage) {

  // Extract CommandType from Address
  const commandType = decodedOscMessage.address.split('/')[2]

  // CommandID
  const commandID = decodedOscMessage.args[1].value;


  // DATA
  if (commandType === "DATA") {
      // FINAL RESULT
    if (commandID === BackEndCommand.StepRecalFinalResults) 
    {
      console.log("data reached with x: " + decodedOscMessage.args[3].value + " - y: " + decodedOscMessage.args[4].value)

      if (decodedOscMessage.args[2].value == 3 && decodedOscMessage.args[4].value == 1) 
      {
        
        // print TRUE false
        console.log("True False Array: ");
        
        
        for (var i = 0; i < 7; i++){
            console.log(decodedOscMessage.args[5].value[i]);
        }

       
        //--- 7 sensors
        const mappingIndexList = [5,6,0,1,2,3,4]
        var okResults = 0;

        for (var i = 0; i < 7; i++) {
          // LEFT
          if (store.orientation === "L") {
            // 2 = FAIL and 1 = SUCCESS
            
            if(decodedOscMessage.args[5].value[i] === 1){
              // SUCCESS
              store.testStates[i] = 1;
            }
            else{
              store.testStates[i] = 2;
            }

            // store.testStates[i] = decodedOscMessage.args[5].value[i] ? 1 : 2

            if (store.testStates[i] === 1) {
              okResults += 1;
            }


            // RIGHT
          } else {
            // store.testStates[i] = decodedOscMessage.args[5].value[mappingIndexList[i]] ? 1 : 2
            store.testStates[i] = decodedOscMessage.args[5].value[i] ? 1 : 2
            if (store.testStates[i] === 1) {
              okResults += 1;
            }
          }
        }

        console.log("Teststates: " + store.testStates)
        
        // sensorTestResult
        if (okResults === 7) {
          store.sensorTestResult = 1
        } else {
          store.sensorTestResult = 2
        }
      }
    }
  }
}


// Reset Image
function resetTestingComponent(){
  if (testConfigStore.testModeID === 0) {
    store.testStates = [-1, 0, 0, 0, 0, 0, 0, 0, -1]
  } else {
    store.testStates = [0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
}



// accessible from parent component
defineExpose({
  processMessage,
  resetTestingComponent,
});




</script>
