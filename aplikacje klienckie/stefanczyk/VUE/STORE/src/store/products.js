import { getProducts } from "../api/index.js";

const products = {
  //state
  state() {
    return {
      productsList: [],
      productsLoading: false,
      productsError: null,
      totalProducts: 0,
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
    SET_TOTAL_PRODUCTS(state, total) {
      state.totalProducts = total;
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
    GET_TOTAL_PRODUCTS(state) {
      return state.totalProducts;
    },
  },

  // tu zapytania do serwera z pomocą naszego api
  actions: {
    async FETCH_PRODUCTS({ commit }, options = {}) {
      commit("SET_PRODUCTS_LOADING", true);
      commit("SET_PRODUCTS_ERROR", null);

      try {
        const response = await getProducts(options);
        const products = Array.isArray(response)
          ? response
          : response.data || [];

        commit("SET_PRODUCTS_LIST", products);
        commit("SET_TOTAL_PRODUCTS", response.total || products.length);
      } catch (error) {
        commit("SET_PRODUCTS_ERROR", error.message);
      } finally {
        commit("SET_PRODUCTS_LOADING", false);
      }
    },
  },
};

export default products;
