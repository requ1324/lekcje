import { createStore } from "vuex";

import promotions from "./promotions";
import promotion from "./promotion";
import user from "./user";

const modules = {
  promotions,
  promotion,
  user,
  // kolejne moduły
};

export default createStore({
  modules,
});
