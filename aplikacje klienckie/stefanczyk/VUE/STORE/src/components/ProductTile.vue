<template>
  <RouterLink :to="`/product/${product.id}`">
    <img width="150" heigth="90" :src="'/' + product.image" />
    <div>{{ product.name }}</div>
    <div>{{ product.price }}</div>
  </RouterLink>
</template>

<script>
export default {
  name: "ProductTile",
  props: { product: { type: Object, required: true } },
  computed: {},
};
</script>

<style scoped></style>
