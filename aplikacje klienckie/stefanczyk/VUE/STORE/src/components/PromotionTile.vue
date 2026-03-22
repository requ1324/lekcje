<template>
  <article :style="contStyle" class="promotion-card" :class="badgeClass">
    <div class="promotion-overlay"></div>
    <div class="promotion-content">
      <span class="promotion-badge">{{ badgeText }}</span>
      <h3>{{ this.promotion.header }}</h3>
      <p>{{ this.promotion.description }}</p>
    </div>
  </article>
</template>

<script>
export default {
  name: "PromotionTile",
  props: { promotion: { type: Object, required: true } },
  computed: {
    contStyle() {
      const { image, color } = this.promotion;
      let imageUrl;

      try {
        imageUrl = `/src/assets/${image}`;
      } catch (e) {
        console.log(e);
      }

      return {
        backgroundImage: `linear-gradient(135deg, ${color || "#ffffff"}CC, #535bf2), url(${imageUrl})`,
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
  position: relative;
  overflow: hidden;
  min-height: 150px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.22);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  isolation: isolate;
}

.promotion-card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.3);
}

.promotion-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0.08),
    rgba(15, 23, 42, 0.72)
  );
  z-index: -1;
}

.promotion-content {
  color: #fff;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 85%;
}

.promotion-content h3 {
  margin: 0;
  font-size: 0.95rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.88;
}

.promotion-content p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.88);
}

.promotion-badge {
  align-self: flex-start;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  backdrop-filter: blur(8px);
}

.is-winter .promotion-badge {
  background: linear-gradient(135deg, #ffffff, #535bf2);
  color: #1d4ed8;
}

.is-hot .promotion-badge {
  background: linear-gradient(135deg, #fff7ed, #fdba74);
  color: #c2410c;
}

.is-sale .promotion-badge {
  background: linear-gradient(135deg, #ffffff, #535bf2);
  color: #1d4ed8;
}
</style>
