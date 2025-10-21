<template>
    <div class="flex gap-8">
        <!-- TargetPressure -->
        <InputNumber v-model="targetPressure" class="narrow-input" :useGrouping="false" size="small" :disabled="true"/>
        <!-- Loadcell MeasuredPressure -->
        <InputNumber v-model="loadCellResult" class="narrow-input" :useGrouping="false" size="small" :disabled="true"/>

        <!-- Measurement Device Input @blur="emit('close-keyboard')"-->
        <InputNumber 
            ref="manualInputRef" 
            v-model="manualInput" 
            class="larger-input" 
            :useGrouping="false" 
            :disabled="manualInputDisabled" 
            size="small"
            @input="onManualInput"
            @focus="emit('open-keyboard', manualInput, onKeyboardInput, onKeyboardClose)"
            
             />

         <!-- Submit Button -->
        <div class="">
            <Button class="rounded-none text-white font-semibold text-center"
                @click="submitManualInput()" 
                icon="pi pi-check"
                severity="secondary"
                :disabled="deactivateButton"
                style="border-radius: 2px;  height: 35px;">
            </Button>
        </div>
    </div>

</template>
  
  
<script setup>
  // VUE
  import { ref, defineProps, watchEffect, watch, nextTick, defineEmits } from "vue";
  
  // PrimeVue Components
  import InputNumber from 'primevue/inputnumber';
  import Button from "primevue/button";
  import 'primeicons/primeicons.css'


  // Messaging & Commands
  import { connection, getConnection } from '../../services/websocket/mainWebSocket';
  import { BackEndCommand, OscDataType } from "../../services/backendMessaging/commandEnums";
  import { backEndSettingsData, } from '../../services/backendMessaging/backendCommands';

  


  /* CODE STARTS HERE */
  const manualInputRef = ref(null);
  const deactivateButton = ref(true);
  const emit = defineEmits(["open-keyboard", "close-keyboard", "update-manual-input", "submit-manual-input"]);



  const props = defineProps({
    targetPressure:{
        type: Number, 
        default: 0
    },
    loadCellResult:{
        type: Number, 
        default: 0
    },
    manualInput:{
        type: Number, 
        default: 0
    },
    manualInputDisabled:{
        type: Boolean, 
        default: true
    },
   
});

const targetPressure = ref(props.targetPressure);
const loadCellResult = ref(props.loadCellResult);
const manualInput = ref(props.manualInput);
const manualInputDisabled = ref(props.manualInputDisabled);

watchEffect(() => {
    targetPressure.value = props.targetPressure
    loadCellResult.value = props.loadCellResult
    manualInput.value = props.manualInput
    manualInputDisabled.value = props.manualInputDisabled
});


// set targetPressure
function setTargetPressure(targetPressureValue){
    targetPressure.value = targetPressureValue;
}

// set loadCellResult
function setLoadCellResult(loadCellResultValue){
    loadCellResult.value = loadCellResultValue;
}

// set manualInput
function setManualInput(manualInputValue){
    manualInput.value = manualInputValue;
}

// set manualInput
function setManualInputDisabled(newState){
    manualInputDisabled.value = newState;
}


/*
// submit manual input to backend
function submitManualInput(){
    console.log("Button clicked");
    const connectionTest = getConnection();
    // send back end
    if (connectionTest && connectionTest.readyState === WebSocket.OPEN) {
      backEndSettingsData(connectionTest, BackEndCommand.QualitySingleManualInputFrontEnd, OscDataType.Int, manualInput.value);
      console.log("notified backend about ManualInput: " + BackEndCommand.QualitySingleManualInputFrontEnd + " value: " + manualInput.value);
    }

    // disable input
    setManualInputDisabled(true);
    deactivateButton.value = true;

    // close keyboard
    emit("submit-manual-input", manualInput.value);
    emit('close-keyboard');

}
*/

// When it becomes enabled, focus automatically
watch(manualInputDisabled, async (newVal) => {
  if (!newVal) {
    await nextTick();
    manualInputRef.value?.$el?.querySelector('input')?.focus();
  }
});



watch(() => props.manualInput, (newVal) => {
  if (manualInputDisabled.value) {
    manualInput.value = newVal;
  }
});


function onManualInput(event) {
  console.log("on manual input");
  const value = event?.value ?? manualInput.value; // PrimeVue emits {value, originalEvent}
  manualInput.value = value;
  deactivateButton.value = value === null || value === '' || isNaN(value);
  emit("update-manual-input", value);
}

function submitManualInput() {
  console.log("submit manual input");
  emit("submit-manual-input", manualInput.value);
  emit("close-keyboard");
  deactivateButton.value = true;
}

function onKeyboardInput(value) {
  console.log("on keyboard input");
  manualInput.value = value;
  deactivateButton.value = value === null || value === '' || isNaN(value);
  emit("update-manual-input", value);
}

function onKeyboardClose() {
  console.log("Keyboard closed");
  emit("submit-manual-input", manualInput.value);
}



defineExpose({
    setTargetPressure,
    setLoadCellResult,
    setManualInput,
    setManualInputDisabled,
});





  
</script>

  
<style scoped>

::v-deep(.narrow-input .p-inputtext) {
  height: 35px !important;
  padding: 2 !important;
  line-height: 1rem !important;
  width: 140px !important;
  border-radius: 2px !important;
}


::v-deep(.larger-input .p-inputtext) {
  height: 35px !important;
  padding: 2 !important;
  line-height: 1rem !important;
  width: 250px !important;
  border-radius: 2px !important;
}





</style>