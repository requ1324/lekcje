import axios from "axios";
import { createStore } from "vuex";

const state = {
  cars: [],
  filteredCars: [],
}; // state

const getters = {
  GET_CARS(state) {
    return state.filteredCars;
  },
}; // getters

const actions = {
  async GET_CARS_ACTION({ commit }) {
    try {
      const response = await axios.get("http://localhost:3000/data");
      console.log("cars: ", response.data);
      commit("SET_CARS", response.data);
    } catch (err) {
      console.log("Error ", err);
    }
  },
}; // actions

const mutations = {
  SET_CARS(state, cars) {
    state.cars = cars;
    state.filteredCars = cars;
  },
  FILTER_BY_YEAR(state, year) {
    state.filteredCars = state.cars.filter((car) => car.car_year == year);
  },
  FILTER_BY_COLOR(state, color) {
    state.filteredCars = state.cars.filter((car) => car.hex_color == color);
  },
  FILTER_BY_NAME(state, name) {
    state.filteredCars = state.cars.filter((car) => car.car_name == name);
  },
  CHANGE_DAMAGE(state, id) {
    const car = state.cars.find((car) => car.id === id);
    if (car) {
      car.damaged = !car.damaged;
    }
  },
}; //mutations

//export store

export default createStore({
  state,
  getters,
  actions,
  mutations,
});
