import { getProducts } from "../api/index.js";

const products = {
  //state
  state() {
    return {
      productsList: [],
      productsLoading: false,
      productsError: null,
    };
  },

  //mutations czyli setters
  mutations: {
    SET_PRODUCTS_LIST(state, newProducts) {
      state.productsList = newProducts;
    },
    SET_PRODUCTS_ERROR(state, error) {
      state.productsError = error;
    },
    SET_PRODUCTS_LOADING(state, loading) {
      state.productsLoading = loading;
    },
  },

  //getters
  getters: {
    GET_PRODUCTS_LIST(state) {
      return state.productsList;
    },
    GET_PRODUCTS_ERROR(state) {
      return state.productsError;
    },
    GET_PRODUCTS_LOADING(state) {
      return state.productsLoading;
    },
  },

  // tu zapytania do serwera z pomocą naszego api
  actions: {
    async FETCH_PRODUCTS({ commit }, options = {}) {
      commit("SET_PRODUCTS_LOADING", true);
      commit("SET_PRODUCTS_ERROR", null);

      try {
        const products = await getProducts(options);
        commit("SET_PRODUCTS_LIST", products);
      } catch (error) {
        commit("SET_PRODUCTS_ERROR", error.message);
      } finally {
        commit("SET_PRODUCTS_LOADING", false);
      }
    },
  },
};

export default products;
