<template>
  <div
    class="thread-branch flex"
    :class="{ 'has-children': thread.children?.length }"
  >
    <!-- Линии вложенности -->
    <div v-if="level > 0" class="thread-line">
      <div class="thread-line-vertical" v-if="!isLastChild"></div>
      <div class="thread-line-vertical-last" v-else></div>
      <div class="thread-line-horizontal"></div>
    </div>

    <!-- Контент треда -->
    <div class="thread-content">
      <div
        class="thread-box"
        @mouseover="highlightBranch(true)"
        @mouseout="highlightBranch(false)"
      >
        <div class="thread-header">
          <span class="username"
            >User {{ thread.user?.user_name || "Unknown" }}</span
          >
          <span class="timestamp">{{ timeAgo }}</span>
        </div>
        <div class="thread-text">{{ thread.content }}</div>
        <div class="thread-actions">
          <button class="reply-btn">Ответить</button>
        </div>
      </div>

      <!-- Дочерние ответы -->
      <div v-if="thread.children?.length" class="thread-children">
        <ThreadItemNew
          v-for="(child, index) in thread.children"
          :key="child.id"
          :thread="child"
          :level="level + 1"
          :isLastChild="index === thread.children.length - 1"
          :parentHighlighted="isHighlighted"
          @highlight="handleChildHighlight"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ThreadItemNew from "./ThreadItemNew.vue";
const props = defineProps({
  thread: Object,
  level: { type: Number, default: 0 },
  isLastChild: { type: Boolean, default: false },
  parentHighlighted: { type: Boolean, default: false },
});

const emit = defineEmits(["highlight"]);

const isHighlighted = ref(false);
const timeAgo = computed(() => "2 часа назад");

function highlightBranch(state) {
  isHighlighted.value = state;
  emit("highlight", state);
}

function handleChildHighlight(state) {
  isHighlighted.value = state;
  emit("highlight", state);
}
</script>

<style scoped>
.thread-branch {
  position: relative;
}

.thread-line {
  position: relative;
  width: 16px;
  min-width: 16px;
}

.thread-line-vertical {
  position: absolute;
  left: 0;
  top: -10px;
  bottom: 0;
  width: 2px;
  background: #e2e8f0;
  margin-left: 7px;
}
.thread-line-vertical-last {
  position: absolute;
  left: 0;
  top: -10px;
  bottom: 0;
  width: 2px;
  height: 25px;
  background: #e2e8f0;
  margin-left: 7px;
}

.thread-line-horizontal {
  position: absolute;
  right: 0;
  top: 24px;
  width: 8px;
  border: 0 0 2px 2px solid #e2e8f0;

  height: 10px;
}

.thread-content {
  flex: 1;
  padding-bottom: 8px;
}

.thread-box {
  background: #ebf8ff;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.2s;
}

.thread-box:hover {
  background: #bee3f8;
}

.thread-header {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 8px;
}

.username {
  font-weight: 600;
}

.timestamp {
  color: #718096;
  font-size: 12px;
  margin-left: 8px;
}

.thread-text {
  white-space: pre-wrap;
  color: #2d3748;
}

.thread-actions {
  text-align: right;
  margin-top: 8px;
}

.reply-btn {
  color: #3182ce;
  font-size: 12px;
  background: none;
  border: none;
  cursor: pointer;
}

.reply-btn:hover {
  text-decoration: underline;
}

.thread-children {
  margin-top: 8px;
  padding-left: 16px;
  position: relative;
}

/* Подсветка всей ветки */
.thread-branch.highlighted .thread-box,
.thread-branch.highlighted .thread-line-vertical,
.thread-branch.highlighted .thread-line-horizontal {
  background-color: #d6bcfa;
}

.thread-branch.highlighted .thread-box {
  background: #e9d8fd;
}
</style>
