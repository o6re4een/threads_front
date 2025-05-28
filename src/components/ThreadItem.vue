<template>
  <div class="flex first-child:border-b-2 border-red-300" :class="groupClass">
    <!-- Линия вложенности -->
    <div v-if="level > 0" class="relative w-4 flex justify-start">
      <!-- <div class="border-l-1 border-black"></div> -->
      <div
        class="w-1 border-l-3 -top-4 absolute cursor-pointer transition-colors duration-300"
        :class="[
          isLastChild ? 'h-4' : 'h-[105%]',
          isHovered ? 'border-purple-500' : 'border-gray-300',
        ]"
      ></div>

      <div
        class="h-6 w-4 rounded-bl-lg border-l-3 border-b-3 cursor-pointer transition-colors duration-300"
        :class="[isHovered ? 'border-purple-500' : 'border-gray-300']"
      ></div>
    </div>

    <!-- Контент треда -->
    <div
      class="flex-1 pb-2"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div
        class="bg-blue-200 rounded-xl p-3 hover:bg-blue-300 transition-colors"
      >
        <div class="text-sm text-gray-700 mb-2">
          <span class="font-semibold">
            User {{ thread.user?.user_name || "Anon" }}
          </span>
          <span class="text-xs text-gray-500 ml-2">{{ timeAgo }}</span>
        </div>
        <div class="text-gray-900 whitespace-pre-wrap">
          {{ thread.content }}
        </div>
        <div class="text-right mt-2">
          <button class="text-xs text-blue-700 hover:underline">
            Ответить
          </button>
        </div>
      </div>

      <!-- Дочерние ответы -->
      <div
        v-if="thread.children && thread.children.length"
        class="mt-2 space-y-2"
      >
        <ThreadItem
          v-for="child in thread.children"
          :key="child.id"
          :thread="child"
          :level="level + 1"
          :isLastChild="
            thread.children.indexOf(child) === thread.children.length - 1
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import ThreadItem from "./ThreadItem.vue";
const isHovered = ref(false);
const groupClass = computed(() => `group-level-${props.level}`);
const props = defineProps({
  thread: Object,
  level: {
    type: Number,
    default: 0,
  },
  isLastChild: {
    type: Boolean,
    default: false,
  },
});

const timeAgo = computed(() => {
  return "2 часа назад";
});
</script>
