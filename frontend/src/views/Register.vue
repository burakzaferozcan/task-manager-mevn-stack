<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input v-model="first_name" placeholder="First Name" />
      <input v-model="last_name" placeholder="Last Name" />
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import { useUserStore } from "../stores/userStore";

export default {
  data() {
    return {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    };
  },
  methods: {
    async register() {
      const userStore = useUserStore();
      await userStore.register({
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        password: this.password,
      });
    },
  },
};
</script>
