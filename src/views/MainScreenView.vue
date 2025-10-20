<template>
  <Toast position="bottom-center" />

  <!-- Header -->
  <div class="pl-12 pr-12 pt-6 flex justify-between">

    <div class="bg-zinc-900" style="width: 50%">
      <h1 class="p-2 pl-6 font-bold bg-zinc-800 uppercase text-white text-left text-3xl">MENU </h1>
    </div>
    <!-- User Logged In -->
        <div class="bg-zinc-900" style="width: 30%">
      <h1 class="p-2 pl-6 font-bold bg-zinc-800 text-white text-left text-3xl">{{testConfigStore.username}}</h1>
    </div>
    <Button class="bg-orange-500 hover:bg-red-700 text-white font-semibold text-center text-xl uppercase"
      @click="logout()" severity="contrast" label="Logout"
      style="width: 20%; font-size: x-large; border-radius: 0px;">Logout
    </Button>
  </div>

  <!-- MAIN -->
  <div class="pl-12 pr-12 pt-6 card ">
    <div class="flex justify-center gap-6">
      <!-- Button SETTINGS / SETUP -->
      <router-link v-if="isAdmin === 'true'" style="width: 33%;" :to="{ name: 'setupTestStationView' }">
        <Button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-none text-center"
          style="border-radius: 0px; height: 70vh; width: 100%;" label="Delete" severity="info">
          <div class="flex-col">
            <i class="pi pi-cog" style="font-size: 4rem"></i>
            <p class="text-3xl uppercase">Setup</p>
          </div>
        </Button>
      </router-link>

      <!-- Button TESTing View (if else depending on current testmode-->
      <router-link v-if="testConfigStore.testModeID === 1" style="width: 33%;" :to="{ name: 'testingSensorView' }">
        <Button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded-none text-center"
          style="border-radius: 0px; height: 70vh;  width: 100%;" label="Delete" severity="info">
          <div class="flex-col">
            <i class="pi pi-check" style="font-size: 4rem"></i>
            <p class="text-3xl uppercase">Sensor Test</p>
          </div>
        </Button>
      </router-link>
      <router-link v-else-if="testConfigStore.testModeID === 2" style="width: 33%;" :to="{ name: 'testingBootView' }">
        <Button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded-none text-center"
          style="border-radius: 0px; height: 70vh;  width: 100%;" label="Delete" severity="info">
          <div class="flex-col">
            <i class="pi pi-check" style="font-size: 4rem"></i>
            <p class="text-3xl uppercase">Boot Test</p>
          </div>
        </Button>
      </router-link>
      <router-link v-else-if="testConfigStore.testModeID === 3" style="width: 33%;" :to="{ name: 'testingConditioningView' }">
        <Button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded-none text-center"
          style="border-radius: 0px; height: 70vh;  width: 100%;" label="Delete" severity="info">
          <div class="flex-col">
            <i class="pi pi-check" style="font-size: 4rem"></i>
            <p class="text-3xl uppercase">Conditioning Test</p>
          </div>
        </Button>
      </router-link>
      <router-link v-else-if="testConfigStore.testModeID === 4" style="width: 33%;" :to="{ name: 'testingRecalibrationView' }">
        <Button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded-none text-center"
          style="border-radius: 0px; height: 70vh;  width: 100%;" label="Delete" severity="info">
          <div class="flex-col">
            <i class="pi pi-check" style="font-size: 4rem"></i>
            <p class="text-3xl uppercase">Recalibration Test</p>
          </div>
        </Button>
      </router-link>
      <router-link v-else-if="testConfigStore.testModeID === 5" style="width: 33%;" :to="{ name: 'testingStepRecalView' }">
        <Button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded-none text-center"
          style="border-radius: 0px; height: 70vh;  width: 100%;" label="Delete" severity="info">
          <div class="flex-col">
            <i class="pi pi-check" style="font-size: 4rem"></i>
            <p class="text-3xl uppercase">Step-Recalibration Test</p>
          </div>
        </Button>
      </router-link>
      <router-link v-else-if="testConfigStore.testModeID === 6" style="width: 33%;" :to="{ name: 'qualitySingleCellView' }">
        <Button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded-none text-center"
          style="border-radius: 0px; height: 70vh;  width: 100%;" label="Delete" severity="info">
          <div class="flex-col">
            <i class="pi pi-check" style="font-size: 4rem"></i>
            <p class="text-3xl uppercase">Quality Single Cell</p>
          </div>
        </Button>
      </router-link>

      <!-- Button RESULTS -->
      <router-link style="width: 33%;" :to="{ name: 'resultsSensorView' }">
        <Button class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-none text-center"
          style="border-radius: 0px; height: 70vh; width: 100%;" label="Delete" severity="info">
          <div class="flex-col">
            <i class="pi pi-list-check" style="font-size: 4rem"></i>
            <p class="text-3xl uppercase">View Results</p>
          </div>
        </Button>
      </router-link>

      <!-- Button Shutdown -->
      <Button class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-none text-center"
        @click="confirmShutdown()" style="border-radius: 0px; min-width: 20%; width: 33%;" label="Delete"
        severity="danger">
        <div class="flex-col">
          <i class="pi pi-power-off" style="font-size: 4rem"></i>
          <p class="text-3xl uppercase">Shut down</p>
        </div>
      </Button>

    </div>
  </div>

  <!-- LOGOS -->
  <div class="pl-12 pr-12 pt-6 pb-6 card flex justify-between footer-bottom">
    <img src="../assets/imgs/logos/consteed_wide_yellow.png" alt="Image Consteed" width="340"/>
    <img src="../assets/imgs/logos/tratter.png" alt="Image Tratter" width="340"/>
  </div>

  <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
//VUEW
import { ref, onBeforeMount, onMounted } from 'vue';
import { RouterLink } from "vue-router";
import router from '../router';
import { Buffer } from 'buffer';

// Graphic Components
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Button from "primevue/button";

// Messaging & Commands
import { FrontEndCommand } from '../services/backendMessaging/commandEnums';
import { connection, establishConnection } from '../services/websocket/mainWebSocket';
import { frontEndCommand } from '../services/backendMessaging/backendCommands';

// Stores & Data
import { useTestConfigStore } from '../store/testConfigStore';






/* CODE STARTS HERE */

window.Buffer = Buffer;
const testConfigStore = useTestConfigStore();
const confirm = useConfirm();
const toast = useToast();

const isAdmin = ref(localStorage.getItem("adminToken"))

onMounted(() => {
  if (connection && connection.readyState === WebSocket.OPEN) {
    frontEndCommand(connection, FrontEndCommand.MainScreenView);
  } else {
    establishConnection()
    frontEndCommand(connection, FrontEndCommand.MainScreenView);
  }
  console.log("notified backend about new view - main " + FrontEndCommand.MainScreenView);
  


})

onBeforeMount(() => {
  isAdmin.value = localStorage.getItem("adminToken")
  console.log(isAdmin.value)
})

const logout = () => {
  if (connection && connection.readyState === WebSocket.OPEN) {
    frontEndCommand(connection, FrontEndCommand.LogoutUser);
    localStorage.removeItem("adminToken")
    localStorage.removeItem("authToken")
    router.push("/");

    console.log("notified backend about user logout " + FrontEndCommand.LogoutUser);
  }
}

const confirmShutdown = () => {
  confirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Teststation Shutdown',
    rejectProps: {
      label: 'Cancel',
      severity: 'contrast',
      outlined: false

    },
    acceptProps: {
      label: 'Shut down',
      severity: 'danger'
    },
    accept: () => {
      toast.add({ severity: 'contrast', summary: 'Confirmed', detail: 'Teststation is shutting down...', life: 5000 });
      frontEndCommand(connection, FrontEndCommand.ShutDown)
      console.log("notified backend about system shutdown " + FrontEndCommand.ShutDown);
    },
    reject: () => {
      toast.add({ severity: 'contrast', summary: 'Rejected', detail: 'Shutdown cancelled', life: 3000 });
    }
  });
};
</script>





<style>

.footer-bottom {
  bottom: 0;
  position: fixed;
  width: 100%;
}

</style>
