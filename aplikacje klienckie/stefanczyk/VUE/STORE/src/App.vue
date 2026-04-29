<script>
import Header from "./components/Header.vue";

import HomeView from "./views/HomeView.vue";

export default {
  data() {},
  methods: {},
  computed: {},
  mounted() {},
  beforeCreate() {
    this.$store.dispatch("FETCH_CURRENT_USER");
  },
  components: {
    HomeView,
    Header,
  },
};
</script>

<template>
  <div class="app-shell">
    <Header />
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style></style>
 
