import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: () => import("@/pages/Home.vue"), name: "Home" },
  // { path: "/", component: () => import("@/pages/Home.vue") },
  {
    path: "/post/:id",
    name: "PostDetail",
    component: () => import("@/pages/post/index.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/Login.vue"),
  },

  {
    path: "/register",
    name: "Register",
    component: () => import("@/pages/Register.vue"),
  },
  {
    path: "/user",
    name: "UserProfile",
    component: () => import("@/pages/UserProfile.vue"),
  },
  {
    path: "/post/create",
    name: "PostCreate",
    component: () => import("@/pages/post/create.vue"),
  },

  //   {
  //     path: "/achievements",
  //     component: () => import("@/pages/Achievements.vue"),
  //   },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["Login", "Register", "Home", "PostDetail"];

  const authRequired = !publicPages.includes(to?.name);
  const loggedIn = localStorage.getItem("token");

  if (authRequired && !loggedIn) {
    return next("/login");
  }

  next();
});

export default router;
