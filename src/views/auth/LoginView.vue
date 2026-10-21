<template>
    <div class="auth-container">
        <div class="login-box">
            <h2>Login AdminHub</h2>
            <p class="subtitle">Silakan masuk menggunakan akun petugas</p>

            <div v-if="successMessage" class="alert success-alert">
                <i class='bx bx-check-circle'></i> {{ successMessage }}
            </div>
            <div v-if="errorMessage" class="alert error-alert">
                <i class='bx bx-error-circle'></i> {{ errorMessage }}
            </div>

            <form @submit.prevent="handleLogin">
                <div class="user-box">
                    <input type="text" v-model="username" required placeholder=" " />
                    <label>Username</label>
                </div>

                <div class="user-box">
                    <input type="password" v-model="password" required placeholder=" " />
                    <label>Password</label>
                </div>

                <button type="submit" :disabled="isLoading">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    {{ isLoading ? 'MENGPROSES...' : 'MASUK SEKARANG' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../../services/apiClient'; // Sesuaikan path client axios Anda
import { useAuthStore } from '@/stores/auth'; // Pastikan store diimport

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const successMessage = ref('');
const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

// Bersihkan pesan eror bawaan router saat halaman login pertama kali dibuka
onMounted(() => {
    if (route.query.logout === 'success') {
        successMessage.value = 'Berhasil! Anda telah keluar dari sistem.';
    }
    errorMessage.value = '';
});


const handleLogin = async () => {
    errorMessage.value = '';

    if (!username.value || !password.value) {
        errorMessage.value = 'Username dan Password wajib diisi!';
        return;
    }

    try {
        isLoading.value = true;

        // Kirim request login ke Go Echo backend
        const response = await api.post('/auth/login', {
            username: username.value,
            password: password.value
        });

        // DEBUG: Cetak isi asli dari server ke console browser (Tekan F12 untuk melihatnya)
        console.log('Respon Asli Server:', response.data);

        // ====================================================================
        // PERBAIKAN: DETEKSI TOKEN SECARA FLEKSIBEL
        // ====================================================================
        // Mencari token baik di response.data.token ATAU di dalam response.data.data.token
        const token = response.data?.token || response.data?.data?.token;

        // Mencari role di response.data.role, response.data.user.role, atau response.data.data.user.role
        const roleUser = response.data?.role ||
            response.data?.user?.role ||
            response.data?.data?.user?.role ||
            response.data?.data?.role ||
            'kasir'; // Default fallback ke kasir jika tidak ketemu

        if (token) {
            // Simpan token & role hasil ekstraksi ke localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', roleUser); //

            const usernameToSave = response.data?.username || username.value;

            localStorage.setItem('username', usernameToSave);

            // Sinkronisasikan ke Pinia Store jika Anda menggunakannya
            if (authStore && typeof authStore.setToken === 'function') {
                authStore.setToken(token);
            }

            // Bersihkan pesan eror lama sebelum pindah halaman
            errorMessage.value = '';

            // Pindah aman ke halaman dashboard utama setelah sukses login
            router.push('/dashboard');
        } else {
            // Jika token tetap tidak ditemukan setelah dicari di berbagai properti
            errorMessage.value = 'Gagal login: Properti token tidak ditemukan dalam respon JSON server.';
            console.error('Struktur JSON salah. Pastikan backend mengirim properti "token" atau "data.token"');
        }

    } catch (error) {
        console.error('Eror Login:', error);
        // Menampilkan pesan eror asli dari backend jika akun salah / bad request
        errorMessage.value = error.response?.data?.message || 'Gagal terhubung ke server backend.';
    } finally {
        isLoading.value = false;
    }
};
</script>
<style scoped>
/* Gunakan kembali style boks neon gelap yang Anda pakai di halaman register */
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
    background: rgba(0, 0, 0, .5);
    box-sizing: border-box;
    box-shadow: 0 15px 25px rgba(0, 0, 0, .6);
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

.login-box .user-box input:focus~label,
.login-box .user-box input:not(:placeholder-shown)~label {
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
    box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4;
}

button:disabled {
    color: #555;
    background: rgba(255, 255, 255, 0.05);
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
    background: rgba(40, 167, 69, 0.2);
    color: #28a745;
    border: 1px solid #28a745;
}
</style>