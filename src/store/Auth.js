import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    error: null,
  }),
  actions: {
    async register(payload: { email: string; user_name: string; user_password: string }) {
      try {
        const response = await axios.post('/api/register', payload)
        this.token = response.data.token
        this.user = response.data.user
        this.error = null
      } catch (err: any) {
        this.error = err.response?.data?.detail || 'Registration failed'
      }
    },
    async login(payload: { email: string; user_password: string }) {
      try {
        const response = await axios.post('/api/login', payload)
        this.token = response.data.token
        this.user = response.data.user
        this.error = null
      } catch (err: any) {
        this.error = err.response?.data?.detail || 'Login failed'
      }
    }
  },
})