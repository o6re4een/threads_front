<template>
  <div class="flex flex-col items-center">
    <Header></Header>
    <main class="container mx-auto flex flex-col items-center justify-center">
      <router-view />
    </main>

    <footer>My footer</footer>
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
</script>
