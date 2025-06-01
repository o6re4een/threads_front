<template>
  <div class="max-w-5xl w-full mx-auto py-8 px-4">
    <!-- Пост -->
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

    <!-- Ответ -->
    <section class="mt-8">
      <Form
        v-if="isEditing"
        v-slot="{ content }"
        :resolver="validateForm"
        @submit="createRootThread"
        class="flex flex-col gap-4 mb-6"
      >
        <FloatLabel class="flex flex-col h-[360px]">
          <Textarea
            class="h-full w-full"
            name="content"
            rows="5"
            style="resize: none"
          />
          <label for="content">Введите ответ</label>
          <Message
            v-if="content?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ content?.error?.message }}
          </Message>
        </FloatLabel>

        <FileUpload
          ref="fileUploadRef"
          name="file"
          :auto="true"
          url="http://localhost:8000/uploads"
          @upload="handleUpload"
          accept="image/*"
          :multiple="false"
          :maxFileSize="5 * 1024 * 1024"
        >
          <template #empty>
            <span>Перетащите изображение сюда или нажмите для загрузки.</span>
          </template>
        </FileUpload>

        <Button
          type="submit"
          style="background: var(--primary-color); border: none"
          label="Отправить"
        />
      </Form>

      <!-- Треды -->
      <ThreadItem
        v-for="(thread, idx) in threads"
        :key="thread.id"
        :thread="thread"
        :depth="0"
        :isLastChild="threads[idx].id === threads[threads.length - 1].id"
        :activeEditorThreadId="activeEditorThreadId"
        :toggleEditorForThread="toggleEditorForThread"
        :createRootThread="createRootThread"
        :validateForm="validateForm"
        :handleUpload="handleUpload"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useCreateThread } from "@/composables/useCreateRootThread";
import { storeToRefs } from "pinia";
import { usePostStore } from "@/store/PostStore";
import { getTimeAgo } from "@/utills";

import ThreadItem from "@/components/ThreadItem.vue";
import { Form } from "@primevue/forms";
import Button from "primevue/button";
import Message from "primevue/message";
import Textarea from "primevue/textarea";
import FloatLabel from "primevue/floatlabel";
import FileUpload from "primevue/fileupload";
import { nextTick } from "vue";
const {
  isEditing,
  toggleEditor,
  validateForm,
  handleUpload,
  createRootThread,
  fileUploadRef,
  threads,
  initializeThreads,
  activeEditorThreadId,
  toggleEditorForThread,
} = useCreateThread();

const postStore = usePostStore();
const { selectedPost } = storeToRefs(postStore);

onMounted(async () => {
  await initializeThreads();

  const hash = window.location.hash;

  if (hash && hash.startsWith("#thread-")) {
    // Ждем полной отрисовки DOM
    await nextTick();
    setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring", "ring-blue-400", "transition");
        setTimeout(() => el.classList.remove("ring", "ring-blue-400"), 1500);
      }
    }, 300); // задержка на случай загрузки данных
  }
});
</script>
