<template>
    <div class="">
        <div class="flex justify-start gap-8">
                <h1 class="text-xl text-white text-right">Target Pressure</h1>
                <h1 class="text-xl text-white text-right">Loadcell Result</h1>
                <h1 class="text-xl text-white text-right">Measurement Device Result</h1>
            </div>
            <div class="pt-4">
                <template v-for="(pressure, i) in qualitySingleCellStore.targetPressures" :key="i">
                <QualityInputRowComponent
                    v-if="pressure !== null && pressure !== undefined"
                    :targetPressure="pressure"
                    :loadCellResult="qualitySingleCellStore.loadCellResults?.[i] ?? null"
                    :manualInput="qualitySingleCellStore.manualInputResults?.[i] ?? null"
                    :manualInputDisabled="qualitySingleCellStore.manualInputDisabled?.[i] ?? true"
                    class="pb-4"
                    @open-keyboard="(...args) => emit('open-keyboard', ...args)"
                    @close-keyboard="() => emit('close-keyboard')"
                    @update-manual-input="value => emit('update-manual-input', value)"
                    @submit-manual-input="value => emit('submit-manual-input', value)"
                />
                </template>
            </div>
    </div>
   
</template>
  
  
<script setup>
  // VUE
  import { ref, defineEmits } from "vue";
  
  // Stores & Data
  import { useQualitySingleCellStore } from "../../store/qualitySingleCellStore";


  // Custom Components
  import QualityInputRowComponent from "./QualityInputRowComponent.vue";
  
  
  /* CODE STARTS HERE */

  const qualitySingleCellStore = useQualitySingleCellStore();
  const emit = defineEmits(["open-keyboard", "close-keyboard", "update-manual-input", "submit-manual-input"]);

  // set TargetPressure
  function setTargetPressure(targetPressure){
    qualitySingleCellStore.targetPressures[qualitySingleCellStore.currentIndex] = targetPressure;


  }


    // set LoadcellResult
  function setLoadCellResult(loadcellResult){
    qualitySingleCellStore.loadCellResults[qualitySingleCellStore.currentIndex] = loadcellResult;


  }


  function resetQualityTable(){
    qualitySingleCellStore.resetStore();
  }

  function activateManualInput(){
    qualitySingleCellStore.manualInputDisabled[qualitySingleCellStore.currentIndex] = false;

  }

  function deactivateManualInput(){
    qualitySingleCellStore.manualInputDisabled[qualitySingleCellStore.currentIndex] = true;
  }



defineExpose({
    setTargetPressure,
    setLoadCellResult,
    resetQualityTable,
    activateManualInput,
    deactivateManualInput
});


  
  
</script>

  
<style>

</style>