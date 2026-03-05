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
  <div>
    <h1>this is promotion view</h1>
    <ProductTile
      v-for="product in promotionObject.promotionProducts"
      :key="product.id"
      :product="product"
    />
    <AppLoader v-show="promotionLoading" />
  </div>
</template>

<style scoped></style>
  
