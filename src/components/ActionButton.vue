<template>
  <button
    class="bg-(--btn-bg-color) w-full h-[39px] rounded-[33px] text-white text-base font-bold flex items-center justify-center"
    @click="$emit('action')"
  ></button>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["action"]);
</script>

<style scoped></style>
