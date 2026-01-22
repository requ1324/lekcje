<template>
  <div class="container2">
    <h1>Parent Component</h1>
    <button @click="add">+</button>
    <button @click="minus">-</button>
    {{ count }}
    <div class="divContainer">
      <div v-for="c in count" class="ball"></div>
    </div>
    <Child></Child>
    <Child></Child>
  </div>
</template>

<script>
import Child from "./components/Child.vue";

export default {
  data() {},
  methods: {
    add() {
      this.$store.commit("plus");
      console.log(this.$store.state.c);
    },
    minus() {
      this.$store.commit("minus");
    },
  },
  computed: {
    count() {
      return this.$store.state.c;
    },
  },
  components: {
    Child,
  },
};
</script>

<style scoped>
.container2 {
  border: 2px dotted blue;
  padding: 20px;
}
button {
  background: black;
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.divContainer {
  display: flex;
}

.ball {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: blue;
}
</style>
