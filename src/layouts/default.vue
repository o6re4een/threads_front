<template>
  <div class="flex flex-col items-center">
    <Header></Header>
    <main class="container mx-auto flex flex-col items-center justify-center">
      <router-view />
    </main>
    <Toast position="top-right" />
  </div>
</template>

<script setup>
import Toast from "primevue/toast";

import Header from "@/components/Header.vue";
</script>
