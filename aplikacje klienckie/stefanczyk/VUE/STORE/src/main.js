import { createApp } from "vue";
import "./styles/style.css";
import App from "./App.vue";
import router from "./router/router.js";
import store from "./store/index.js";
createApp(App).use(router).use(store).mount("#app");
