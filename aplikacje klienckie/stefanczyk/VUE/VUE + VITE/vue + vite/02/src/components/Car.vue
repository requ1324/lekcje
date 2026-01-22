<template>
  <div class="box">
    <div class="color" :style="{ background: color }">kolor auta</div>
    <div :style="{ background: damaged ? 'red' : 'green' }" class="damaged">
      {{ damaged ? "uszkodzony" : "nieuszkodzony" }}
    </div>
    <img :src="img" alt="" /> <br />
    <span>id : {{ id }}</span> <br />
    <span>name : {{ name }}</span> <br />
    <span>year: {{ year }}</span> <br />
  </div>
</template>

<script>
export default {
  data() {},
  methods: {},
  computed: {
    getCars() {
      return this.$store.state.cars;
    },
  },
  props: ["id", "name", "year", "color", "damaged", "img"],
};
</script>

<style scoped>
.box {
  border: 1px solid black;

  margin: 10px;
}

.color {
  padding: 10px;
  font-weight: bold;
}
</style>
