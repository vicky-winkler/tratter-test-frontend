<template>
    <!-- Modal Label -->
    <div>
        <p class="pb-6">Do not forget the label!</p>
        <img :src="labelImage"/>
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
import labelImage from "../../assets/imgs/label/label_shoe.jpg"



/* CODE STARTS HERE */
const testConfigStore = useTestConfigStore();




onMounted(() => {

})


onUnmounted(() => {

})





</script>
