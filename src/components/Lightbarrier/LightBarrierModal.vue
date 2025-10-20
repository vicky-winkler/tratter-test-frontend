<template>
    <!-- Modal Lightbarrier Crossed -->
    <div>
        <p class="pb-6">Machine stopped! Lightbarrier has been crossed!</p>
        <p class="pb-6">Press Start-Button to continue!</p>
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





/* CODE STARTS HERE */
const testConfigStore = useTestConfigStore();




onMounted(() => {

})


onUnmounted(() => {

})





</script>
