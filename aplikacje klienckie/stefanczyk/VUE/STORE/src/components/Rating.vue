<template>
  <div class="rating-wrap">
    <img
      v-for="star in filledStars"
      :key="`filled-${star}`"
      class="rating-star"
      :src="starImageUrl"
      alt="filled star"
    />
    <img
      v-for="star in emptyStars"
      :key="`empty-${star}`"
      class="rating-star"
      :src="borderStarImageUrl"
      alt="empty star"
    />
    <span>({{ ratesNumber }})</span>
  </div>
</template>

<script>
export default {
  name: "Rating",
  props: ["rate", "ratesNumber"],
  computed: {
    parsedRate() {
      const num = Number(this.rate);
      if (Number.isNaN(num)) return 0;
      return num;
    },
    roundedRate() {
      return Math.round(this.parsedRate);
    },
    filledStars() {
      return this.roundedRate;
    },
    emptyStars() {
      return 5 - this.roundedRate;
    },
    starImageUrl() {
      return new URL("../assets/star-solid.png", import.meta.url).href;
    },
    borderStarImageUrl() {
      return new URL("../assets/star-regular.png", import.meta.url).href;
    },
  },
};
</script>

<style scoped>
.rating-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.rating-star {
  width: 14px;
  height: 14px;
  object-fit: contain;
}
</style>
