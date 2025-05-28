<template>
  <div class="p-4 lg:w-5xl md:w-3xl sm:w-xl w-full mx-auto">
    <h1 class="text-2xl font-bold mb-4">Популярные задания</h1>

    <div class="flex flex-wrap gap-4 mb-6">
      <button @click="sortBy = 'relevance'" :class="btnClass('relevance')">
        Релевантность
      </button>
      <button @click="sortBy = 'relevant'" :class="btnClass('relevant')">
        По тредам
      </button>
      <button @click="sortBy = 'old'" :class="btnClass('old')">
        По старости
      </button>
    </div>

    <div v-if="loading" class="text-center text-gray-500">Загрузка...</div>
    <div v-else-if="error" class="text-center text-gray-500">
      Произошла ошибка при загрузке постов: {{ error }}
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <router-link
        :to="{ name: 'PostDetail', params: { id: post.id } }"
        v-for="post in posts"
        :key="post.id"
        class="rounded shadow p-4 bg-(--card-bg-color)"
      >
        <h2 class="text-lg font-semibold">{{ post.title }}</h2>
        <p class="text-gray-600">{{ post.content }}</p>
        <div class="text-sm text-gray-500 mt-2">
          {{ post.threads_count }} тредов
        </div>
      </router-link>
    </div>
  </div>
</template>
