<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Создание поста</h1>

    <Form
      v-slot="{ title, content }"
      :resolver="validateForm"
      @submit="handleCreatePost"
      class="space-y-4"
    >
      <!-- Заголовок -->
      <FloatLabel>
        <InputText id="title" name="title" class="w-full" />
        <label for="title">Заголовок</label>
        <Message v-if="title?.invalid" severity="error">{{
          title?.error?.message
        }}</Message>
      </FloatLabel>

      <!-- Контент -->
      <FloatLabel>
        <Textarea name="content" rows="5" class="w-full" autoResize />
        <label for="content">Описание</label>
        <Message v-if="content?.invalid" severity="error">{{
          content?.error?.message
        }}</Message>
      </FloatLabel>

      <!-- Загрузка изображения -->
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
          <span>Перетащите изображение или нажмите для загрузки.</span>
        </template>
      </FileUpload>

      <!-- Кнопка отправки -->
      <Button
        label="Создать пост"
        type="submit"
        style="background: var(--primary-color); border: none"
      />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Form } from "@primevue/forms";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import FileUpload from "primevue/fileupload";
import Message from "primevue/message";
import { usePostStore } from "@/store/PostStore";

const router = useRouter();
const postStore = usePostStore();

const fileUrl = ref<string | null>(null);
const fileUploadRef = ref();

const validateForm = (values: any) => {
  const errors: Record<string, any> = {};
  if (!values.title || values.title.trim() === "") {
    errors.title = { message: "Заголовок обязателен" };
  }
  return { values, errors };
};

const handleUpload = (event: any) => {
  try {
    const response = JSON.parse(event.xhr.response);
    fileUrl.value = response.url;
  } catch (err) {
    console.error("Ошибка загрузки изображения:", err);
  }
};

const handleCreatePost = async ({ values }: any) => {
  const processedValues = values.values;
  const payload = {
    title: processedValues.title,
    content: processedValues.content,
    image_url: fileUrl.value,
  };

  try {
    const newPost = await postStore.createPost(payload);
    if (newPost?.id) {
      router.push(`/post/${newPost.id}`);
    }
  } catch (err) {
    console.error("Ошибка при создании поста:", err);
  }
};
</script>
