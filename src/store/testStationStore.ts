import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const testStationStore = () => {
    const id = ref(-1)
    const settingsSynced = ref(true)
    const testStationInitializing = ref(true)
    const testRunning = ref(false)
    const testStates = ref([0,0,0,0,0,0,0,0,0])
    const errorActive = ref(false)
    const errorID = ref(-1)
    const errorMessage = ref("")
    const sensorState = ref(false)   
    const sensorId = ref("")
    const size = ref(0)
    const rfidState = ref(false) 
    const uuid = ref("")
    const orientation = ref("L")
    const leftSensorOrientation = ref(true)
    const serialNumber = ref("")
    const sensorTestResult = ref(0) // sensor Result: 0 = None, 1 = PASS, 2 = FAIL
    const overallResult = ref(0); // overall Result: 0 = None, 1 = PASS, 2 = FAIL
    const instruction = ref("");
    const macAddress = ref(""); 
    const lightbarrier = ref(false);


    return {
        id, 
        settingsSynced,
        testStationInitializing,
        testRunning, 
        testStates, 
        sensorTestResult, 
        errorActive, 
        errorID, 
        errorMessage,
        serialNumber,
        leftSensorOrientation,
        rfidState,
        uuid,
        sensorState,
        sensorId,
        size,
        orientation,
        overallResult,
        instruction,
        macAddress,
        lightbarrier,
    }
  }
  
  // This is where the difference is to make unique stores:
  export const useTestStationStore = (uniqueStoreName) => {
    let store = defineStore(uniqueStoreName, testStationStore)
    return store()
  }

  export default useTestStationStore
  
