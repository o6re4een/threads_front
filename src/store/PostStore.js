import { defineStore } from "pinia";
import instance from "../axios";

export const usePostStore = defineStore("posts", {
  state: () => {
    return {
      posts: [],
      selectedPost: null,
      sortBy: "relevant",
      loading: false,
      error: null,
    };
  },
  actions: {
    async fetchPosts(sortBy) {
      this.loading = true;
      // Imitate a delay for the loading state
      // await new Promise((resolve) => setTimeout(resolve, 1500));

      try {
        const response = await instance.get("/post", {
          params: { sort: sortBy },
        });
        if (!response.status === 200) {
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
    async fetchPost(id) {
      this.loading = true;
      try {
        const response = await instance.get(`/post/${id}`);
        if (!response.status === 200) {
          throw new Error("Failed to fetch post");
        }
        this.selectedPost = await response.data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
  getters: {},
});
