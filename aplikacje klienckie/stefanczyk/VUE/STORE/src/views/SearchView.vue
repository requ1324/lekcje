<script>
import Header from "../components/Header.vue";
import ProductTile from "../components/ProductTile.vue";
import AppLoader from "../components/AppLoader.vue";
export default {
  data() {
    return {
      name: "",
    };
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.$store.dispatch("FETCH_PRODUCTS", {
        name: this.name.trim(),
      });
    },
  },
  computed: {
    products() {
      const list = this.$store.getters.GET_PRODUCTS_LIST;
      return list;
    },
    productsLoading() {
      return this.$store.getters.GET_PRODUCTS_LOADING;
    },
    showLoader() {
      return this.productsLoading && !this.products.length;
    },
  },
  mounted() {
    this.$store.dispatch("FETCH_PRODUCTS");
  },
  components: {
    ProductTile,
    Header,
    AppLoader,
  },
};
</script>

<template>
  <form @submit="onSubmit">
    <input v-model="name" placeholder="Szukaj produktu" />
    <button type="submit">Search</button>
  </form>
  <AppLoader v-if="showLoader" />
  <div class="product-container">
    <ProductTile
      v-for="product in products"
      :product="product"
      :key="product.id"
    />
  </div>
</template>

<style scoped>
.product-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
</style>
