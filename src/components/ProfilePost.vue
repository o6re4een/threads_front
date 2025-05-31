<template>
  <article class="bg-blue-200 rounded-2xl p-6 shadow-md" v-if="selectedPost">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">{{ selectedPost.title }}</h1>
      <router-link
        :to="'/post/' + selectedPost.id"
        class="text-blue-700 hover:underline flex items-center gap-2"
      >
        К посту
        <i class="pi pi-arrow-right" />
      </router-link>
    </div>

    <div v-if="selectedPost.image_url" class="h-48 rounded-lg mb-4">
      <img
        v-if="selectedPost.image_url"
        :src="selectedPost.image_url"
        alt=""
        class="w-fit h-full object-cover rounded-lg"
      />
    </div>
    <p class="mb-4">{{ selectedPost.content }}</p>

    <footer
      class="flex flex-col md:flex-row justify-between text-sm text-gray-700 gap-2 items-end md:items-center"
    >
      <div
        class="flex items-center gap-2 bg-[var(--primary-color)] text-white px-3 py-1 rounded-md"
      >
        <span>Автор: {{ selectedPost.author?.user_name || "Anon" }}</span>
        <span class="ml-4">{{ getTimeAgo(selectedPost.created_at) }}</span>
      </div>

      <div
        class="flex items-center gap-2 bg-[var(--primary-color)] text-white px-3 py-1 rounded-md"
      >
        <i class="pi pi-comment" />
        <span>{{ selectedPost.threads_count }}</span>
      </div>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { getTimeAgo } from "@/utills";
const { selectedPost } = defineProps(["selectedPost"]);
</script>
