<template>
  <article class="promotion-card" :class="badgeClass">
    <div class="promotion-media" :style="style"></div>
    <div class="promotion-content">
      <span class="promotion-badge">{{ badgeText }}</span>
      <h3>{{ this.promotion.header }}</h3>
      <p>{{ this.promotion.description }}</p>
      <span class="promotion-cta">Zobacz promocję</span>
    </div>
  </article>
</template>

<script>
export default {
  name: "PromotionTile",
  props: { promotion: { type: Object, required: true } },
  computed: {
    style() {
      const { image, color } = this.promotion;
      const imageUrl = image ? `/src/assets/${image}` : "";

      return {
        backgroundImage: `linear-gradient(135deg, ${color || "#e0e7ff"}44, rgba(99, 102, 241, 0.06)), url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    },
    badgeText() {
      const header = this.promotion.header.toLowerCase();

      if (header.includes("winter")) return "WINTER";
      if (header.includes("hot")) return "HOT";

      return "SALE";
    },
    badgeClass() {
      return `is-${this.badgeText.toLowerCase()}`;
    },
  },
};
</script>

<style scoped>
.promotion-card {
  overflow: hidden;
  min-height: 260px;
  height: 320px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.1);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.promotion-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 38px rgba(15, 23, 42, 0.14);
}

.promotion-media {
  height: 140px;
  border-bottom: 1px solid #e2e8f0;
}

.promotion-content {
  color: #0f172a;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 1rem;
}

.promotion-content h3 {
  font-size: 1rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #0f172a;
}

.promotion-content p {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #64748b;
  display: -webkit-box;

  -webkit-box-orient: vertical;
  overflow: hidden;
}

.promotion-badge {
  align-self: flex-start;
  padding: 0.34rem 0.72rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.is-winter .promotion-badge {
  background: #dbeafe;
  color: #1e40af;
}

.is-hot .promotion-badge {
  background: #ffedd5;
  color: #c2410c;
}

.is-sale .promotion-badge {
  background: #e0e7ff;
  color: #3730a3;
}

.promotion-cta {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #4f46e5;
}
</style>
