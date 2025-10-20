// current quality single cell

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useQualitySingleCellStore = defineStore('qualitySingleCell', () => {
    
    const targetPressures = ref(Array(10).fill(null));
    const loadCellResults = ref(Array(10).fill(null));
    const manualInputResults = ref(Array(10).fill(null));
    const manualInputDisabled = ref(Array(10).fill(null));
    const currentIndex = ref(0);


    function resetStore(){
        targetPressures.value = Array(10).fill(null);
        loadCellResults.value = Array(10).fill(null);
        manualInputResults.value = Array(10).fill(null);
        manualInputDisabled.value = Array(10).fill(null);
        currentIndex.value = 0;
    }

    
    // expose
    return { 
        targetPressures,
        loadCellResults,
        manualInputResults,
        manualInputDisabled,
        currentIndex,

        resetStore,

    }
 })