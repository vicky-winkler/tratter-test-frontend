// store for ecuTests https://medium.com/@bugintheconsole/axios-vue-js-3-pinia-a-comfy-configuration-you-can-consider-for-an-api-rest-a6005c356dcd

import { defineStore } from "pinia";
import { ref } from "vue";


// API
import { APIResponse } from "../../services/api/types";
import { AxiosError } from "axios";
import { API } from "../../services/api";
import axios from "../../services/api/axiosClient";
import { SensorRaw } from "../../services/api/sensorRaw/types";


export const useSensorTestStore = defineStore("sensorTestsStore", () => {
  const sensorTests = ref<SensorRaw[]>([]);

  // FUNCTIONS : GET + MUTATIONS

  // Get All ECU Tests
  function initSensorTests(data: SensorRaw[]) {
    sensorTests.value = data;
  }


  // Get All EcuTests from DB
  async function dispatchSensorTests(testMode): Promise<APIResponse<SensorRaw[]>> {
    try {

      //let delayers = await delay(3000);
      //const response = await EcuTestsRepo.getEcuTests()
      const response = await axios.get(testMode);
      initSensorTests(response.data);
      return {
        success: true,
        content: response.data,
      };
    } catch (error) {
      const _error = error as AxiosError<string>;
      return {
        success: false,
        status: _error.response?.status,
        content: [new SensorRaw()],
      };
    }
    return {
      success: false,
      content: [new SensorRaw()],
      status: 400,
    };
  }
  return {
    sensorTests,
    initSensorTests,
    dispatchSensorTests,
  };
});
