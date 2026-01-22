<template>
  <div class="container">
    <Car
      v-for="car in getCars"
      :id="car.id"
      :name="car.car_name"
      :year="car.car_year"
      :color="car.hex_color"
      :img="car.image"
      :damaged="car.damaged"
    >
    </Car>
  </div>
</template>

<script>
import Car from "./components/Car.vue";

export default {
  data() {},
  methods: {},
  computed: {
    getCars() {
      return this.$store.state.cars;
    },
  },
  components: {
    Car,
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
