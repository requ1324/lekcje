<script>
import { registerUser } from "../api/index.js";
import AppLoader from "../components/AppLoader.vue";

export default {
  data() {
    return {
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
      const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      this.loading = true;
      if (this.password.length < 3) {
        this.error = "hasło musi mieć min 3 znaki";
        this.loading = false;
      } else if (!this.email.match(regex)) {
        this.error = "Niepoprawny format emaila";
        this.loading = false;
        return;
      } else {
        this.error = "";

        // do funkcji przekazujemy obiekt z danymi usera

        registerUser({ email: this.email, password: this.password })
          .then((data) => {
            console.log(data);
            if (data.status == "registered") {
              console.log("Zarejestrowano");
              this.error = "Użytkownik zarejestrowany!";
            }
          })
          .catch((err) => {
            console.error("Błąd zapytania:", err);
            this.registered = false;
            this.exists = false;
            this.error =
              err.response?.data?.status === "email already exists"
                ? "Podany email już istnieje!"
                : "user nie zarejestrowany";
          })
          .finally(() => {
            this.loading = false;
          });
      }
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
      <h1 class="auth-title">Utwórz konto</h1>
      <div
        v-show="error"
        class="error"
        :class="{ 'status-success': error === 'Użytkownik zarejestrowany!' }"
      >
        {{ error }}
      </div>

      <div class="field">
        <label for="email">Email:</label>
        <input v-model="email" type="text" id="email" name="email" />
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

      <div class="field">
        <label for="confirmPass">Confirm Password: </label>
        <input type="password" id="confirmPass" name="confirmPass" />
      </div>

      <button class="btn" type="submit">Register</button>
    </form>
  </section>
</template>

<style scoped></style>
