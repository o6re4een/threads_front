<template>
  <header
    class="flex sm:flex-row justify-center sm:justify-between gap-5 bg-(--header-bg-color) w-full h-[100px] px-8 py-2 items-center"
  >
    <div
      class="hidden sm:flex flex-row items-center justify-start gap-1 md:gap-4"
    >
      <slot name="logo"></slot>
      <router-link to="/">
        <Button icon="pi pi-home" aria-label="Save" severity="secondary" />
      </router-link>
    </div>
    <SearchBar :setSearch="setSearch" />

    <div class="hidden sm:flex flex-row items-center justify-end gap-4">
      <Button
        v-if="isAuthenticated"
        icon="pi pi-user"
        severity="secondary"
        @click="$router.push('/user')"
      ></Button>
      <Button
        v-if="isAuthenticated"
        icon="pi pi-sign-out"
        severity="secondary"
        @click="logout"
      >
      </Button>
      <Button
        v-if="!isAuthenticated"
        icon="pi pi-sign-in"
        severity="secondary"
        @click="$router.push('/login')"
      />
    </div>
    <div class="sm:hidden flex">
      <Button
        style="background-color: var(--primary-color); border: none"
        type="button"
        class="w-4 h-fit"
        icon="pi pi-bars"
        @click="toggle"
        aria-haspopup="true"
        aria-controls="overlay_menu"
      />
      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    </div>
  </header>
</template>

<script setup lang="ts">
import SearchBar from "@/components/Search.vue";
import Menu from "primevue/menu";
import Button from "primevue/button";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";
import { computed, onBeforeMount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import type { MenuItem } from "primevue/menuitem";
import { usePostStore } from "@/store/PostStore";
const { setSearch } = usePostStore();
const auth = useAuthStore();
const router = useRouter();
const { logout } = useAuthStore();
const { isAuthenticated } = storeToRefs(auth);

onBeforeMount(() => {
  auth.checkAuth();
  items.value = [
    {
      label: "Меню",
      items: [
        {
          label: "Главная",
          icon: "pi pi-home",
          command: () => router.push("/"),
        },
        {
          label: "Профиль",
          icon: "pi pi-user",
          command: () => router.push("/user"),
          visible: isAuthenticated.value,
        },
        {
          label: "Войти",
          icon: "pi pi-sign-in",
          command: () => router.push("/login"),
          visible: !isAuthenticated.value,
        },
        {
          label: "Выйти",
          icon: "pi pi-sign-out",
          command: logout,
          visible: isAuthenticated.value,
        },
      ],
    },
  ];
});
const items = ref<MenuItem[] | null>(null);
const menu = ref(null);

const toggle = (event: Event) => {
  menu.value?.toggle(event);
};
</script>

<style lang="scss" scoped></style>
