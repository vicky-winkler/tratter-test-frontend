<template>
    <div class="flex flex-col bg-zinc-800">
      <!-- Header -->
      <div class="pb-12 pt-2" >
        <label class="text-white text-center text-2xl text-l py-2 px-2">Results</label>
      </div>

      <!-- Body: 5 Bars -->
      <BootResultBar :target="1400" :index="1" ref="resultBar1" class="pb-6"></BootResultBar>
      <BootResultBar :target="2100" :index="2" ref="resultBar2" class="pb-6"></BootResultBar>
      <BootResultBar :target="3500" :index="3" ref="resultBar3" class="pb-6"></BootResultBar>
      <BootResultBar :target="5600" :index="4" ref="resultBar4" class="pb-6"></BootResultBar>
      <BootResultBar :target="7000" :index="5" ref="resultBar5" class="pb-6"></BootResultBar>
      
    </div>
</template>
  
  
<script setup>
  // VUE
  import { ref } from "vue";

  // Stores & Data
  import { useTestStationStore } from '../../store/testStationStore';
  
  // Custom Components
  import BootResultBar from "./BootResultBar.vue";

  
  /* CODE STARTS HERE */

  const store = useTestStationStore("default")

  const resultBar1 = ref();
  const resultBar2 = ref();
  const resultBar3 = ref();
  const resultBar4 = ref();
  const resultBar5 = ref();

  // determines result of bars
  function setResults(decodedOscMessage){

    const resultArray = new Int32Array(new Uint8Array(decodedOscMessage.args[5].value).buffer)

    console.log("Boot result array");
    console.log(resultArray);
    console.log(resultArray[0] + " " + resultArray[5]);
    

    // set result 1 => [0] [5]
    resultBar1.value.setResultAndStatus(resultArray[5],isGood(resultArray[0], resultArray[5]));  // result, status

    // set result 2 => [1] [6]
    resultBar2.value.setResultAndStatus(resultArray[6],isGood(resultArray[1], resultArray[6]));  // result, status

    // set result 3 => [2] [7]
    resultBar3.value.setResultAndStatus(resultArray[7],isGood(resultArray[2], resultArray[7]));  // result, status

    // set result 4 => [3] [8]
    resultBar4.value.setResultAndStatus(resultArray[8],isGood(resultArray[3], resultArray[8]));  // result, status

    // set result 5 => [4] [9]
    resultBar5.value.setResultAndStatus(resultArray[9],isGood(resultArray[4], resultArray[9]));  // result, status

  }


  // determine if result is good or bad, depending on target different ranges apply
  function isGood(target, result){

    console.log("size: " + store.size);

    // size 5
    if(store.size === '5'){
      console.log("enter 5");
      if(target === 1400){
        return result >= 1150 && result <= 1500;
      }
      else if(target === 2100){
        return result >= 1900 && result <= 2200;
      }
      else if(target === 3500){
        return result >= 3320 && result <= 3630;
      }
      else if(target === 5600){
        return result >= 5340 && result <= 5700;
      }
      else if(target === 7000){
        return result >= 6740 && result <= 7260;
      }
    }
    // sizes 2,3,4
    else{
      if(target === 1400){
        return result >= 1150 && result <= 1500;
      }
      else if(target === 2100){
        return result >= 1900 && result <= 2200;
      }
      else if(target === 3500){
        return result >= 3320 && result <= 3630;
      }
      else if(target === 5600){
        return result >= 5370 && result <= 5770;
      }
      else if(target === 7000){
        return result >= 6800 && result <= 7260;
      }
    }
    

    return false;

    /*
    if(result < target + 300 && result > target - 300){
      return true;
    }
    else {
      return false;
    }
      */
  }


  // Reset => set to initial value
  function resetComponent(){
    // set result to 0 -> should activate target value view!
    resultBar1.value.setResult(0);
    resultBar2.value.setResult(0);
    resultBar3.value.setResult(0);
    resultBar4.value.setResult(0);
    resultBar5.value.setResult(0);
  }

  defineExpose({
    setResults,
    resetComponent,
  });
  

</script>

  
<style>
</style>