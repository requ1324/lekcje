<script>
export default {
  data() {},
  methods: {
    selectByColor(e) {
      this.$store.commit("FILTER_BY_COLOR", e.target.value);
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
  <select @change="selectByColor" name="colorSelect" id="select">
    <option v-for="car in allCars" :value="car.hex_color">
      {{ car.hex_color }}
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
