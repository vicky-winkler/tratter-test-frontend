<template>
  <div class="card">
    <div class="card">
      <ProgressBar v-if="sensorTests == null" mode="indeterminate" style="border-radius: 0px; height: 6px;"></ProgressBar>
      <ProgressBar v-else style="border-radius: 0px; height: 6px;"></ProgressBar>

      <DataTable v-if="sensorTests != null" ref="dt" v-model:selection="selectedResults" selectionMode="single"
        :metaKeySelection="false" :value="sensorTests" dataKey="id" :paginator="true" :rows="7" :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[7, 24, 48, 96]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Sensor Tests " @rowSelect="onRowSelect"
        @rowUnselect="onRowUnselect">
        <!-- <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between rounded-none p-0"
            style="border-radius: 0px; width: 15%;">
            <IconField style="border-radius: 0px;">
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Search..." />
            </IconField>
          </div>
        </template> -->

        <Column field="id" header="Id" sortable style="min-width: 6rem; max-height: 3rem"></Column>
        <Column field="rfid" header="Rfid UUID" sortable style="min-width: 12rem; font-size:x-large;"></Column>
        <Column field="size" header="Size" sortable style="min-width: 6rem; font-size:x-large;"></Column>
        <Column field="orientation" header="Side" sortable style="min-width: 6rem; font-size:x-large;"></Column>
        <Column field="timeStamp" header="Timestamp" sortable style="min-width: 10rem; font-size:x-large;"></Column>
        <Column header="Result" class="p-0 m-0" sortable style="width: 10%; font-size:x-large;">
          <template #body="slotProps">
            <div class="p-0 m-0 text-center dark:bg-emerald-400 text-gray-900" v-if="slotProps.data.status">PASS</div>
            <div class="text-center  dark:bg-red-400 text-gray-900" v-else="slotProps.data.status">FAIL</div>
          </template>
        </Column>
      </DataTable>

      <DataTable v-else ref="dt" v-model:selection="selectedResults" selectionMode="single" :metaKeySelection="false"
        :value="dummySkeletonTests" dataKey="id" :paginator="true" :rows="7" :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[7, 24, 48, 96]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Sensor Tests " @rowSelect="onRowSelect"
        @rowUnselect="onRowUnselect">
        <!-- <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between rounded-none" style="border-radius: 0px;">
            <IconField style="border-radius: 0px !important;">
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Search..." />
            </IconField>
          </div>
        </template> -->

        <!-- <Column :exportable="false" style="width: 8rem; max-height: 2rem">
        </Column> -->
        <Column field="id" header="Id" sortable style="min-width: 6rem; height: 3.5rem;  font-size:x-large;">
          <template #body>
            <Skeleton></Skeleton>
          </template>
        </Column>
        <Column field="rfid" header="Rfid UUID" sortable style="min-width: 12rem;  font-size:x-large;">
          <template #body>
            <Skeleton></Skeleton>
          </template>
        </Column>
        <Column field="size" header="Size" sortable style="min-width: 6rem;  font-size:x-large;">
          <template #body>
            <Skeleton></Skeleton>
          </template>
        </Column>
        <Column field="orientation" header="Side" sortable style="min-width: 6rem;  font-size:x-large;">
          <template #body>
            <Skeleton></Skeleton>
          </template>
        </Column>
        <!-- <Column field="teststationId" header="Teststation ID" sortable style="min-width: 16rem"></Column> -->
        <Column field="timeStamp" header="Timestamp" sortable style="min-width: 10rem;  font-size:x-large;">
          <template #body>
            <Skeleton></Skeleton>
          </template>
        </Column>
        <Column header="Result" sortable style="width: 10%;  font-size:x-large;">
          <template #body>
            <Skeleton></Skeleton>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>


</template>

<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';


// PrimeVue

import { FilterMatchMode } from '@primevue/core/api';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import ProgressBar from 'primevue/progressbar';
import Dialog from 'primevue/dialog';
import { SensorRaw } from '../../services/api/sensorRaw/types';
import { useSensorTestStore } from '../../store/sensorTests';
import { useTestConfigStore } from '../../store/testConfigStore';


//const toast = useToast();
// const ecuTestsStore = useEcuTestStore();

const sensorTestsStore = useSensorTestStore();

const testConfigStore = useTestConfigStore();


const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const dt = ref();
const selectedResults = ref();
const ecuResult = ref({});
const sensorTests = ref();
const dummySkeletonTests = ref();


const ecuDetailFrame = ref(false);
const selectedID = ref(-1);



onBeforeMount(async () => {

  // Test Repo
  dummySkeletonTests.value = [new SensorRaw(), new SensorRaw(),new SensorRaw(), new SensorRaw(), new SensorRaw(), new SensorRaw(), new SensorRaw(), new SensorRaw()];
});


onMounted(async () => {
  // Fetch data from API
  const { success, status } = await (testConfigStore.testModeID === 0? sensorTestsStore.dispatchSensorTests("SensorRaw/") :sensorTestsStore.dispatchSensorTests("SensorDone/") );

  if (!success) {
    alert("Something went wrong");
    console.log("api Status", status);
  }
  else {
    sensorTests.value = sensorTestsStore.sensorTests;
  }
});


// const getSeverity = (ecuTest) => {
//   if (ecuTest.status) {
//     return 'success'
//   } else {
//     return 'danger'
//   }
// };

const showDetails = (prod) => {
  ecuResult.value = { ...prod };
  ecuDetailFrame.value = true;
};

const onRowSelect = (event) => {
  selectedID.value = event.data.id
};

const onRowUnselect = (event) => {
  selectedID.value = -1
};

const hideDialog = () => {
  ecuDetailFrame.value = false;
};
</script>