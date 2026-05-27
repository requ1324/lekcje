<script>
import Header from "../components/Header.vue";
import ProductTile from "../components/ProductTile.vue";
import AppLoader from "../components/AppLoader.vue";
export default {
  data() {
    return {
      name: "",
      category: "",
      sort: "",
      sortOptions: [
        { label: "Name asc", value: "name_asc" },
        { label: "Name desc", value: "name_desc" },
        { label: "Price asc", value: "price_asc" },
        { label: "Price desc", value: "price_desc" },
      ],
    };
  },
  methods: {
    onSubmit(e) {
      const options = {
        name: this.name.trim(),
        category: this.category,
        _sort: this.sort,
      };
      console.log(this.name, this.category, this.sort);
      e.preventDefault();
      this.$store.dispatch("FETCH_PRODUCTS", options);
    },
  },
  computed: {
    categories() {
      const list = this.$store.getters.GET_CATEGORIES_LIST;
      console.log("Kategorie" + list);
      return list;
    },
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
  created() {
    this.$store.dispatch("FETCH_CATEGORIES");
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
    <select v-model="category">
      <option v-for="category in categories" :value="category">
        {{ category }}
      </option>
    </select>
    <select v-model="sort">
      <option v-for="option in sortOptions" :value="option.value">
        {{ option.label }}
      </option>
    </select>
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
