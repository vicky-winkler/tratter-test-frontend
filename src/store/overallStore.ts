import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const overallStore = () => {
    const id = ref(-1)
    const testStationInitializing = ref(true)
    const testRunning = ref(false)
    const errorActive = ref(false)
    const errorID = ref(-1)
    const errorMessage = ref("")
    const instruction = ref("")
    const lightbarrier = ref(true);
    const lightBarrierColorId = ref(1);


    return {
        id, 
        testStationInitializing,
        testRunning, 
        errorActive, 
        errorID, 
        errorMessage,
        instruction,
        lightbarrier,
        lightBarrierColorId,

    }
  }


  // This is where the difference is to make unique stores:
  export const useOverallStore = (uniqueStoreName) => {
    let store = defineStore(uniqueStoreName, overallStore);
    return store();
  }

  export default useOverallStore;
  
