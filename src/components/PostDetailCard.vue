<template>
  <article class="bg-blue-200 rounded-2xl p-6 shadow-md" v-if="selectedPost">
    <h1 class="text-2xl font-semibold mb-4">{{ selectedPost.title }}</h1>
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
        class="flex items-center gap-2 bg-(--primary-color) text-white px-3 py-1 rounded-md"
      >
        <span>Автор: {{ selectedPost.author?.user_name || "Anon" }}</span>
        <span class="ml-4">{{ getTimeAgo(selectedPost.created_at) }}</span>
      </div>

      <div
        class="flex items-center gap-2 bg-(--primary-color) text-white px-3 py-1 rounded-md"
      >
        <Button
          style="background-color: var(--primary-color)"
          :severity="isEditing ? 'danger' : 'primary'"
          @click="toggleEditor"
        >
          <i :class="isEditing ? 'pi pi-times' : 'pi pi-plus'" class="mr-2" />
          {{ isEditing ? "Отменить" : "Ответить" }}
        </Button>
        <i class="pi pi-comment" />
        <span>{{ selectedPost.threads_count }}</span>
      </div>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { getTimeAgo } from "@/utills";
import { usePostStore } from "@/store/PostStore";
</script>
