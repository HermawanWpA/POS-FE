import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '../services/authService';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);

  const isAuthenticated = computed(() => !!token.value);

  async function login(credentials) {
    try {
      const response = await authService.login(credentials);
      // Sesuaikan payload response dari Echo backend Anda
      const responseData = response.data.data; 
      
      token.value = responseData.token;
      user.value = responseData.user || { username: credentials.username };

      localStorage.setItem('token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Terjadi kesalahan saat login';
    }
  }

  async function register(userData) {
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mendaftarkan akun baru';
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return { token, user, isAuthenticated, login, register, logout };
});