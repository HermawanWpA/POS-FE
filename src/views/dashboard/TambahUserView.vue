<template>
    <div class="auth-container">
        <div class="login-box">
            <h2>Tambah Akun</h2>
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

                <div class="user-box dropdown-box">
                    <select v-model="form.role" required>
                        <option value="" disabled selected hidden></option>
                        <option value="admin">Admin / Pemilik</option>
                        <option value="kasir">Kasir</option>
                    </select>
                    <label class="label-select">Hak Akses (Role)</label>
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
                Kembali ke Dashboard
                <router-link to="/dashboard" class="a2">Dashboard</router-link>
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

const form = ref({
    nama_user: '',
    username: '',
    role: 'kasir', // Default disamakan dengan setelan database
    password: '',
    password_confirmation: ''
});

const handleRegister = async () => {
    errorMessage.value = '';
    successMessage.value = '';

    if (form.value.password !== form.value.password_confirmation) {
        errorMessage.value = 'Konfirmasi password tidak cocok!';
        return;
    }

    try {
        isLoading.value = true;

        /* 💡 TIPS JIKA TETAP 404 NOT FOUND:
          Jika backend Go Echo Anda menggunakan group routing, ganti '/register' 
          di bawah ini menjadi '/api/register' atau '/auth/register' sesuai main.go Anda.
        */
        const response = await api.post('/auth/register', {
            nama_user: form.value.nama_user,
            username: form.value.username,
            role: form.value.role,
            password: form.value.password
        });

        successMessage.value = `Akun ${form.value.nama_user} (${form.value.role}) berhasil dibuat!`;

        // Reset form input
        form.value = { nama_user: '', username: '', role: 'kasir', password: '', password_confirmation: '' };

        // Alihkan halaman kembali ke Dashboard utama setelah sukses
        setTimeout(() => {
            router.push('/dashboard/tambah-user');
        }, 2000);

    } catch (error) {
        console.error('Gagal Register:', error);
        
        // Menangkap error spesifik jika endpoint tidak ditemukan di server
        if (error.response?.status === 404) {
            errorMessage.value = 'Error 404: Endpoint /register tidak ditemukan di server API. Periksa rute backend Anda.';
        } else {
            errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan sistem saat mendaftar.';
        }
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
/* Sisi CSS tetap dipertahankan sama seperti style boks neon gelap milik Anda */
.auth-container {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    background: linear-gradient(#eee, #243b55);
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

.login-box .user-box select {
    width: 100%;
    padding: 10px 0;
    font-size: 16px;
    color: #fff;
    margin-bottom: 30px;
    border: none;
    border-bottom: 1px solid #fff;
    outline: none;
    background: transparent;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}

.login-box .user-box select option {
    background: #243b55;
    color: #fff;
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

.login-box .user-box select:focus~.label-select,
.login-box .user-box select:valid~.label-select {
    top: -20px;
    left: 0;
    color: #03e9f4;
    font-size: 12px;
}

.dropdown-box::after {
    content: '▼';
    font-size: 10px;
    color: #fff;
    position: absolute;
    right: 5px;
    top: 15px;
    pointer-events: none;
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
    background: rgba(254, 254, 254, 0.2);
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