<script>
export default {
  data() {},
  methods: {
    logout() {
      this.$store.dispatch("LOGOUT_USER").then(() => {
        this.$router.push("/login");
      });
    },
  },
  computed: {
    user() {
      return this.$store.getters.GET_CURRENT_USER;
    },
    userLoading() {
      return this.$store.getters.GET_CURRENT_USER_LOADING;
    },
  },
  components: {},
};
</script>

<template>
  <header class="header-container">
    <div class="header-inner">
      <RouterLink class="brand-link" to="/">Store</RouterLink>

      <nav class="nav-list">
        <RouterLink class="nav-link" to="/">Home</RouterLink>
        <RouterLink class="nav-link" to="/search">Search</RouterLink>
        <RouterLink class="nav-link" to="/about">About</RouterLink>
        <RouterLink class="nav-link" to="/nnn">Not found</RouterLink>
      </nav>

      <div class="user-actions">
        <template v-if="!user">
          <RouterLink class="nav-link" to="/register">Register</RouterLink>
          <RouterLink class="nav-link" to="/login">Login</RouterLink>
        </template>
        <template v-else>
          <span class="nav-link logout-link" @click="logout">Logout</span>
          <span class="user-email">{{ user.email }}</span>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
