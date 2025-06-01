<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Создание поста</h1>

    <Form
      v-slot="{ title, content, category }"
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
      <div>
        <Select
          name="category"
          :options="categories"
          optionValue="name"
          optionLabel="name"
          filter
          placeholder="Выберите категорию"
          fluid
        />
        <Message
          v-if="category?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ category?.error?.message }}</Message
        >
      </div>

      <!-- Контент -->
      <FloatLabel>
        <Textarea name="content" rows="5" class="w-full" autoResize />
        <label for="content">Описание</label>
        <Message v-if="content?.invalid" severity="error">{{
          content?.error?.message
        }}</Message>
      </FloatLabel>

      <!-- Загрузка изображения -->
      <ImageUploader :on-upload="handleUpload" />

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
import { onMounted, ref } from "vue";
import Select from "primevue/select";
import { useRouter } from "vue-router";
import { Form } from "@primevue/forms";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import Message from "primevue/message";
import { usePostStore } from "@/store/PostStore";
import ImageUploader from "@/components/ImageUploader.vue";
import { storeToRefs } from "pinia";
import type { createPostPayload } from "@/types";

const router = useRouter();
const postStore = usePostStore();
const { categories } = storeToRefs(postStore);
const fileUrl = ref<string | null>(null);

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

onMounted(async () => {
  if (!categories?.value?.length) {
    await postStore.getCategories();
  }
});

const handleCreatePost = async ({ values }: any) => {
  const processedValues = values.values;
  const payload: createPostPayload = {
    title: processedValues.title,
    content: processedValues.content,
    image_url: fileUrl.value,
    category: processedValues.category,
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
