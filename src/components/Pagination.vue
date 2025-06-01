<template>
  <div
    v-if="totalPages > 1"
    class="flex justify-center items-center gap-1 mt-6 flex-wrap"
  >
    <!-- Кнопка «назад» -->
    <button
      :disabled="internalCurrentPage === 1"
      @click="changePage(internalCurrentPage - 1)"
      class="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100"
    >
      <i class="pi pi-angle-left"></i>
    </button>

    <!-- Перебираем «умный» список элементов пагинации -->
    <template v-for="(item, idx) in pageList" :key="`pg-${idx}-${item}`">
      <!-- Если элемент — число, рисуем кнопку -->
      <button
        v-if="typeof item === 'number'"
        @click="changePage(item)"
        :class="[
          'px-3 py-1 rounded border',
          item === internalCurrentPage
            ? 'bg-blue-600 text-white'
            : 'bg-white hover:bg-gray-100',
        ]"
      >
        {{ item }}
      </button>

      <!-- Если элемент — «ELLIPSIS», просто рисуем многоточие -->
      <span v-else class="px-3 py-1 text-gray-500 select-none"> … </span>
    </template>

    <!-- Кнопка «вперёд» -->
    <button
      :disabled="internalCurrentPage === totalPages"
      @click="changePage(internalCurrentPage + 1)"
      class="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100"
    >
      <i class="pi pi-angle-right"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs, watch, ref } from "vue";

const props = defineProps<{
  currentPage: number; // текущая страница
  total: number; // общее количество элементов
  limit: number; // элементов на странице
}>();

const emit = defineEmits<{
  (e: "update:page", newPage: number): void;
}>();

// Распакуем props
const { currentPage, total, limit } = toRefs(props);

// Локальная копия currentPage, чтобы можно было реактивно отслеживать
const internalCurrentPage = ref(currentPage.value);

// При изменении входного prop.currentPage обновляем внутреннее значение
watch(currentPage, (val) => {
  internalCurrentPage.value = val;
});

// Вычисляем общее число страниц (минимум 1)
const totalPages = computed(() => {
  return Math.max(1, Math.ceil((total.value ?? 0) / limit.value));
});

/**
 * Строим «умный» список: числа и метки «ELLIPSIS»
 */
const pageList = computed<Array<number | "ELLIPSIS">>(() => {
  const pages: Array<number | "ELLIPSIS"> = [];
  const totalP = totalPages.value;
  const curr = internalCurrentPage.value;

  function pushPage(n: number | "ELLIPSIS") {
    if (pages.length === 0) {
      pages.push(n);
      return;
    }
    const last = pages[pages.length - 1];
    // не добавляем два «ELLIPSIS» подряд
    if (last === "ELLIPSIS" && n === "ELLIPSIS") return;
    // не дублируем числа
    if (typeof last === "number" && typeof n === "number" && last === n) return;
    pages.push(n);
  }

  if (totalP <= 7) {
    // если мало страниц, просто выводим все
    for (let i = 1; i <= totalP; i++) {
      pushPage(i);
    }
    return pages;
  }

  // Всегда показываем первые две страницы
  pushPage(1);
  pushPage(2);

  // Если мы «далеко» от начала, показываем «…»
  if (curr > 4) {
    pushPage("ELLIPSIS");
  }

  // Диапазон вокруг текущей: от max(3, curr-2) до min(totalP-2, curr+2)
  const start = Math.max(3, curr - 2);
  const end = Math.min(totalP - 2, curr + 2);
  for (let num = start; num <= end; num++) {
    pushPage(num);
  }

  // Если мы «далеко» от конца, показываем «…»
  if (curr < totalP - 3) {
    pushPage("ELLIPSIS");
  }

  // Всегда показываем две последние страницы
  pushPage(totalP - 1);
  pushPage(totalP);

  return pages;
});

// Функция для смены страницы: обновляем local state и эмитим событие
function changePage(newPage: number) {
  if (newPage < 1) newPage = 1;
  if (newPage > totalPages.value) newPage = totalPages.value;
  if (newPage === internalCurrentPage.value) return;
  internalCurrentPage.value = newPage;
  emit("update:page", newPage);
}
</script>
