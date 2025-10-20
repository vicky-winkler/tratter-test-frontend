<template>
    <!-- RFID Sensor-->
    <div v-if="rfid" class="border-2 border-white border-b-transparent flex place-content-around py-1">
        <label class="text-white text-[11px]">{{ index }}</label>
        <label class="text-white text-[11px]">{{ rfid }}</label>
    </div>
    <!-- empty Placeholder -->
    <div v-else class="border-2 border-zinc-800 border-b-transparent flex py-1">
        <label class="text-zinc-800 text-[11px]">Placeholder</label>
    </div>
</template>
  
  
<script setup>
  // VUE
  import { ref, defineProps, watchEffect } from "vue";
  

  
  /* CODE STARTS HERE */
  
  const props = defineProps({
    rfid:{
        type: String, 
        default: ''
    },
    index:{
        type: Number, 
        default: 0
    },
   
});

const rfid = ref(props.rfid);
const index = ref(props.index);

watchEffect(() => {
    rfid.value = props.rfid
    index.value = props.index
});


// set RFID
function setRfid(rfidString){
    rfid.value = rfidString;
}


defineExpose({
    setRfid,
});

  
  
</script>

  
<style>
</style>