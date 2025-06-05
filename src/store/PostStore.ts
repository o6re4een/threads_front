import { defineStore } from "pinia";
import instance from "../axios";
import type {
  Category,
  createPostPayload,
  createRootThreadPayload,
  createSubThreadPayload,
  Post,
} from "@/types";
import { useAuthStore } from "@/store/Auth";
import * as toast from "@/composables/toast";
import type { AxiosError } from "axios";
import { ref } from "vue";
export const usePostStore = defineStore("posts", {
  state: () => {
    return {
      posts: [] as Post[],
      selectedPost: null as Post | null,
      sortBy: "relevant" as string,
      selectedCategory: null as string | null,
      categories: null as Category[] | null,
      loading: false,
      currentPage: 1,
      limit: 10,
      total: 0,
      search: "",

      error: null as string | null,
    };
  },
  actions: {
    async fetchPosts() {
      this.loading = true;
      this.error = null;
      try {
        const offset = (this.currentPage - 1) * this.limit;

        const response = await instance.get("/post", {
          params: {
            sort: this.sortBy,
            category: this.selectedCategory,
            search: this.search,
            limit: this.limit,
            offset,
          },
        });

        // 1) Основные данные постов
        this.posts = response.data?.posts;
        this.total = response.data?.total;

        console.log("→ this.total=", this.total);
      } catch (e: any) {
        this.error = e.message || "Unknown error";
      } finally {
        this.loading = false;
      }
    },

    setPage(page: number) {
      // Защита от выхода за границы (необязательно, но полезно)
      if (page < 1) page = 1;
      const maxPage = Math.ceil(this.total / this.limit) || 1;
      if (page > maxPage) page = maxPage;

      this.currentPage = page;
      this.fetchPosts();
    },

    setSearch(value: string) {
      this.search = value;
      this.currentPage = 1;
      this.fetchPosts();
    },

    setSort(sortValue: string) {
      this.sortBy = sortValue;
      this.currentPage = 1;
      this.fetchPosts();
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
      const { authHeaders, isLoggedIn } = useAuthStore();
      if (isLoggedIn === false) {
        toast.error(
          "Вы не авторизованы",
          "Авторизуйтесь, прежде чем писать комментарии"
        );
        return false;
      }

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
        this.error = (error as AxiosError).message;
        return false;
      } finally {
        this.loading = false;
      }
      return true;
    },
    async createSubThread(payload: createSubThreadPayload) {
      const { authHeaders, isLoggedIn } = useAuthStore();
      if (isLoggedIn === false) {
        toast.error(
          "Вы не авторизованы",
          "Авторизуйтесь, прежде чем писать комментарии"
        );
        return false;
      }

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

    async createPost(payload: createPostPayload) {
      const { authHeaders, isLoggedIn } = useAuthStore();
      if (isLoggedIn === false) {
        toast.error(
          "Вы не авторизованы",
          "Авторизуйтесь, прежде чем писать комментарии"
        );
        return false;
      }
      try {
        const response = await instance.post(
          "/post",
          {
            title: payload.title,
            content: payload.content || "",
            image_url: payload.image_url || null,
            category: payload.category || "",
          },
          {
            headers: {
              ...authHeaders(),
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
      } catch (error: unknown) {
        console.error("Ошибка при создании поста:", error);
        if ((error as AxiosError).status === 409) {
          toast.error(
            "Пост с таким названием уже существует",
            "Пожалуйста, выберите другое название."
          );
        } else if ((error as AxiosError).status === 422) {
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

    async getCategories(): Promise<void> {
      try {
        const response = await instance.get("/category");
        if (!(response.status === 200)) {
          toast.error(
            "Ошибка при получении категорий",
            "Пожалуйста, попробуйте еще раз."
          );
          return;
        }
        this.categories = await response.data;
        return;
      } catch (error) {
        toast.error(
          "Ошибка при получении категорий",
          "Пожалуйста, попробуйте еще раз."
        );
      }
    },
  },
  getters: {},
});
