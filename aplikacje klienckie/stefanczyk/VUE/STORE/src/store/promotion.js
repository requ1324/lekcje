import { getPromotion, getProduct } from "../api/index.js";
const promotion = {
  //state
  state() {
    return {
      promotionObject: {},
      promotionLoading: false,
      promotionError: null,
    };
  },

  //mutations czyli setters
  mutations: {
    SET_PROMOTION_OBJECT(state, newPromotionObject) {
      state.promotionObject = newPromotionObject;
    },
    SET_PROMOTION_ERROR(state, error) {
      state.promotionError = error;
    },
    SET_PROMOTION_LOADING(state, loading) {
      state.promotionLoading = loading;
    },
  },

  //getters
  getters: {
    GET_PROMOTION_OBJECT(state) {
      return state.promotionObject;
    },
    GET_PROMOTION_ERROR(state) {
      return state.promotionError;
    },
    GET_PROMOTION_LOADING(state) {
      return state.promotionLoading;
    },
  },

  // tu zapytania do serwera z pomocą naszego api
  actions: {
    async FETCH_PROMOTION({ state, commit, getters }, promotionId) {
      commit("SET_PROMOTION_LOADING", true);
      commit("SET_PROMOTION_ERROR", null);
      try {
        const promotion = await getPromotion(promotionId);

        const products = await Promise.all(
          promotion.items.map(async (item) => {
            const product = await getProduct(item);
            return product;
          }),
        );
        let promotionObject = {
          ...promotion,
          promotionProducts: products,
        };
        commit("SET_PROMOTION_OBJECT", promotionObject);
      } catch (error) {
        commit("SET_PROMOTION_ERROR", error.message);
      } finally {
        commit("SET_PROMOTION_LOADING", false);
      }
    },
  },
};

export default promotion;
