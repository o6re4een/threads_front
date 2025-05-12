import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: () => import("@/pages/Post.vue") },
  // { path: "/", component: () => import("@/pages/Home.vue") },
  {
    path: "/post/:id",
    name: "PostDetail",
    component: () => import("@/pages/post/index.vue"),
  },
  //   { path: "/threads", component: () => import("@/pages/ThreadList.vue") },
  //   { path: "/auth", component: () => import("@/pages/Auth.vue") },
  //   { path: "/profile", component: () => import("@/pages/Profile.vue") },
  //   {
  //     path: "/achievements",
  //     component: () => import("@/pages/Achievements.vue"),
  //   },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
