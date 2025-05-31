<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-4">
    <form
      @submit.prevent="handleRegister"
      class="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
    >
      <h2 class="text-2xl font-bold mb-6 text-center">Регистрация</h2>
      <div class="mb-6">
        <FloatLabel>
          <InputText
            v-model="email"
            type="email"
            required
            class="input input-bordered w-full"
          />
          <label for="email">Email</label>
        </FloatLabel>
      </div>
      <div class="mb-6">
        <FloatLabel>
          <label class="block mb-1 font-medium" for="user_name"
            >Имя пользователя</label
          >
          <InputText
            v-model="user_name"
            type="text"
            required
            class="input input-bordered w-full"
          />
        </FloatLabel>
      </div>
      <div class="mb-6">
        <FloatLabel>
          <label class="block mb-1 font-medium" for="user_password"
            >Пароль</label
          >
          <InputText
            v-model="user_password"
            type="password"
            required
            minlength="8"
            class="input input-bordered w-full"
          />
        </FloatLabel>
      </div>
      <div v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</div>
      <ActionButton type="submit" class="btn w-full btn-primary">
        Зарегистрироваться
      </ActionButton>
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
import { computed, ref } from "vue";
import { useAuthStore } from "@/store/auth";
import ActionButton from "@/components/ActionButton.vue";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import router from "@/router";

const email = ref("");

const user_name = ref("");
const user_password = ref("");

const auth = useAuthStore();
const error = computed(() => auth.error);

const handleRegister = async () => {
  await auth.register({
    email: email.value,
    user_name: user_name.value,
    user_password: user_password.value,
  });
  if (!error.value) {
    router.push({ name: "Home" });
  }
};
</script>
