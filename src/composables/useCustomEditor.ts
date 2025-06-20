// composables/useCreateThread.ts
import { ref } from "vue";
import { usePostStore } from "@/store/PostStore";
import type { createRootThreadPayload, createSubThreadPayload } from "@/types";
import { useRoute } from "vue-router";
import * as toast from "@/composables/toast";
// import { useToast } from "primevue/usetoast";
export function useCustomEditor() {
  const postStore = usePostStore();
  const route = useRoute();
  const postId = route.params.id;

  const isEditing = ref(false);
  const fileUrl = ref<string | null>(null);
  const fileUploadRef = ref();
  const threads = ref([]);

  const activeEditorThreadId = ref<number | null>(null);

  const toggleEditorForThread = (threadId: number | null) => {
    activeEditorThreadId.value =
      activeEditorThreadId.value === threadId ? null : threadId;
  };
  const toggleEditor = () => {
    isEditing.value = !isEditing.value;
  };

  const validateForm = (values: any) => {
    const errors: Record<string, any> = {};
    if (!values.content || values.content.trim() === "") {
      errors.content = { message: "Поле обязательно для заполнения." };
    }
    return { values, errors };
  };

  const handleUpload = (event: any) => {
    try {
      const response = JSON.parse(event.xhr.response);
      fileUrl.value = response.url;
    } catch (err) {
      console.error("Ошибка при обработке изображения", err);
    }
  };

  const onSuccess = async () => {
    await postStore.fetchPost(postId);
    threads.value = postStore.selectedPost?.threads || [];
    toast.success("Тред успешно создан", "Ваш под-тред был успешно добавлен.");
  };

  const createRootThread = async ({ values }: any) => {
    const payload: createRootThreadPayload = {
      content: values.values.content,
      image_url: fileUrl.value,
    };

    if (activeEditorThreadId.value !== null) {
      const subTreadpayload = payload as createSubThreadPayload;
      subTreadpayload.parent_id = activeEditorThreadId.value;

      toggleEditorForThread(null);
      try {
        const newThread = await postStore.createSubThread(subTreadpayload);
        if (newThread) {
          await onSuccess();
        }
      } catch (error) {
        console.error("Ошибка при создании под-треда:", error);
        toast.error(
          "Ошибка при создании под-треда",
          "Пожалуйста, попробуйте еще раз."
        );
      }
      return;
    } else {
      try {
        const newThread = await postStore.createRootThread(payload);
        if (newThread) {
          await onSuccess();
        }
      } catch (err) {
        console.error("Ошибка при создании треда:", err);
        toast.error(
          "Ошибка при создании треда",
          "Пожалуйста, попробуйте еще раз."
        );
      }
    }
    fileUploadRef.value = null; // Clear the file upload input after creating thread
    fileUrl.value = null; // Reset fileUrl after creating thread
    toggleEditor(); // Close the editor
  };

  const initializeThreads = async () => {
    await postStore.fetchPost(postId);
    threads.value = postStore.selectedPost?.threads || [];
  };
  const initializeCategories = async () => {
    await postStore.getCategories();
  };

  return {
    isEditing,
    toggleEditor,
    validateForm,
    handleUpload,
    createRootThread,
    fileUploadRef,
    threads,
    initializeThreads,
    toggleEditorForThread,
    activeEditorThreadId,
    initializeCategories,
  };
}
