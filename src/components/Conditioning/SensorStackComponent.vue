<template>
    <div class="flex flex-col bg-zinc-800">
      <!-- Header -->
      <div class="flex justify-between pb-12" >
        <!-- Counter (X / 30) -->
        <label class="flex items-center text-white text-left text-2xl text-l py-2 px-2">Sensor Stack ( {{ counter }} / 30 ) - Size {{ currentSize }}</label>
        <!-- Stop Scanning Button -->
        <button v-if="isStopScanningEnabled" class="flex items-center bg-orange-400 hover:bg-red-400 text-white text-center font-semibold py-2 px-4 rounded-none"
            @click="stopScanning">Stop Scanning Sensors
        </button>
        <!-- Start Scanning Button -->
        <button v-if="isStartScanningEnabled" class="flex items-center bg-green-400 hover:bg-gray-400 text-white text-center font-semibold py-2 px-4 rounded-none"
            @click="startScanning">Start Scanning Sensors
        </button>
      </div>

      <!-- 30 Sensor Components -->
      <div class="flex justify-evenly gap-12">
        <!-- 15 sensors left -->
        <div class="flex flex-col basis-1/2">
          <SensorComponent :rfid="rfidArray[14]" :index="15"></SensorComponent>
          <SensorComponent :rfid="rfidArray[13]" :index="14"></SensorComponent>
          <SensorComponent :rfid="rfidArray[12]" :index="13"></SensorComponent>
          <SensorComponent :rfid="rfidArray[11]" :index="12"></SensorComponent>
          <SensorComponent :rfid="rfidArray[10]" :index="11"></SensorComponent>
          <SensorComponent :rfid="rfidArray[9]" :index="10"></SensorComponent>
          <SensorComponent :rfid="rfidArray[8]" :index="9"></SensorComponent>
          <SensorComponent :rfid="rfidArray[7]" :index="8"></SensorComponent>
          <SensorComponent :rfid="rfidArray[6]" :index="7"></SensorComponent>
          <SensorComponent :rfid="rfidArray[5]" :index="6"></SensorComponent>
          <SensorComponent :rfid="rfidArray[4]" :index="5"></SensorComponent>
          <SensorComponent :rfid="rfidArray[3]" :index="4"></SensorComponent>
          <SensorComponent :rfid="rfidArray[2]" :index="3"></SensorComponent>
          <SensorComponent :rfid="rfidArray[1]" :index="2"></SensorComponent>
          <SensorComponent :rfid="rfidArray[0]" :index="1"></SensorComponent>
        </div>
        <!-- 15 Sensors right -->
        <div class="flex flex-col basis-1/2">
          <SensorComponent :rfid="rfidArray[29]" :index="30"></SensorComponent>
          <SensorComponent :rfid="rfidArray[28]" :index="29"></SensorComponent>
          <SensorComponent :rfid="rfidArray[27]" :index="28"></SensorComponent>
          <SensorComponent :rfid="rfidArray[26]" :index="27"></SensorComponent>
          <SensorComponent :rfid="rfidArray[25]" :index="26"></SensorComponent>
          <SensorComponent :rfid="rfidArray[24]" :index="25"></SensorComponent>
          <SensorComponent :rfid="rfidArray[23]" :index="24"></SensorComponent>
          <SensorComponent :rfid="rfidArray[22]" :index="23"></SensorComponent>
          <SensorComponent :rfid="rfidArray[21]" :index="22"></SensorComponent>
          <SensorComponent :rfid="rfidArray[20]" :index="21"></SensorComponent>
          <SensorComponent :rfid="rfidArray[19]" :index="20"></SensorComponent>
          <SensorComponent :rfid="rfidArray[18]" :index="19"></SensorComponent>
          <SensorComponent :rfid="rfidArray[17]" :index="18"></SensorComponent>
          <SensorComponent :rfid="rfidArray[16]" :index="17"></SensorComponent>
          <SensorComponent :rfid="rfidArray[15]" :index="16"></SensorComponent> 
        </div>
      </div>
    </div>
</template>
  
  
<script setup>
  // VUE
  import { ref } from "vue";
  
  // Messaging & Commands
  import { connection } from '../../services/websocket/mainWebSocket';
  import { BackEndCommand, OscDataType } from "../../services/backendMessaging/commandEnums";
  import { frontEndCommand, backEndCommand } from '../../services/backendMessaging/backendCommands';
  
  // Custom Components
  import SensorComponent from "./SensorComponent.vue";
  

  /* CODE STARTS HERE */
  
  const rfidArray = ref([]);
  const counter = ref(0);
  const isStopScanningEnabled = ref(true);
  const isStartScanningEnabled = ref(false);
  const emit = defineEmits(['selectHeatingTime']);
  const currentSize = ref(null);


  // set RFID
  function addSensor(rfidString){
    rfidArray.value.push(rfidString);
    counter.value++;

    if(counter === 30){
      // stop scanning button
      stopScanning();
    }
  }



  // Start Scanning => (used when later adding a sensor - before machine has started!)
  function startScanning(){
    console.log("Start Scanning again");
    isStopScanningEnabled.value = true;
    isStartScanningEnabled.value = false;

    // send back end
    if (connection && connection.readyState === WebSocket.OPEN) {
      backEndCommand(connection, BackEndCommand.OvenScanQrCode);
    }

    emit('unselectHeatingTime');  //TODO test

  }


  // Stop Scanning Button => allows selecting heating time!
  function stopScanning(){
    console.log("stopScanning");
    isStartScanningEnabled.value = true;
    isStopScanningEnabled.value = false;

    // send back end
    if (connection && connection.readyState === WebSocket.OPEN) {
      backEndCommand(connection, BackEndCommand.OvenStopScanningRfids);
    }

    // allow selecting heating time next! -> Parent Communication
    emit('selectHeatingTime');

  }
  
  // does not allow start scanning anymore!
  function disableScanning(){
    isStopScanningEnabled.value = false;
    isStartScanningEnabled.value = false;
  }

  // Reset = sets initial setup
  function resetComponent(){
    rfidArray.value = [];
    counter.value = 0;
    isStopScanningEnabled.value = true;
    isStartScanningEnabled.value = false;
    currentSize.value = '';
  }

  function setSize(size){
    currentSize.value = size;
  }

  
  defineExpose({
    addSensor,
    disableScanning,
    resetComponent,
    setSize,
  });
  

</script>

  
<style>
</style>