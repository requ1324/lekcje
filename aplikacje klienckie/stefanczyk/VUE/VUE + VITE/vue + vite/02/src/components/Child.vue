<script>
import GrandChild from "./GrandChild.vue";

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
    childCount() {
      return this.$store.state.c;
    },
  },
  components: {
    GrandChild,
  },
};
</script>

<template>
  <div class="container">
    <h1>child component</h1>
    {{ childCount }}
    <button @click="add">+</button>
    <button @click="minus">-</button>
    <div class="divContainer">
      <div v-for="c in Math.floor(childCount / 2)" class="ball"></div>
    </div>
    <GrandChild></GrandChild>
    <GrandChild></GrandChild>
  </div>
</template>

<style scoped>
.container {
  border: 2px dotted red;
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
  background: red;
}
</style>
