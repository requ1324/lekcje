import { getPromotions } from "../api/index.js";

const promotions = {
  //state
  state() {
    return {
      promotionsList: [],
      promotionsLoading: false,
      promotionsError: null,
    };
  },

  //mutations czyli setters
  mutations: {
    SET_PROMOTIONS_LIST(state, newPromotions) {
      state.promotionsList = newPromotions;
    },
    SET_PROMOTIONS_ERROR(state, error) {
      state.promotionsError = error;
    },
    SET_PROMOTIONS_LOADING(state, loading) {
      state.promotionsLoading = loading;
    },
  },

  //getters
  getters: {
    GET_PROMOTIONS_LIST(state) {
      return state.promotionsList;
    },
    GET_PROMOTIONS_ERROR(state) {
      return state.promotionsError;
    },
    GET_PROMOTIONS_LOADING(state) {
      return state.promotionsLoading;
    },
  },

  // tu zapytania do serwera z pomocą naszego api
  actions: {
    async FETCH_PROMOTIONS({ commit }) {
      commit("SET_PROMOTIONS_LOADING", true);
      commit("SET_PROMOTIONS_ERROR", null);

      try {
        const promotions = await getPromotions();
        commit("SET_PROMOTIONS_LIST", promotions);
      } catch (error) {
        commit("SET_PROMOTIONS_ERROR", error.message);
      } finally {
        commit("SET_PROMOTIONS_LOADING", false);
      }
    },
  },
};

export default promotions;
