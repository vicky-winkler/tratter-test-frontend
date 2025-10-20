import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTestConfigStore = defineStore('testConfig', () => {

    const testModeID = ref(1)
    const sizeID = ref(0)
    const heatTimeID = ref(0)
    const username = ref('');


    return { 
        testModeID,
        sizeID,
        heatTimeID,
        username,
    }
 })