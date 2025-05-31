<template>
  <div class="flex gap-2 p-4 border-b border-gray-200 bg-blue-200 rounded-md">
    <!-- Голосование (заглушка) -->

    <!-- Контент -->
    <div class="flex-1">
      <!-- Информация о родителе -->
      <div class="text-sm text-gray-500 mb-1">
        <template v-if="thread.parent">
          <router-link
            class="cursor-pointer"
            :to="{
              name: 'PostDetail', // или path: `/post/${thread.parent.post.id}`,
              params: { id: thread.post_id },
              hash: `#thread-${thread.parent.id}`,
            }"
          >
            <span>Ответ на </span>
            <span class="text-blue-700 italic">
              "{{
                thread.parent.content.length > 30
                  ? thread.parent.content.slice(0, 30) + "…"
                  : thread.parent.content
              }}"
            </span>
          </router-link>
        </template>
        <template v-else>
          <router-link :to="'post/' + post.id.toString()">
            <span>Ответ на пост: </span>
            <span class="text-blue-700 font-semibold">"{{ post?.title }}"</span>
          </router-link>
        </template>
      </div>

      <!-- Заголовок автора и даты -->
      <div class="text-sm text-gray-600 mb-1">
        <span class="font-semibold">{{
          thread.user?.user_name || "Anon"
        }}</span>
        <span class="text-gray-400">
          • {{ formatDate(thread.created_at) }}</span
        >
      </div>

      <!-- Основной текст -->
      <div class="text-gray-900 whitespace-pre-wrap">
        {{ thread.content }}
      </div>

      <!-- Картинка -->
      <div v-if="thread.image_url">
        <img
          :src="thread.image_url"
          @click="showImage(thread.image_url)"
          @error="thread.image_url = null"
          loading="lazy"
          class="mt-2 max-w-full rounded-lg h-[300px] cursor-zoom-in object-scale-down transition-transform duration-200 hover:scale-105"
        />
      </div>

      <!-- Действия -->
      <!-- <div class="flex gap-4 text-sm text-gray-500 mt-2">
        <button class="hover:underline">Reply</button>
        <button class="hover:underline">Share</button>
        <button class="hover:underline">...</button>
      </div> -->
    </div>

    <!-- Модальное изображение -->
    <div
      v-if="modalImage"
      class="fixed inset-0 bg-black/70 backdrop-blur-[40px] flex items-center justify-center z-50"
      @click.self="closeImage"
    >
      <img
        @click="closeImage"
        :src="modalImage"
        class="max-w-[90vw] max-h-[90vh] rounded-lg cursor-zoom-out"
        alt="Увеличенное изображение"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Thread, Post } from "@/types";
import { ref, type PropType } from "vue";

const props = defineProps({
  thread: {
    type: Object as PropType<Thread>,
    required: true,
  },
  post: {
    type: Object as PropType<Post>,
    required: false,
    default: null,
  },
});

const modalImage = ref<string | null>(null);

const showImage = (url: string) => {
  modalImage.value = url;
};

const closeImage = () => {
  modalImage.value = null;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin} мин. назад`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} ч. назад`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays} дн. назад`;
};
</script>
