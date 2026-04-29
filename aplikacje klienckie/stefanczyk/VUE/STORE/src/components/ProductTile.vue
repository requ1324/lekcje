<template>
  <article class="card product-tile">
    <div>
      <img
        v-if="imageLoaded"
        class="product-image"
        :src="productImageUrl"
        :alt="product.name"
      />
      <AppLoader v-if="loading" />
    </div>
    <div class="product-body">
      <h3 class="product-name">{{ product.name }}</h3>
      <Rating :rate="product.rate" :ratesNumber="product.ratesNumber" />
      <p class="product-price">{{ product.price }}$</p>
    </div>
  </article>
</template>

<script>
import AppLoader from "./AppLoader.vue";
import Rating from "./Rating.vue";
export default {
  data() {
    return {
      loading: true,
      imageLoaded: false,
    };
  },
  name: "ProductTile",
  props: { product: { type: Object, required: true } },
  methods: {
    getRandomTime() {
      return Math.floor(Math.random() * 1000) + 500;
    },
  },
  computed: {
    productImageUrl() {
      return new URL(`../assets/${this.product.image}`, import.meta.url).href;
    },
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
      this.imageLoaded = true;
    }, this.getRandomTime());
  },
  components: {
    AppLoader,
    Rating,
  },
};
</script>

<style scoped>
.product-tile {
  margin: 10px;
  overflow: hidden;
  width: 250px;
  height: 240px;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.product-tile:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.16);
}

.product-image {
  width: 250px;
  height: 140px;
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
  margin-bottom: 10px;
}
</style>
