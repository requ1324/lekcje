import { createApp } from "vue";

import App from "./App3.vue"; // aplikacja
import store from "./store/index03.js"; // --- załączamy store z osobnego pliku ---

createApp(App).use(store).mount("#app");
