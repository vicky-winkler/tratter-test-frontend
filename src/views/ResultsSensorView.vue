<template>
  <!-- title + BACK Button -->
  <div class="pl-12 pr-12 pb-6 pt-6 flex justify-between">
    <div class="bg-zinc-900" style="width: 80%">
      <h1 class="p-2 pl-6 font-bold bg-zinc-800 uppercase text-white text-left text-3xl">MENU </h1>
    </div>

    <router-link style="width: 20%" :to="{ name: 'mainScreenView' }"
      class="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-4 rounded-none uppercase text-xl text-center">Back to
      Menu</router-link>

  </div>
  <div class="pl-12 pr-12 card">
    <ResultTableComponent />
  </div>

</template>

<script setup>
// VUE
import { RouterLink } from "vue-router";
import { onMounted, onUnmounted } from 'vue';

// Messaging and Commands
import { connection } from '../services/websocket/mainWebSocket';
import { FrontEndCommand } from '../services/backendMessaging/commandEnums';
import { frontEndCommand } from '../services/backendMessaging/backendCommands';

// Graphic Components
import ResultTableComponent from '../components/ResultPanelComponents/ResultTableComponent.vue';


onMounted(() => {
  // Send View Command
  if (connection) {
    frontEndCommand(connection, FrontEndCommand.ResultsView);
  }
})

onUnmounted(() => {
  // Send View Command
  if (connection) {
    frontEndCommand(connection, FrontEndCommand.MainScreenView);
  }
})
</script>