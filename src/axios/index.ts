import { useAuthStore } from "@/store/auth";
import axios from "axios";
import * as toast from "@/composables/toast";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
      toast.error(
        "Ошибка авторизации!",
        "Время авторизации истекло, авторизуйтесь снова!"
      ); // Показываем сообщение об ошибке
    }

    return Promise.reject(error); // Прокидываем ошибку дальше
  }
);
export default instance;
