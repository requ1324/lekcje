<template>
  <button @click="add">dodaj</button>
  {{ count }}
</template>

<script>
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
};
</script>

<style scoped></style>
