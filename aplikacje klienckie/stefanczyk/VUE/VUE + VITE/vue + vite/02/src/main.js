import { createApp } from "vue";
import { createStore } from "vuex";
import cars from "./assets/cars.json";
import "./style.css";
import App from "./App6.vue";

const store = createStore({
  state: {
    c: 0,
    cars: cars,
  },
  mutations: {
    plus(state) {
      state.c++;
    },
    minus(state) {
      if (state.c - 1 < 0) {
        alert("Za mała liczba");
      } else {
        state.c--;
      }
    },
  },
});

createApp(App).use(store).mount("#app");
