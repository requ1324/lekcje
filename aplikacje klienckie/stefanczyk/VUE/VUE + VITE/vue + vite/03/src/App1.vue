<script>
export default {
  data() {},
  methods: {},
  computed: {
    products() {
      return this.$store.getters.GET_PRODUCTS;
    },
  },
};
</script>

<template>
  <div v-for="product in products">{{ product.title }} {{ product.price }}</div>
</template>

<style scoped></style>
