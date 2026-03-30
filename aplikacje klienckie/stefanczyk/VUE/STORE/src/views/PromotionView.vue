<script>
import AppLoader from "../components/AppLoader.vue";
import ProductTile from "../components/ProductTile.vue";
export default {
  data() {
    return {};
  },
  methods: {},
  computed: {
    promotionObject() {
      console.log("promotionObject:", this.$store.getters.GET_PROMOTION_OBJECT);
      return this.$store.getters.GET_PROMOTION_OBJECT;
    },
    promotionProducts() {
      return this.promotionObject?.promotionProducts || [];
    },
    promotionError() {
      return this.$store.getters.GET_PROMOTION_ERROR;
    },
    promotionLoading() {
      return this.$store.getters.GET_PROMOTION_LOADING;
    },
  },
  mounted() {},
  created() {
    this.$store.dispatch("FETCH_PROMOTION", this.$route.params.id);
  },
  components: {
    AppLoader,
    ProductTile,
  },
};
</script>

<template>
  <section>
    <div class="card content-card promotion-head">
      <h1 class="page-title">{{ promotionObject?.header || "Promocja" }}</h1>
      <p class="page-subtitle">
        {{
          promotionObject?.description ||
          "Szczegóły promocji i dostępne produkty."
        }}
      </p>
    </div>

    <div class="products-grid">
      <ProductTile
        v-for="product in promotionProducts"
        :key="product.id"
        :product="product"
      />
    </div>

    <div v-if="promotionError" class="error">{{ promotionError }}</div>
    <AppLoader v-show="promotionLoading" />
  </section>
</template>

<style scoped></style>
  
