<script>
export default {
  data() {},
  methods: {
    selectByYear(e) {
      this.$store.commit("FILTER_BY_YEAR", e.target.value);
    },
  },
  computed: {
    cars() {
      return this.$store.state.filteredCars;
    },
    allCars() {
      return this.$store.state.cars;
    },
  },
  mounted() {},
};
</script>

<template>
  <select @change="selectByYear" name="yearSelect" id="select">
    <option v-for="car in allCars" :value="car.car_year">
      {{ car.car_year }}
    </option>
  </select>
</template>

<style>
#select {
  width: 150px;
  height: 40px;
  font-size: 1rem;
  background: rgb(135, 135, 155);
  margin: 20px;
}
</style>
