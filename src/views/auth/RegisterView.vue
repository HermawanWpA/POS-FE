<template>
  <div class="auth-container">
    <div class="login-box">
      <h2>Register Account</h2>
      <p class="subtitle">Silakan daftar akun petugas kasir baru</p>

      <div v-if="errorMessage" class="alert error-alert">
        <i class='bx bx-error-circle'></i> {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="alert success-alert">
        <i class='bx bx-check-circle'></i> {{ successMessage }}
      </div>

      <form @submit.prevent="handleRegister">
        <div class="user-box">
          <input type="text" v-model="form.nama_user" required placeholder=" " />
          <label>Nama Lengkap (Nama User)</label>
        </div>

        <div class="user-box">
          <input type="text" v-model="form.username" required placeholder=" " />
          <label>Username</label>
        </div>

        <div class="user-box">
          <input type="password" v-model="form.password" required placeholder=" " />
          <label>Password</label>
        </div>

        <div class="user-box">
          <input type="password" v-model="form.password_confirmation" required placeholder=" " />
          <label>Konfirmasi Password</label>
        </div>

        <button type="submit" :disabled="isLoading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          {{ isLoading ? 'MENGIRIM...' : 'DAFTAR SEKARANG' }}
        </button>
      </form>

      <p class="auth-footer">
        Sudah punya akun? 
        <router-link to="/login" class="a2">Login di sini</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/apiClient';

const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// State Form disesuaikan dengan struktur JSON kasir Anda
const form = ref({
  nama_user: '',
  username: '',
  password: '',
  password_confirmation: ''
});

const handleRegister = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  // Validasi kecocokan password sebelum dikirim
  if (form.value.password !== form.value.password_confirmation) {
    errorMessage.value = 'Konfirmasi password tidak cocok!';
    return;
  }

  try {
    isLoading.value = true;
    
    // Tembak API register dengan format snake_case sesuai kebutuhan backend
    const response = await api.post('/auth/register', {
      nama_user: form.value.nama_user,
      username: form.value.username,
      password: form.value.password
    });

    successMessage.value = 'Registrasi berhasil! Mengalihkan ke halaman login...';
    
    // Reset isi input form setelah berhasil
    form.value = { nama_user: '', username: '', password: '', password_confirmation: '' };

    // Jeda 2 detik agar user sempat membaca pesan sukses
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);

  } catch (error) {
    console.error('Gagal Register:', error);
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan sistem saat mendaftar.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Styling menyesuaikan dengan halaman Login box neon gelap Anda */
.auth-container {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background: linear-gradient(#141e30, #243b55);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  width: 400px;
  padding: 40px;
  background: rgba(0,0,0,.5);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0,0,0,.6);
  border-radius: 10px;
}

.login-box h2 {
  margin: 0 0 10px;
  padding: 0;
  color: #fff;
  text-align: center;
}

.subtitle {
  color: #888;
  text-align: center;
  font-size: 14px;
  margin-bottom: 30px;
}

.login-box .user-box {
  position: relative;
}

.login-box .user-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}
.login-box .user-box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: .5s;
}

.login-box .user-box input:focus ~ label,
.login-box .user-box input:not(:placeholder-shown) ~ label {
  top: -20px;
  left: 0;
  color: #03e9f4;
  font-size: 12px;
}

button {
  background: transparent;
  border: none;
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #03e9f4;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: .5s;
  margin-top: 10px;
  letter-spacing: 4px;
  width: 100%;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background: #03e9f4;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #03e9f4,
              0 0 25px #03e9f4,
              0 0 50px #03e9f4,
              0 0 100px #03e9f4;
}

button:disabled {
  color: #555;
  background: rgba(255,255,255,0.05);
  box-shadow: none;
  cursor: not-allowed;
}

.alert {
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.error-alert {
  background: rgba(255, 74, 74, 0.2);
  color: #ff4a4a;
  border: 1px solid #ff4a4a;
}
.success-alert {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  border: 1px solid #4caf50;
}

.auth-footer {
  color: #fff;
  font-size: 14px;
  text-align: center;
  margin-top: 25px;
}

.auth-footer .a2 {
  color: #03e9f4;
  text-decoration: none;
}
.auth-footer .a2:hover {
  text-decoration: underline;
}
</style>