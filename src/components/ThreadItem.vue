<template>
  <div
    class="flex first-child:border-b-2 border-red-300"
    :class="groupClass"
    :id="`thread-${thread.id}`"
  >
    <!-- Линия вложенности -->
    <div v-if="level > 0" class="relative w-4 flex justify-start">
      <!-- <div class="border-l-1 border-black"></div> -->
      <div
        class="w-1 border-l-3 -top-4 absolute cursor-pointer transition-colors duration-300"
        :class="[
          isLastChild ? 'h-4' : 'h-[105%]',
          isHovered ? 'border-purple-500' : 'border-gray-300',
        ]"
      ></div>

      <div
        class="h-6 w-4 rounded-bl-lg border-l-3 border-b-3 cursor-pointer transition-colors duration-300"
        :class="[isHovered ? 'border-purple-500' : 'border-gray-300']"
      ></div>
    </div>

    <!-- Контент треда -->
    <div
      class="flex-1 pb-2"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div
        class="bg-blue-200 rounded-xl p-3 hover:bg-blue-300 transition-colors"
      >
        <div class="text-sm text-gray-700 mb-2">
          <span class="font-semibold">
            Пользователь {{ thread.user?.user_name || "Anon" }}
          </span>
        </div>
        <div class="text-gray-900 whitespace-pre-wrap">
          {{ thread.content }}
        </div>
        <div v-if="thread?.image_url">
          <img
            v-if="thread?.image_url"
            :src="thread.image_url"
            @click="showImage(thread.image_url)"
            alt=""
            @error="thread.image_url = null"
            loading="lazy"
            class="mt-2 max-w-full rounded-lg h-[300px] cursor-zoom-in object-scale-down transition-transform duration-200 hover:scale-105"
          />
        </div>
        <div class="text-right mt-2">
          <button
            class="text-base hover:underline cursor-pointer bg-(--primary-color) text-white px-2 py-1 rounded transition-colors duration-200"
            @click="toggleEditorForThread(thread.id)"
          >
            Ответить
          </button>
        </div>
      </div>
      <Form
        v-if="activeEditorThreadId === thread.id"
        v-slot="{ content }"
        :resolver="validateForm"
        @submit="createRootThread"
        class="flex flex-col gap-4 my-6"
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

      <!-- Дочерние ответы -->
      <div
        v-if="thread.children && thread.children.length"
        class="mt-2 space-y-2"
      >
        <ThreadItem
          v-for="child in thread.children"
          :key="child.id"
          :thread="child"
          :level="level + 1"
          :isLastChild="
            thread.children.indexOf(child) === thread.children.length - 1
          "
          :activeEditorThreadId="activeEditorThreadId"
          :toggleEditorForThread="toggleEditorForThread"
          :createRootThread="createRootThread"
          :validateForm="validateForm"
          :handleUpload="handleUpload"
        />
      </div>
    </div>
    <div
      v-if="modalImage"
      class="fixed inset-0 bg-opacity-70 backdrop-blur-[40px] flex items-center justify-center z-50"
      @click.self="closeImage"
    >
      <img
        @click="closeImage"
        :src="thread?.image_url"
        class="max-w-[90vw] max-h-[90vh] rounded-lg cursor-zoom-out"
        alt="Увеличенное изображение"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from "vue";
import ThreadItem from "./ThreadItem.vue";
import { getTimeAgo } from "@/utills";
import type { Thread } from "@/types";
import { Form } from "@primevue/forms";
import Button from "primevue/button";
import Message from "primevue/message";
import Textarea from "primevue/textarea";
import FloatLabel from "primevue/floatlabel";
import FileUpload from "primevue/fileupload";
const isHovered = ref(false);

const groupClass = computed(() => `group-level-${props.level}`);
const props = defineProps({
  thread: {
    type: Object as PropType<Thread>,
    required: true,
  },
  level: {
    type: Number,
    default: 0,
  },
  isLastChild: {
    type: Boolean,
    default: false,
  },
  activeEditorThreadId: {
    type: Number,
    default: null,
  },
  toggleEditorForThread: {
    type: Function,
    ddefault: () => {},
  },
  createRootThread: {
    type: Function,
    default: () => {},
  },
  validateForm: {
    type: Function,
    default: () => {},
  },
  handleUpload: {
    type: Function,
    default: () => {},
  },
});
const modalImage = ref(null);

const showImage = (url) => {
  modalImage.value = url;
};

const closeImage = () => {
  modalImage.value = null;
};
const timeAgo = computed(() => {
  return "2 часа назад";
});
</script>
