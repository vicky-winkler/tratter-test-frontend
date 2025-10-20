
<template>
   <MainModeLayout></MainModeLayout>
</template>


<script setup lang="ts">
</script>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 2rem; */
}
img {
  margin: 5px;
}
.plugins {
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
}

.p-selectbutton{
  --p-selectbutton-border-radius: 0px;
  --p-togglebutton-checked-background: #34d399;
  --p-togglebutton-background: #3f3f46;
  --p-togglebutton-hover-background: #71717a;
}

.p-togglebutton{
  font-size: 1.75rem !important;
}

.p-dialog{
  --p-dialog-border-radius: 0px;
  --p-dialog-title-font-size: 2rem;
}
.p-dialog-content{
  font-size: 1.5rem;
}

.p-button{
	--p-button-border-radius: 0px;
}

.p-button-label{
  font-size: 2rem;
}

.p-toast{
  --p-toast-border-radius: 0px;
  --p-toast-blur: 0px;
	--p-toast-summary-font-size: 2rem;
  --p-toast-icon-size: 2rem;
  --p-toast-detail-font-size: 1.5rem;
  --p-toast-width: 45%
}

.p-toast-message{

  font-size: 2rem;
}

.p-paginator-content{
  font-size: 1.5rem;
}



/* Only apply to dialogs with the .custom-error-dialog class */
.custom-error-dialog .p-dialog-close-button {
  color: black !important;
}

.custom-error-dialog .p-dialog-close-button svg path {
  fill: black !important;
}


</style>
