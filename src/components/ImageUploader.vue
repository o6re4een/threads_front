<template>
  <FileUpload
    ref="fileUploadRef"
    name="file"
    :auto="true"
    :url="uploadUrl"
    @upload="onUpload"
    invalidFileTypeMessage="Только изображения"
    uploadLabel="Выберите файл"
    :show-upload-button="false"
    cancelLabel="Отменить"
    :showCancelButton="false"
    invalidFileSizeMessage="Максимальный размер файла: 5MB"
    accept="image/*"
    :multiple="false"
    :maxFileSize="5 * 1024 * 1024"
    chooseLabel="Загрузить файл"
  >
    <template #empty>
      <span>
        Перетащите изображение сюда или нажмите для загрузки. При выборе больше
        одного файла будет выбран только последний
      </span>
    </template>
  </FileUpload>
</template>

<script setup lang="ts">
import FileUpload from "primevue/fileupload";
import { ref } from "vue";
const uploadUrl = import.meta.env.VITE_API_URL + "/uploads";

defineProps<{
  onUpload: (
    event: import("primevue/fileupload").FileUploadUploadEvent
  ) => void;
}>();

const fileUploadRef = ref();
</script>
