<template>
  <div class="max-w-5xl w-full mx-auto py-8 px-4">
    <!-- Информация о пользователе -->
    <div class="bg-white rounded-xl shadow p-6 gap-6" v-if="user">
      <div
        class="flex flex-col md:flex-row justify-center md:justify-between items-stretch md:items-center gap-4"
      >
        <div>
          <h2 class="text-xl font-semibold">{{ user.user_name }}</h2>
          <p class="text-gray-600">{{ user.email }}</p>
        </div>
        <div>
          <p class="text-xl text-gray-600">
            Опубликовано постов {{ user.posts_count }}
          </p>
          <p class="text-xl text-gray-600">
            Опубликовано тредов {{ user.threads_count }}
          </p>
        </div>
      </div>
    </div>

    <!-- Вкладки: Мои треды / Мои посты -->
    <Tabs value="0" class="mt-6">
      <TabList>
        <Tab value="0">Мои треды</Tab>
        <Tab value="1">Мои посты</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0" header="Мои треды">
          <div v-if="userThreads.length" class="space-y-4">
            <ProfileThread
              v-for="thread in userThreads"
              :key="thread.id"
              :thread="thread"
              :post="thread.post"
            />
          </div>
          <p v-else class="text-gray-500 mt-4">Нет тредов для отображения.</p>
        </TabPanel>
        <TabPanel value="1" header="Мои посты">
          <div v-if="userPosts?.length" class="space-y-4">
            <ProfilePost
              v-for="post in userPosts"
              :key="post.id"
              :selectedPost="post"
            />
          </div>
          <p v-else class="text-gray-500 mt-4">Нет постов для отображения.</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store/UserStore";

// import { useThreadStore } from '@/store/ThreadStore';
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import ProfileThread from "@/components/ProfileThread.vue";
import ProfilePost from "@/components/ProfilePost.vue";
import { storeToRefs } from "pinia";
// import PostCard from "@/components/PostCard.vue";

const userStore = useUserStore();
const { userThreads, user, userPosts } = storeToRefs(userStore);
// const threadStore = useThreadStore();

onMounted(async () => {
  // Получение информации о пользователе
  //   const userData = await userStore.fetchCurrentUser();
  //   user.value = userData;
  //   // Получение тредов пользователя
  await userStore.getUserThreads();
  await userStore.getUser();
  await userStore.getUserPosts();
  // Получение постов пользователя
  //   posts.value = await postStore.fetchUserPosts();
});
</script>
