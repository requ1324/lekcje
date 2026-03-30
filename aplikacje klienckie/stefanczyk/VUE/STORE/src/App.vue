<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
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
    Footer,
  },
};
</script>

<template>
  <div class="app-shell">
    <Header />
    <main class="app-main">
      <RouterView />
      <Footer />
    </main>
  </div>
</template>

<style></style>
 
