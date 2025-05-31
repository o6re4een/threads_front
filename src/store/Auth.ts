import { defineStore } from "pinia";
import instance from "@/axios";
import { type JWTToken } from "@/types";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null as JWTToken | null,
    error: null,
    isAuthenticated: false,
  }),
  actions: {
    async register(payload: {
      email: string;
      user_name: string;
      user_password: string;
    }) {
      try {
        const response = await instance.post("/user", payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        this.token = {
          access_token: response.data.access_token,
          token_type: response.data.token_type,
        };

        this.error = null;
        localStorage.setItem("token", this.token.access_token);
        localStorage.setItem("tokenType", this.token.token_type);
        this.isAuthenticated = true; // Set authenticated state
      } catch (err: any) {
        this.error = err.response?.data?.detail || "Registration failed";
      }
    },
    authHeaders() {
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this!.token!.access_token}`,
      };
    },
    async login(payload: { username: string; password: string }) {
      try {
        const params = new URLSearchParams();
        params.append("username", payload.username);
        params.append("password", payload.password);
        params.append("grant_type", "password");
        const response = await instance.post("/auth/login", params);
        // console.log(response.data);
        this.token = {
          access_token: response.data.access_token,
          token_type: response.data.token_type,
        };

        // this.checkToken(this.token);

        this.error = null;
        localStorage.setItem("token", this.token.access_token);
        localStorage.setItem("tokenType", this.token.token_type);
        // console.log("Login successful:", this.token);
        this.isAuthenticated = true; // Set authenticated state
      } catch (err: any) {
        this.error = err.response?.data?.detail || "Login failed";
        console.error("Login error:", err);
      }
      return;
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenType");
      this.user = null;
      this.token = null;
      this.error = null;
      this.isAuthenticated = false; // Reset authenticated state
    },

    checkAuth() {
      const token = localStorage.getItem("token");
      const tokenType = localStorage.getItem("tokenType");
      if (token && tokenType) {
        this.token = { access_token: token, token_type: tokenType };
        this.isAuthenticated = true; // Set authenticated state
      } else {
        this.isAuthenticated = false; // Reset authenticated state
      }
      return this.isAuthenticated;
    },
  },
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
  },
});
