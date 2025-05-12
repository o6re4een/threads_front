import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
const pinia = createPinia();
import "primeicons/primeicons.css";

const app = createApp(App);
app
  .use(PrimeVue, {
    theme: {
      preset: Aura,
    },
    options: {
      darkModeSelector: false || "none",
    },
  })
  .use(pinia)
  .use(router)
  .mount("#app");
