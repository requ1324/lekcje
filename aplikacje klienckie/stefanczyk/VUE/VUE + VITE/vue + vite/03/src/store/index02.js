import axios from "axios";
import { createStore } from "vuex";

const state = {
  posts: [],
}; // state

const getters = {
  GET_POSTS(state) {
    return state.posts;
  },
}; // getters

const actions = {
  async GET_POSTS_ACTION({ commit }) {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts",
      );
      console.log("response: ", response.data);
      commit("SET_POSTS", response.data);
    } catch (err) {
      console.log("error: ", err);
    }
  },
}; // actions

const mutations = {
  SET_POSTS(state, posts) {
    state.posts = posts;
  },
}; //mutations

//export store

export default createStore({
  state,
  getters,
  actions,
  mutations,
});
