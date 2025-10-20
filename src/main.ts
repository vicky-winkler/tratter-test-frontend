import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import Lara from '@primevue/themes/lara';

import VueCountdown from '@chenfengyuan/vue-countdown';
// tailwind
import './index.css'
import 'primeicons/primeicons.css'

// primevue styled
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

// Layouts
import MainModeLayout from "./components/Layouts/MainModeLayout.vue";
import VueApexCharts from "vue3-apexcharts";

import VueCountdown from '@chenfengyuan/vue-countdown';




const app = createApp(App)



app.use(createPinia()) //use pinia
app.use(ToastService);
app.use(ConfirmationService);
app.use(VueApexCharts);
// primevue Theme
app.use(PrimeVue, {
    theme: {
        preset: Lara
    }
})

app.component("MainModeLayout", MainModeLayout)
app.component(VueCountdown.name, VueCountdown);

// PrimeVue
app.component('DataTable', DataTable);
app.component('Column', Column);

// Countdown
app.component(VueCountdown.name, VueCountdown);

app.use(router) //use router

app.mount('#app')
