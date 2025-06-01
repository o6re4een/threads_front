<template>
  <div class="p-4 lg:w-5xl md:w-3xl sm:w-xl w-full mx-auto">
    <!-- Заголовок и кнопка «Создать пост» -->
    <div
      class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3 sm:gap-0"
    >
      <Button
        icon="pi pi-angle-down"
        style="background-color: var(--primary-color); border: none"
        label="Категории"
        @click="toggleCategoryList"
      ></Button>

      <h1 class="text-2xl font-bold">Популярные задания</h1>
      <router-link to="/post/create">
        <Button
          icon="pi pi-plus"
          style="background-color: var(--primary-color); border: none"
          label="Создать пост"
          severity="primary"
        />
      </router-link>
    </div>

    <!-- Сортировка -->
    <div class="flex flex-wrap gap-4 mb-6">
      <button @click="setSort('relevant')" :class="btnClass('relevant')">
        Активные
      </button>
      <button @click="setSort('recent')" :class="btnClass('recent')">
        Новые
      </button>
      <button @click="setSort('old')" :class="btnClass('old')">Старые</button>
    </div>
    <div
      class="absolute bg-(--primary-color) rounded-lg p-2 z-10"
      v-if="categoryEnabled && categories?.length"
    >
      <Listbox
        v-model="selectedCategory"
        :options="categories"
        optionValue="name"
        filter
        optionLabel="name"
        class="w-full md:w-56"
      />
    </div>

    <!-- Состояние загрузки / Ошибка -->
    <div v-if="loading" class="text-center text-gray-500 mb-4">Загрузка...</div>
    <div v-else-if="error" class="text-center text-red-500 mb-4">
      Ошибка при загрузке постов: {{ error }}
    </div>

    <!-- Список постов -->
    <div
      v-if="posts.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <router-link
        v-for="post in posts"
        :key="post.id"
        :to="{ name: 'PostDetail', params: { id: post.id } }"
        class="rounded-lg shadow p-4 bg-(--card-bg-color) hover:shadow-lg transition"
      >
        <h2 class="text-lg font-semibold">{{ post.title }}</h2>
        <p class="text-gray-600 line-clamp-3 mt-2">{{ post.content }}</p>
        <div class="text-sm text-gray-500 mt-2">
          {{ post.threads_count }} тредов · Автор:
          {{ post.author?.user_name || "Неизвестный" }}
        </div>
      </router-link>
    </div>

    <!-- Если постов нет (и не loading и не error) -->
    <div v-else-if="!loading && !error" class="text-gray-500 text-center py-10">
      Нет доступных постов.
    </div>

    <!-- Включаем компонент пагинации -->
    <Pagination
      :current-page="currentPage"
      :total="total"
      :limit="limit"
      @update:page="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, computed, ref, onBeforeMount } from "vue";
import { usePostStore } from "@/store/PostStore";
import { storeToRefs } from "pinia";
import Button from "primevue/button";
import Pagination from "@/components/Pagination.vue";
import Listbox from "primevue/listbox";
const postStore = usePostStore();
const {
  posts,
  loading,
  error,
  currentPage,
  total,
  limit,
  sortBy,
  categories,
  selectedCategory,
} = storeToRefs(postStore);
const { fetchPosts, setPage, setSort, getCategories } = postStore;

const categoryEnabled = ref<boolean>(false);
function toggleCategoryList() {
  console.log("toggleCategoryList");
  categoryEnabled.value = !categoryEnabled.value;
}

// При монтировании подгружаем первую страницу
onBeforeMount(async () => {
  await fetchPosts();
  await getCategories();
});

watch(selectedCategory, async () => {
  console.log("selectedCategory");
  setPage(1);
});

// Когда меняется сортировка, сбрасываем на первую страницу
watch(sortBy, () => {
  setPage(1);
});

// Обработчик события смены страницы от компонента Pagination.vue
function onPageChange(newPage: number) {
  setPage(newPage);
}

// Класс для кнопок сортировки
const btnClass = (type: string) =>
  `px-4 py-2 rounded border ${
    sortBy.value === type
      ? "bg-(--primary-color) text-white"
      : "bg-white hover:bg-gray-100"
  }`;

function onBeforeMounted(arg0: () => Promise<void>) {
  throw new Error("Function not implemented.");
}
</script>
