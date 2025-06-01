<template>
  <div class="flex flex-wrap gap-4 mb-6">
    <button @click="setSort('relevant')" :class="btnClass('relevant')">
      Активные
    </button>
    <button @click="setSort('recent')" :class="btnClass('recent')">
      Новые
    </button>
    <button @click="setSort('old')" :class="btnClass('old')">Старые</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["update-sort"]);

const setSort = (type: string) => {
  emit("update-sort", type);
  sortBy.value = type;
};
const sortBy = ref("relevant");

const btnClass = (type: string) =>
  `px-4 py-2 rounded border ${
    sortBy.value === type
      ? "bg-(--primary-color) text-white"
      : "bg-white hover:bg-gray-100"
  }`;
</script>
