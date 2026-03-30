<script>
import Header from "../components/Header.vue";
import PromotionTile from "../components/PromotionTile.vue";
import AppLoader from "../components/AppLoader.vue";
export default {
  data() {
    return {};
  },
  methods: {},
  computed: {
    promotionsList() {
      const list = this.$store.getters.GET_PROMOTIONS_LIST;
      if (!list) return [];
      console.log("list:", list);
      return Array.isArray(list) ? list : list.promotions;
    },
    promotionsLoading() {
      return this.$store.getters.GET_PROMOTIONS_LOADING;
    },
  },
  mounted() {
    this.$store.dispatch("FETCH_PROMOTIONS");
  },
  components: {
    PromotionTile,
    Header,
    AppLoader,
  },
};
</script>

<template>
  <section class="home-view">
    <div class="page-hero">
      <h1 class="page-title">Najnowsze promocje</h1>
      <p class="page-subtitle">
        Sprawdź aktualne okazje i wybierz coś dla siebie.
      </p>
    </div>

    <div class="sale-container">
      <RouterLink
        v-for="promotion in promotionsList"
        :to="`/promotion/${promotion.id}`"
        :key="promotion.id"
        class="promotion-link"
      >
        <PromotionTile v-bind:promotion="promotion" />
      </RouterLink>
    </div>

    <div
      v-if="!promotionsLoading && !promotionsList.length"
      class="card empty-state"
    >
      Brak aktywnych promocji.
    </div>

    <AppLoader v-show="promotionsLoading" />
  </section>
</template>

<style scoped></style>
