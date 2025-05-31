import { defineStore } from "pinia";
import instance from "../axios";
import type {
  createRootThreadPayload,
  createSubThreadPayload,
  Post,
} from "@/types";
import { useAuthStore } from "./auth";
import * as toast from "@/composables/toast";
import type { AxiosError } from "axios";
export const usePostStore = defineStore("posts", {
  state: () => {
    return {
      posts: [],
      selectedPost: null as Post | null,
      sortBy: "relevant" as string,
      loading: false,
      img: null as string | null,
      error: null,
    };
  },
  actions: {
    async fetchPosts(sortBy: string = "relevant") {
      this.loading = true;
      // Imitate a delay for the loading state
      // await new Promise((resolve) => setTimeout(resolve, 1500));

      try {
        const response = await instance.get("/post", {
          params: { sort: sortBy },
        });
        if (response.status !== 200) {
          console.log(response);
          throw new Error("Failed to fetch posts");
        }
        this.posts = response.data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchPost(id: number) {
      this.loading = true;
      try {
        const response = await instance.get(`/post/${id}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch post");
        }
        this.selectedPost = await response.data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async createRootThread(payload: createRootThreadPayload) {
      const { authHeaders } = useAuthStore();

      try {
        const response = await instance.post(
          `/thread/post/${this!.selectedPost!.id}`,
          {
            content: payload.content,
            image_url: payload.image_url,
          },
          {
            headers: {
              ...authHeaders(),
            },
            withCredentials: true,
          }
        );

        if (response.status !== 201) {
          throw new Error("Failed to create post");
        }
      } catch (error) {
        this.error = error?.message;
        return false;
      } finally {
        this.loading = false;
      }
      return true;
    },
    async createSubThread(payload: createSubThreadPayload) {
      const { authHeaders } = useAuthStore();

      try {
        const response = await instance.post(
          `/thread/thread`,
          {
            content: payload.content,
            image_url: payload.image_url,
            parent_id: payload.parent_id,
          },
          {
            headers: {
              ...authHeaders(),
            },
            withCredentials: true,
          }
        );

        if (response.status !== 201) {
          throw new Error("Failed to create post");
        }
      } catch (error) {
        this.error = error?.message;
        return false;
      } finally {
        this.loading = false;
      }
      return true;
    },

    async createPost(payload: {
      title: string;
      content?: string;
      image_url?: string;
    }) {
      try {
        const response = await instance.post(
          "/post",
          {
            title: payload.title,
            content: payload.content || "",
            image_url: payload.image_url || null,
          },
          {
            headers: {
              ...useAuthStore().authHeaders(),
            },

            withCredentials: true,
          }
        );
        if (!(response.status === 201)) {
          toast.error(
            "Ошибка при создании поста",
            "Пожалуйста, попробуйте еще раз."
          );
        }

        return await response.data;
      } catch (error: AxiosError) {
        console.error("Ошибка при создании поста:", error);
        if (error.status === 409) {
          toast.error(
            "Пост с таким названием уже существует",
            "Пожалуйста, выберите другое название."
          );
        } else if (error.status === 422) {
          console.log("dff");
          toast.error(
            "Ошибка валидации",
            "Пожалуйста, проверьте введенные данные."
          );
        } else {
          toast.error(
            "Ошибка при создании поста",
            "Пожалуйста, попробуйте еще раз."
          );
        }
      }
    },
  },
  getters: {},
});
