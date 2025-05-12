<template>
  <div class="max-w-5xl mx-auto py-8 px-4">
    <!-- Пост -->
    <div class="bg-blue-200 rounded-2xl p-6 shadow-md">
      <h1 class="text-2xl font-semibold mb-4">{{ post.title }}</h1>
      <div class="bg-blue-100 h-48 rounded-lg mb-4"></div>
      <p class="mb-4">{{ post.content }}</p>
      <div class="flex justify-between text-sm text-gray-700">
        <div class="flex items-center gap-2">
          <span class="text-black">❤️</span>
          <span>{{ post.likes }}</span>
        </div>
        <div>
          <span>Автор: {{ post.author }}</span>
          <span class="ml-4">{{ post.timeAgo }}</span>
        </div>
      </div>
    </div>

    <!-- Треды -->
    <div class="mt-8">
      <ThreadItem
        v-for="(thread, idx) in threads"
        :key="thread.id"
        :thread="thread"
        :depth="0"
        :isLastChild="threads[idx].id === threads[threads.length - 1].id"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usePostStore } from "../../store/PostStore";
import ThreadItem from "@/components/ThreadItem.vue";
import { useRoute } from "vue-router";

const route = useRoute();

const postId = route.params.id;
const postStore = usePostStore();
const post = ref({});
const threads = ref([]);

onMounted(async () => {
  await postStore.fetchPost(postId);
  post.value = postStore.selectedPost;
  threads.value = postStore.selectedPost.threads || [];
});
</script>

<style scoped></style>
