<template>
   <div class="flex flex-col bg-zinc-800">
        <!-- IEE QrCode -->
        <div class="flex items-center pl-12 pt-6 pb-6 gap-12">
            <label class="text-white text-left text-2xl text-l py-2" style="width: 30%;">QR-Code</label>
            <p class="text-white text-2xl font-bold">{{ qrCode }}</p>
        </div>
        <!-- Size -->
        <div class="flex items-center pl-12 pt-6 pb-6 gap-12">
            <label class="text-white text-left text-2xl text-l py-2" style="width: 30%;">Size</label>
            <p class="text-white text-2xl font-bold">{{ size }}</p>
        </div>
        <!-- Orientation -->
        <div class="flex items-center pl-12 pt-6 pb-6 gap-12">
            <label class="text-white text-left text-2xl text-l py-2" style="width: 30%;">Orientation</label>
            <p class="text-white text-2xl font-bold">{{ orientation }}</p>
        </div>
        <!-- RFID -->
        <div class="flex items-center pl-12 pt-6 pb-6 gap-12">
            <label class="text-white text-left text-2xl text-l py-2" style="width: 30%;">RFID</label>
            <p class="text-white text-2xl font-bold">{{ rfid }}</p>
        </div>
        <!-- Serial Number -->
        <div class="flex items-center pl-12 pt-6 pb-6 gap-12">
            <label class="text-white text-left text-2xl text-l py-2" style="width: 30%;">Serial Number</label>
            <p class="text-white text-2xl font-bold">{{ serialNumber }}</p>
        </div>
    </div>
</template>
  
  
<script setup>
  // VUE
  import { ref, defineProps, watchEffect } from "vue";
  

  
  /* CODE STARTS HERE */
  
  const props = defineProps({
    qrCode:{
        type: String, 
        default: ''
    },
    size:{
        type: String, 
        default: ''
    },
    orientation:{
        type: String, 
        default: ''
    },
    rfid:{
        type: String, 
        default: ''
    },
    serialNumber:{
        type: String, 
        default: ''
    },

   
});

const qrCode = ref(props.qrCode);
const size = ref(props.size);
const orientation = ref(props.orientation);
const rfid = ref(props.rfid);
const serialNumber = ref(props.serialNumber);


watchEffect(() => {
    qrCode.value = props.qrCode
    size.value = props.size
    orientation.value = props.orientation
    rfid.value = props.rfid
    serialNumber.value = props.serialNumber

});

// Set values from IEE QrCode, Size, Orientation
function setQRCodeSizeAndOrientation(qrCodeString, sizeString, orientationString){
    qrCode.value = qrCodeString;
    size.value = sizeString;
    orientation.value = orientationString;
}


// set RFID
function setRfid(rfidString){
    rfid.value = rfidString;
}

// Set Serial Number
function setSerialNumber(serialNumberString){
    serialNumber.value = serialNumberString;
}


// Set Qr Code
function setQrCode(qrCodeString){
    qrCode.value = qrCodeString;
}


// Set Qr Code
function setSizeAndOrientation(sizeString, orientationString){
    size.value = sizeString;
    orientation.value = orientationString;
}


// reset entire component
function resetComponent(){
    qrCode.value = '';
    size.value = '';
    orientation.value = '';
    rfid.value = '';
    serialNumber.value = '';

}


defineExpose({
    setRfid,
    setQRCodeSizeAndOrientation,
    setSerialNumber,
    resetComponent,
    setQrCode,
    setSizeAndOrientation
});

  
  
</script>

  
<style>
</style>