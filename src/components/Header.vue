<template>
  <header
    class="grid grid-flow-col grid-cols-3 bg-(--header-bg-color) w-full h-[100px] px-8 py-2"
  >
    <div class="flex flex-row items-center justify-start gap-4">
      <slot name="logo"></slot>
      <router-link to="/">
        <Button icon="pi pi-home" aria-label="Save" severity="secondary" />
      </router-link>
    </div>
    <SearchBar />
    <div class="flex flex-row items-center justify-end gap-4">
      <Button icon="pi pi-user" severity="secondary"></Button>
    </div>
  </header>
</template>

<script setup>
import SearchBar from "@/components/Search.vue";

import Button from "primevue/button";
</script>

<style lang="scss" scoped></style>
