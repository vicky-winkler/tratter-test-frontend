<template>
    <!-- Modal SensorTest -->
    <div v-if="testConfigStore.testModeID === 1">
        <p class="pb-6">Please ensure BOTH RFID-Antennas are plugged in correctly!</p>
        <img :src="rfidBothImage"/>
    </div>
    <!-- Modal BootTest -->
    <div v-else-if="testConfigStore.testModeID === 2 || testConfigStore.testModeID === 5 || testConfigStore.testModeID === 4">
        <p class="pb-6">Please ensure the right RFID-Antenna is plugged in correctly!</p>
        <img :src="rfidSingleImage"/>
    </div>

</template>

<script setup>

// VUE
import { onMounted, onUnmounted, ref } from 'vue';
import { RouterLink } from "vue-router";
import { Buffer } from 'buffer';

// PrimeVue
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Button from "primevue/button";
import Dialog from 'primevue/dialog';
import Password from 'primevue/password';


// Stores & Data
import { useTestConfigStore } from '../../store/testConfigStore';


// Images
import rfidBothImage from "../../assets/imgs/rfid/rfid_both.png"
import rfidSingleImage from "../../assets/imgs/rfid/rfid_single_right.png"



/* CODE STARTS HERE */
const testConfigStore = useTestConfigStore();




onMounted(() => {

})


onUnmounted(() => {

})





</script>
