<script>
export default {
  data() {},
  methods: {
    changeDamage(id) {
      this.$store.commit("CHANGE_DAMAGE", id);
    },
  },
  computed: {
    cars() {
      return this.$store.getters.GET_CARS;
    },
  },
  mounted() {},
  props: ["id", "name", "year", "color", "damaged"],
};
</script>

<template>
  <div id="container">
    <div id="color" :style="{ background: color }">color auta</div>
    <h2>id: {{ id }}</h2>
    <span>name: {{ name }}</span>
    <span>year: {{ year }}</span>
    <button @click="changeDamage(id)">
      {{ damaged ? "Napraw Auto" : "Zepsuj Auto" }}
    </button>
  </div>
</template>

<style scoped>
#container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 10px;
  width: 140px;
  padding: 10px;
  border: 3px solid black;
}

#color {
  width: 100%;
  height: 20px;
  color: white;
  text-align: center;
}
</style>
