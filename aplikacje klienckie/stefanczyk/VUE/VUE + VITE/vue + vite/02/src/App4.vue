<template>
  <div class="container2">
    <h1>Parent Component</h1>
    <button @click="add">dodaj</button>
    {{ count }}
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
</style>
