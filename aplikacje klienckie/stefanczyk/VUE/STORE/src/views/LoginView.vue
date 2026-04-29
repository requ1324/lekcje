<script>
import { registerUser } from "../api/index.js";
import AppLoader from "../components/AppLoader.vue";

export default {
  data() {
    return {
      logged: false,
      error: "",
      email: "",
      password: "",
      exists: false,
      loading: false,
    };
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.loading = true;
      this.error = "";

      /* po przejściu walidacji (zachowany format emaila - regex)
      uruchamiamy funkcję ze store User
      jeśli otrzymamy z serwera email zalogowanego usera
      to znaczy, że można wykonywać działania na kliencie
      np przekierować się na inny adres
      logika pozostałych komunikatów musi być oparta o serwer
      */

      this.$store
        .dispatch("LOGIN_USER", { email: this.email, password: this.password })
        .then(() => {
          if (this.email) this.logged = true;
          else this.logged = false;

          this.$router.push("/");
        })
        .catch(() => {
          this.error = "niepoprawne dane logowania";
          this.logged = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  computed: {},
  mounted() {},
  components: {
    AppLoader,
  },
};
</script>

<template>
  <section class="auth-page">
    <AppLoader v-show="loading" />
    <form v-show="!loading" class="card auth-card" @submit="onSubmit">
      <h1 class="auth-title">Zaloguj się</h1>
      <div v-show="error" class="error">{{ error }}</div>

      <div class="field">
        <label for="email">Email:</label>
        <input v-model="email" type="email" id="email" name="email" />
      </div>

      <div class="field">
        <label for="password">Password:</label>
        <input
          v-model="password"
          type="password"
          id="password"
          name="password"
        />
      </div>

      <button class="btn" type="submit">Login</button>
    </form>
  </section>
</template>

<style scoped></style>
