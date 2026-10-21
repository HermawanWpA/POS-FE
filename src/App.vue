<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
/* Reset dasar global css jika diperlukan */
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #f3f4f6; /* bg-gray-100 */
}
</style>