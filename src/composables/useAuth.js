// src/composables/useAuth.js
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();
  
  const loading = ref(false);
  const error = ref('');

  async function submitLogin(credentials) {
    loading.value = true;
    error.value = '';
    try {
      // Amankan data: pastikan kita mengirim objek murni { username, password }
      const payload = {
        username: credentials.username,
        password: credentials.password
      };
      
      await authStore.login(payload);
      router.push('/'); 
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  return { loading, error, submitLogin };
}