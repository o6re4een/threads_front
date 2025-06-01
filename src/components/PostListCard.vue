<template>
  <h2 class="text-lg font-semibold">{{ post.title }}</h2>
  <p class="text-gray-600 line-clamp-3 mt-2">{{ post.content }}</p>
  <div class="text-sm text-gray-500 mt-2">
    {{ post.threads_count }} тредов · Автор:
    {{ post.author?.user_name || "Неизвестный" }}
  </div>
</template>

<script setup lang="ts">
import { type Post } from "@/types";
import type { PropType } from "vue";
const props = defineProps({
  post: { type: Object as PropType<Post>, required: true },
});
</script>

<style lang="scss" scoped></style>
