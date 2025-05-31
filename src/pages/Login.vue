<template>
  <div class="min-h-screen flex items-center justify-center flex-col gap-4">
    <form
      @submit.prevent="handleLogin"
      class="bg-white p-6 rounded-xl shadow-md max-w-xl w-full"
    >
      <h2 class="text-2xl font-bold mb-6 text-center">Вход</h2>
      <div class="mb-6">
        <FloatLabel>
          <InputText
            id="username"
            v-model="email"
            type="username"
            required
            class="input input-bordered w-full bg-"
          />
          <label for="username">Имя пользователя</label>
        </FloatLabel>
      </div>
      <div class="mb-6">
        <FloatLabel>
          <label class="block mb-1 font-medium" for="user_password"
            >Пароль</label
          >
          <InputText
            id="user_password"
            v-model="user_password"
            type="password"
            required
            minlength="8"
            class="input input-bordered w-full"
          />
        </FloatLabel>
      </div>

      <div v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</div>
      <ActionButton type="submit" class="text-white"> Войти </ActionButton>
    </form>
    <div>
      <p>Ещё не зарегистрированы?</p>
      <router-link to="/register" class="text-blue-500 hover:underline">
        Зарегистрироваться
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/store/auth";
import ActionButton from "@/components/ActionButton.vue";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import { storeToRefs } from "pinia";

const email = ref("");
const user_password = ref("");

const auth = useAuthStore();
const { isAuthenticated, error } = storeToRefs(auth);

const handleLogin = async () => {
  await auth.login({ username: email.value, password: user_password.value });
  if (error) {
    console.log(error);
  }

  if (isAuthenticated) {
    console.log("Login successful");
    console.log(localStorage.getItem("token"));
    // Redirect to the home page or another page after successful login
    window.location.href = "/user";
  }
};

onMounted(() => {
  const isAuth = auth.checkAuth();
  if (isAuth) {
    // If already authenticated, redirect to the user page
    window.location.href = "/";
  }
});
</script>
