<template>
  <div :style="contStyle">
    <h3>{{ this.promotion.header }}</h3>
    <h2>{{ this.promotion.description }}</h2>
  </div>
</template>

<script>
export default {
  name: "PromotionTile",
  props: { promotion: { type: Object, required: true } },
  computed: {
    contStyle() {
      const { image } = this.promotion;
      let imageUrl;

      try {
        imageUrl = `/src/assets/${image}`;
      } catch (e) {
        console.log(e);
      }

      return {
        background: `url(${imageUrl})`,
      };
    },
  },
};
</script>

<style scoped></style>
