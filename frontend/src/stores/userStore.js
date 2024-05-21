import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
  }),
  actions: {
    async register(userData) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/register",
          userData
        );
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    },
    async login(credentials) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          credentials
        );
        this.token = response.data.token;
        this.user = response.data.user;
        this.isAuthenticated = true;
        localStorage.setItem("token", response.data.token); // Token'ı localStorage'a kaydediyoruz.
      } catch (error) {
        console.error(error);
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
});
