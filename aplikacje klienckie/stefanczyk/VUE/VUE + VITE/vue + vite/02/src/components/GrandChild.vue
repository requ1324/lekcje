<script>
export default {
  methods: {
    add() {
      this.$store.commit("plus");
    },
    minus() {
      this.$store.commit("minus");
    },
  },
  computed: {
    grandchildCount() {
      return this.$store.state.c;
    },
  },
};
</script>

<template>
  <div class="container3">
    <h1>Grandchild component</h1>
    {{ grandchildCount }}
    <button @click="add">+</button>
    <button @click="minus">-</button>
    <div class="divContainer">
      <div v-for="c in Math.floor(grandchildCount / 4)" class="ball"></div>
    </div>
  </div>
</template>

<style scoped>
.container3 {
  border: 2px dotted rgb(0, 255, 21);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.divContainer {
  display: flex;
}

.ball {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: green;
}
</style>
