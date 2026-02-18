<template>
  <SelectYear></SelectYear>
  <SelectColor></SelectColor>
  <SelectName></SelectName>
  <div class="container">
    <div class="bad">
      <Car
        v-for="car in badCars"
        :color="car.hex_color"
        :id="car.id"
        :name="car.car_name"
        :damaged="car.damaged"
        :year="car.car_year"
      />
    </div>
    <div class="good">
      <Car
        v-for="car in goodCars"
        :color="car.hex_color"
        :id="car.id"
        :name="car.car_name"
        :damaged="car.damaged"
        :year="car.car_year"
      />
    </div>
  </div>
</template>

<script>
import Car from "./components/Car.vue";
import SelectYear from "./components/SelectYear.vue";
import SelectColor from "./components/SelectColor.vue";
import SelectName from "./components/SelectName.vue";

export default {
  data() {},
  methods: {},
  computed: {
    cars() {
      return this.$store.getters.GET_CARS;
    },
    goodCars() {
      return this.cars.filter((car) => !car.damaged);
    },
    badCars() {
      return this.cars.filter((car) => car.damaged);
    },
  },
  mounted() {
    this.$store.dispatch("GET_CARS_ACTION");
  },
  components: {
    Car,
    SelectColor,
    SelectName,
    SelectYear,
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.bad {
  background: rgb(195, 54, 54);
  display: flex;
  justify-content: center;
  align-items: center;
}
.good {
  background: rgb(47, 169, 47);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
