<script>
import Header from "./components/Header.vue";
import HomeView from "./views/HomeView.vue";

export default {
  data() {},
  methods: {},
  computed: {},
  mounted() {},
  components: {
    HomeView,
    Header,
  },
};
</script>

<template>
  <div>
    <Header />

    <RouterView />
  </div>
</template>

<style></style>
 
