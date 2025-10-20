// store for ecuTests https://medium.com/@bugintheconsole/axios-vue-js-3-pinia-a-comfy-configuration-you-can-consider-for-an-api-rest-a6005c356dcd

import { defineStore } from "pinia";
import { ref } from "vue";
import { EcuTest } from "../../services/api/ecuTests/types";

// API
import { APIResponse } from "../../services/api/types";
import { AxiosError } from "axios";
import { API } from "../../services/api";
import axios from "../../services/api/axiosClient";


export const useEcuTestStore = defineStore("ecuTestsStore", () => {
  const ecuTests = ref<EcuTest[]>([]);

  // FUNCTIONS : GET + MUTATIONS

  // Get All ECU Tests
  function initEcuTests(data: EcuTest[]) {
    ecuTests.value = data;
  }

  // ADD
  function addEcuTest(ecuTest: EcuTest) {
    ecuTests.value.push(ecuTest);
  }
  const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
  };
  // Get All EcuTests from DB
  async function dispatchGetEcuTests(): Promise<APIResponse<EcuTest[]>> {
    try {

      //let delayres = await delay(3000);
      //const response = await EcuTestsRepo.getEcuTests()
      const response = await axios.get("EcuTests");
      initEcuTests(response.data);
      return {
        success: true,
        content: response.data,
      };
    } catch (error) {
      const _error = error as AxiosError<string>;
      return {
        success: false,
        status: _error.response?.status,
        content: [new EcuTest()],
      };
    }
    return {
      success: false,
      content: [new EcuTest()],
      status: 400,
    };
  }
  return {
    ecuTests,
    initEcuTests,
    dispatchGetEcuTests,
  };
});
