<script>
export default {
  data() {},
  methods: {},
  computed: {},
  mounted() {},
  components: {},
  props: ["currentPage", "totalItems", "limit"],
};
</script>

<template>
  <router-link :to="{ query: { ...$route.query, _page: currentPage + 1 } }">
    Następna
  </router-link>
</template>

<style scoped></style>
