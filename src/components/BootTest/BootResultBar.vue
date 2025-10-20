<template>
    <div class="flex pr-6">
        <label class="text-white text-2xl basis-1/6">{{ index }}</label>
         <!-- Boot Result PASS-->
        <div v-if="result !== 0 && status" class="bg-green-400 rounded-sm flex items-center justify-end pr-2" :class="`${fractionFlex[index]}`">
            <!-- <label class="text-white text-[15px]">{{ target }}</label> -->
            <label class="text-black text-[15px]">{{ result }}</label>
        </div>
        <!-- Boot Result FAIL -->
        <div v-else-if="result !== 0 && !status" class="bg-red-400 rounded-sm flex items-center justify-end pr-2" :class="`${fractionFlex[index]}`">
            <!-- <label class="text-white text-[15px]">{{ target }}</label> -->
            <label class="text-black text-[15px]">{{ result }}</label>
        </div>
        <!-- Target Only (Placeholder) Result = 0 -->
        <div v-else class="bg-zinc-800 border-2 border-zinc-400 rounded-sm flex items-center justify-end pr-2" :class="`${fractionFlex[index]}`">
            <label class="text-white text-[15px]">{{ target }}</label>
        </div>
    </div>
   
</template>
  
  
<script setup>
  // VUE
  import { ref, defineProps, watchEffect } from "vue";
  
    const fractionFlex = {
        1 : "basis-1/6",
        2 : "basis-2/6",
        3 : "basis-3/6",
        4 : "basis-4/6",
        5 : "basis-5/6",
        6 : "basis-6/6",
    }
    
  
  /* CODE STARTS HERE */
  
  const props = defineProps({
    target:{
        type: Number, 
        default: 0
    },
    result:{
        type: Number, 
        default: 0
    },
    status:{
        type: Boolean,  
        default: false
    },
    index:{
        type: Number,  
        default: 0
    },
   
});

const target = ref(props.target);
const result = ref(props.result);
const status = ref(props.status);
const index = ref(props.index);

watchEffect(() => {
    target.value = props.target
    result.value = props.result
    status.value = props.status
    index.value = props.index
});


// set Values: target and result e.g. 1400, 1390
function setValues(targetValue, resultValue){
    target.value = targetValue;
    result.value = resultValue;
}

// set Result
function setResult(resultValue){
    result.value = resultValue;
}

// Set Result (value!) and Status (bool color)
function setResultAndStatus(resultValue, statusValue){
    status.value = statusValue;
    result.value = resultValue;
}


// reset result value
function reset(){
    result.value = 0;
}


defineExpose({
    setValues,
    setResult,
    setResultAndStatus,
    reset,
});

  
  
</script>

  
<style>
</style>