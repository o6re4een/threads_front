<template>
  <section class="flex flex-col items-center justify-center">
    <form
      action=""
      class="flex flex-row items-center justify-center max-w-80 w-full text-base"
    >
      <IconField>
        <InputIcon class="pi pi-search" @click="clearSearch"></InputIcon>
        <InputText
          v-model="searchInput"
          @input="handleInput"
          type="text"
          style="border-color: var(--primary-color)"
          class="p-3 w-full border-none rounded-[8px] text-white bg-(--btn-bg-color) placeholder:text-white placeholder:text-base"
          placeholder="Поиск"
          autofocus
        >
        </InputText>
        <InputIcon
          class="pi pi-times"
          @click="clearSearch"
          style="cursor: pointer"
        ></InputIcon>
      </IconField>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { debounce } from "@/utills";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";

const searchInput = ref("");
const props = defineProps({
  setSearch: {
    type: Function,
    required: true,
  },
});
const debouncedSearch = debounce((value: string) => {
  props!.setSearch(value);
}, 500);

function clearSearch() {
  searchInput.value = "";
  debouncedSearch("");
}

function handleInput(e: Event) {
  const value = (e.target as HTMLInputElement).value;
  searchInput.value = value;
  debouncedSearch(value);
}
</script>
