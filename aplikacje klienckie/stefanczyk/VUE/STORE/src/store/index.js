import { createStore } from "vuex";

import promotions from "./promotions";
import promotion from "./promotion";

const modules = {
  promotions,
  promotion,
  // kolejne moduły
};

export default createStore({
  modules,
});
