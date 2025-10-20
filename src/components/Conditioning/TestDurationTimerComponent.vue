<template>
    <div class="flex flex-col bg-zinc-800">
        <!-- Set Heating Time -->
        <div class="flex items-center pl-12 pt-6 pb-6 gap-12">
            <label class="text-white text-left text-2xl text-l py-2" style="width: 30%;">Heating Time</label>
            <SelectButton class="flex flex-wrap pl-12 pr-12 gap-2 " :allowEmpty=false v-model="heatingTime" v-on:change="heatingTimeChanged" :options="heatingTimeOptions" aria-labelledby="basic" />
        </div>
         <!-- Timer Heating-->
         <div class="flex items-center pl-12 pt-6 pb-6 gap-12" v-if="countingHeating">
            <label class="text-white text-2xl text-l py-2 ">Heating: </label>
            <vue-countdown ref="countdownHeating" v-if="countingHeating" :time="timeHeating" :interval="100" :auto-start="false" @end="countdownHeatingEnd" v-slot="{hours, minutes, seconds}">
                <label class="pl-24 text-white text-right text-5xl text-l py-2 " style="width: 30%;">{{formatTime(hours) }} : {{ formatTime(minutes) }} : {{ formatTime(seconds) }}</label>
            </vue-countdown>
        </div>
        <!-- Timer Conditioning-->
        <div class="flex items-center pl-12 pt-6 pb-6 gap-12" v-if="countingConditioning">
            <label class="text-white text-2xl text-l py-2 ">Conditioning: </label>
            <vue-countdown ref="countdownConditioning" v-if="countingConditioning" :time="timeConditioning" :interval="100" :auto-start="false" @end="countdownConditioningEnd" v-slot="{hours, minutes, seconds}">
                <label class="pl-12 text-white text-right text-5xl text-l py-2 " style="width: 30%;">{{formatTime(hours) }} : {{ formatTime(minutes) }} : {{ formatTime(seconds) }}</label>
            </vue-countdown>
        </div>
        <!-- Timer Post-Conditioning / Cooling-->
        <div class="flex items-center pl-12 pt-6 pb-6 gap-12" v-if="countingCooling">
            <label class="text-white text-2xl text-l py-2 ">Cooling: </label>
            <vue-countdown ref="countdownCooling" v-if="countingCooling" :time="timeCooling" :interval="100" :auto-start="false" :emit-events="false" v-slot="{hours, minutes, seconds}">
                <label class="pl-24 text-white text-right text-5xl text-l py-2 " style="width: 30%;">{{formatTime(hours) }} : {{ formatTime(minutes) }} : {{ formatTime(seconds) }}</label>
            </vue-countdown>
        </div>
    </div>
</template>
  
  
<script setup>
  // VUE
  import { ref, onMounted, onUnmounted, onBeforeMount } from "vue";
  
  // Messaging & Commands
  import { connection } from '../../services/websocket/mainWebSocket';
  import { BackEndCommand, OscDataType } from "../../services/backendMessaging/commandEnums";
  import { backEndSettingsData, } from '../../services/backendMessaging/backendCommands';
  
  // Stores and Data
  import { useTestConfigStore } from '../../store/testConfigStore';


  // Graphic Components
  import SelectButton from 'primevue/selectbutton';
  import VueCountdown from '@chenfengyuan/vue-countdown';

  

  
  /* CODE STARTS HERE */
  const testConfigStore = useTestConfigStore();

  
  const heatingTime = ref('');
  const heatingTimeOptions = ref(['30min', '1h', '2h', '4h', '6h']);
  
  const timeConditioning = ref(0);
  const countingConditioning = ref(false);
  const countdownConditioning = ref();

  const timeHeating = ref(900000);  //15min = 900.000   // 5min for testing
  const countingHeating = ref(false);
  const countdownHeating = ref();

  const timeCooling = ref(300000); //5min = 300.000
  const countingCooling = ref(false);
  const countdownCooling = ref();
  
  
  
  onBeforeMount(() => {
    //reset();
  })
  
  
  onUnmounted(() => {

  })
  
  
  onMounted(() => {
    
  })
  

  // Start Countdown 1...
  function startCountdown(){
    console.log("start countdown");

    // Start Progress Bar and Timer
    countdownHeating.value.start();
  }

  // stop all countdowns
  function stopCountdown(){
    console.log("stop countdowns");
    countdownHeating.value.stop();
    countdownConditioning.value.stop();
    countdownCooling.value.stop();
  }


  
  
  // Set Heating Time
  function heatingTimeChanged(event) {
    countingConditioning.value  = true; //visual
    countingHeating.value  = true; //visual
    countingCooling.value  = true; //visual
  
    var heatingTime = 0;
  
    var chosenTime = 0;
    // heating time to seconds!
    for(let i = 0; i < heatingTimeOptions.value.length; i++){
      if(heatingTimeOptions.value[i] === event.value){
        chosenTime = i;
        break;
      }
    }
    
    // ['30min', '1h', '2h', '4h', '6h']
    switch(chosenTime) {
      case 0:
        heatingTime = 60 * 30;
        break;
      case 1:
        heatingTime = 60 * 60;
        break;
      case 2:
        heatingTime = 60 * 120;
        break;
      case 3:
        heatingTime = 60 * 240;
        break;
      case 4:
        heatingTime = 60 * 360;
        break;
    } 
  
    // heating time for Countdown in ms
    timeConditioning.value = heatingTime * 1000;
  
    testConfigStore.heatTimeID = heatingTime;
  
    console.log("Time: " + timeConditioning.value);
  
    // send back end
    if (connection && connection.readyState === WebSocket.OPEN) {
      backEndSettingsData(connection, BackEndCommand.OvenTestDuration, OscDataType.Int, heatingTime);
      console.log("notified backend about Heating Time: " + BackEndCommand.OvenTestDuration + " value: " + testConfigStore.heatTimeID);
    }
  
  }
  
  
  // end of heating => start Conditioning
  function countdownHeatingEnd(){
    console.log("Start Conditioning...");
    countdownConditioning.value.start();
  }

  // end of conditioning => start Cooling
  function countdownConditioningEnd(){
    console.log('Start Cooling...');  
    countdownCooling.value.start();
  }


  // Reset -> set to init values
  function resetComponent(){
    heatingTime.value = '';

    timeConditioning.value = 0;
    countingConditioning.value = false;
    timeHeating.value = 900000;   //15min = 900.000
    countingHeating.value = false;
    timeCooling.value = 300000; //5min = 300.000
    countingCooling.value = false; 

  }

  function formatTime(num) {
    return String(num).padStart(2, '0')
  }
  


  defineExpose({
    startCountdown,
    stopCountdown,
    resetComponent,
  });


  
  
  </script>
  
  
  <style>
  </style>