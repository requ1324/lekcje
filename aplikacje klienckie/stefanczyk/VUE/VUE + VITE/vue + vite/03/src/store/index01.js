import { createStore } from "vuex";

const state = {
  products: [
    {
      id: 1,
      title: "Koszula",
      price: "40 PLN",
    },
    {
      id: 2,
      title: "Zegarek",
      price: "1000 PLN",
    },
    {
      id: 3,
      title: "Mleko",
      price: "5 PLN",
    },
  ],
}; // state

const getters = {
  GET_PRODUCTS(state) {
    return state.products;
  },
}; // getters

const actions = {}; // actions

const mutations = {}; //mutations

//export store

export default createStore({
  state,
  getters,
  actions,
  mutations,
});
