import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const testConditioningStore = () => {
    const id = ref(-1)
    const testStationInitializing = ref(true)
    const testRunning = ref(false)
    const errorActive = ref(false)
    const errorID = ref(-1)
    const errorMessage = ref("")
    const finalGrade = ref(0)
    const instruction = ref("")


    return {
        id, 
        testStationInitializing,
        testRunning, 
        errorActive, 
        errorID, 
        errorMessage,
        finalGrade,
        instruction,
    }
  }


  // This is where the difference is to make unique stores:
  export const useTestConditioningStore = (uniqueStoreName) => {
    let store = defineStore(uniqueStoreName, testConditioningStore);
    return store();
  }

  export default useTestConditioningStore
  
