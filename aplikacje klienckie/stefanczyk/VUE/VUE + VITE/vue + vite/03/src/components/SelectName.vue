<script>
export default {
  data() {},
  methods: {
    selectByName(e) {
      this.$store.commit("FILTER_BY_NAME", e.target.value);
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
  <select @change="selectByName" name="nameSelect" id="select">
    <option v-for="car in allCars" :value="car.car_name">
      {{ car.car_name }}
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
