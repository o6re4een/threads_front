import { useAuthStore } from "@/store/auth";
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000,
  //   withCredentials: true,
});
instance.interceptors.response.use(
  (response) => response, // если всё хорошо, просто вернуть response
  (error) => {
    if (error.response?.status === 401) {
      // Разлогиниваем пользователя при 401
      const authStore = useAuthStore(); // Получаем store
      authStore.logout(); // Вызываем logout
    }

    return Promise.reject(error); // Прокидываем ошибку дальше
  }
);
export default instance;
