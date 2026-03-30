<template>
  <article class="card product-tile">
    <img class="product-image" :src="'/' + product.image" :alt="product.name" />
    <div class="product-body">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-price">{{ product.price }}</p>
    </div>
  </article>
</template>

<script>
export default {
  name: "ProductTile",
  props: { product: { type: Object, required: true } },
  computed: {},
};
</script>

<style scoped>
.product-tile {
  overflow: hidden;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.product-tile:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.16);
}

.product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
  border-bottom: 1px solid #e2e8f0;
}

.product-body {
  padding: 0.95rem;
}

.product-name {
  font-size: 0.98rem;
  margin-bottom: 0.35rem;
  color: #0f172a;
}

.product-price {
  font-size: 1.02rem;
  font-weight: 700;
  color: #4338ca;
}
</style>
