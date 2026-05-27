import { getCategories } from "../api/index.js";

const categories = {
  //state
  state() {
    return {
      categoriesList: [],
      categoriesLoading: false,
      categoriesError: null,
    };
  },

  //mutations czyli setters
  mutations: {
    SET_CATEGORIES_LIST(state, newCategories) {
      state.categoriesList = newCategories;
    },
    SET_CATEGORIES_ERROR(state, error) {
      state.categoriesError = error;
    },
    SET_CATEGORIES_LOADING(state, loading) {
      state.categoriesLoading = loading;
    },
  },

  //getters
  getters: {
    GET_CATEGORIES_LIST(state) {
      return state.categoriesList;
    },
    GET_CATEGORIES_ERROR(state) {
      return state.categoriesError;
    },
    GET_CATEGORIES_LOADING(state) {
      return state.categoriesLoading;
    },
  },

  // tu zapytania do serwera z pomocą naszego api
  actions: {
    async FETCH_CATEGORIES({ state, commit }) {
      commit("SET_CATEGORIES_LOADING", true);
      commit("SET_CATEGORIES_ERROR", null);

      try {
        const categories = await getCategories();
        commit("SET_CATEGORIES_LIST", categories);
      } catch (error) {
        commit("SET_CATEGORIES_ERROR", error.message);
      } finally {
        commit("SET_CATEGORIES_LOADING", false);
      }
    },
  },
};

export default categories;
