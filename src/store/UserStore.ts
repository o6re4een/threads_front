import { defineStore } from "pinia";
import instance from "@/axios";
import { useAuthStore } from "./auth";
import type { Post, Thread, User } from "@/types";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    error: null as string | null,
    loading: false,
    isAuthenticated: false,
    userThreads: [] as Thread[],
    userPosts: [] as Post[],
  }),
  actions: {
    getAuth() {
      const authStore = useAuthStore();
      this.isAuthenticated = authStore.checkAuth();
    },
    async getUserThreads() {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        this.error = "User not authenticated";
        return;
      }
      this.loading = true;
      const { authHeaders } = authStore;
      try {
        const response = await instance.get("/user/threads", {
          withCredentials: true,
          headers: {
            ...authHeaders(),
          },
        });
        if (response.status !== 200) {
          throw new Error("Failed to fetch user threads");
        }
        this.userThreads = response.data;
        this.error = null;
        this.loading = false;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
      }
    },
    async getUser() {
      this.loading = true;
      const { authHeaders } = useAuthStore();
      try {
        const response = await instance.get(`/user/me`, {
          withCredentials: true,
          headers: {
            ...authHeaders(),
          },
        });
        if (response.status !== 200) {
          throw new Error("Failed to fetch user");
        }
        this.user = response.data;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
      }
      this.loading = false;
    },
    async getUserPosts() {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        this.error = "User not authenticated";
        return;
      }
      this.loading = true;
      const { authHeaders } = authStore;
      try {
        const response = await instance.get("/user/posts", {
          withCredentials: true,
          headers: {
            ...authHeaders(),
          },
        });
        if (response.status !== 200) {
          throw new Error("Failed to fetch user posts");
        }
        this.userPosts = response.data;
        this.error = null;
        this.loading = false;
        return;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
      }
    },
  },
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
  },
});
