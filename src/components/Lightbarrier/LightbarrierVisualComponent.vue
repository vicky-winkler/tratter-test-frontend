<template>
    <!-- White -->
    <div v-if="color === 0" class="flex flex-col gap-12">
        <div class="bg-white text-white">hel</div>
        <div class="bg-white text-white">hel</div>
        <div class="bg-white text-white">hel</div>
        <div class="bg-white text-white">hel</div>
        <div class="bg-white text-white">hel</div>
        <div class="bg-white text-white">hel</div>
        <div class="bg-white text-white">hel</div>
        <div class="bg-white text-white">hel</div>
    </div>
    <!-- Green -->
    <div v-else-if="color === 1" class="flex flex-col gap-12">
        <div class="bg-green-500 text-green-500">hel</div>
        <div class="bg-green-500 text-green-500">hel</div>
        <div class="bg-green-500 text-green-500">hel</div>
        <div class="bg-green-500 text-green-500">hel</div>
        <div class="bg-green-500 text-green-500">hel</div>
        <div class="bg-green-500 text-green-500">hel</div>
        <div class="bg-green-500 text-green-500">hel</div>
        <div class="bg-green-500 text-green-500">hel</div>
    </div>
    <!-- red -->
    <div v-else-if="color === 2" class="flex flex-col gap-12">
        <div class="bg-red-500 text-red-500">hel</div>
        <div class="bg-red-500 text-red-500">hel</div>
        <div class="bg-red-500 text-red-500">hel</div>
        <div class="bg-red-500 text-red-500">hel</div>
        <div class="bg-red-500 text-red-500">hel</div>
        <div class="bg-red-500 text-red-500">hel</div>
        <div class="bg-red-500 text-red-500">hel</div>
        <div class="bg-red-500 text-red-500">hel</div>
    </div>

   
</template>

<script setup>

// VUE
  import { ref, defineProps, watchEffect } from "vue";
  

  
  /* CODE STARTS HERE */
  
  const props = defineProps({
    color:{
        type: Number, 
        default: 1
    },
   
});

const color = ref(props.color);


watchEffect(() => {
    color.value = props.color
});


// set Color
function setColor(colorId){
    color.value = colorId;
}


defineExpose({
    setColor,
});

  


</script>
