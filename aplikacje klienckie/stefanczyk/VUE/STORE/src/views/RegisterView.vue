<script>
import { registerUser } from "../api/index.js";
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

      if (this.password.length < 3) {
        this.error = "hasło musi mieć min 3 znaki";
      } else {
        this.error = "";

        // do funkcji przekazujemy obiekt z danymi usera

        registerUser({ email: this.email, password: this.password })
          .then((data) => {
            /* tu kluczowa sprawa, do zsynchronizowania z odpowiedzią serwera:
 na jej podstawie decydujemy czy formularz ma pozostać czy zniknąć
 bo user istnieje już lub nie
 this.exists = true;
 this.registered = true;
          
 */ console.log(data);
            if (data.status == "registered") {
              console.log("Zarejestrowano");
            }
          })
          .catch((err) => {
            console.error("Błąd zapytania:", err);
            // Jeżeli korzystasz z Axios, dane serwera znajdują się w err.response.data
            // w wypadku błędu zakładamy, że user się nie zarejestrował
            this.registered = false;
            this.exists = false;
            this.error =
              err.response?.data?.status === "email already exists"
                ? "Podany email już istnieje!"
                : "user nie zarejestrowany";
          })
          .finally(() => {
            // w obu wypadkach zatrzymujemy loader
            this.loading = false;
          });
      }
    },
    computed: {},
    mounted() {},
    components: {},
  },
};
</script>

<template>
  <div class="register-view">
    <form @submit="onSubmit">
      <div v-show="error" class="error">{{ error }}</div>
      <div class="box">
        <label for="email">Email:</label>
        <input v-model="email" type="email" id="email" name="email" />
      </div>
      <div class="box">
        <label for="password">Password:</label>
        <input
          v-model="password"
          type="password"
          id="password"
          name="password"
        />
      </div>
      <div class="box">
        <label for="confirmPass">Confirm Password: </label>
        <input type="password" id="confirmPass" name="confirmPass" />
      </div>

      <button class="register-btn" type="submit">Register</button>
    </form>
  </div>
</template>

<style scoped>
.register-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vh;
}

form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #535bf2;
  padding: 2rem;
  border-radius: 10px;
  gap: 1rem;
  box-shadow: 0 0 10px 2px #535bf2;
}

.box {
  display: flex;
  flex-direction: column;
  align-items: start;
}

input {
  background: white;
  outline: none;
  border: none;
  border-radius: 5px;
  color: black;
  padding: 0.5rem;
  width: 200px;
}

label {
  font-weight: 700;
}

.register-btn {
  background: #ffffff;
  color: black;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 700;
  border: 2px solid transparent;
  transition: 0.3s;
}

.register-btn:hover {
  background: #535bf2;
  color: white;
  border: 2px solid #ffffff;
  transition: 0.3s;
}
</style>
