<template>
  <div v-for="post in posts">
    {{ post.title }}
  </div>
</template>

<script>
export default {
  data() {},
  methods: {},
  computed: {
    posts() {
      return this.$store.getters.GET_POSTS;
    },
  },
  mounted() {
    this.$store.dispatch("GET_POSTS_ACTION");
  },
};
</script>

<style scoped></style>
