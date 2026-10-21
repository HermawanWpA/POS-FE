import axios from 'axios';
import router from '../router'; // Pastikan mengarah ke file router Anda

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // Sesuaikan URL backend Go Echo Anda
  headers: {
    'Content-Type': 'application/json',
  }
});

// 1. Request Interceptor (Menyisipkan Token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor (Penyebab pesan eror membabi buta)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ambil info URL request yang sedang berjalan
    const requestUrl = error.config?.url || '';

    // KUNCI UTAMA: Jika eror terjadi saat hit endpoint '/login', JANGAN lakukan auto-redirect atau timpa error!
    if (requestUrl.includes('/login')) {
      return Promise.reject(error);
    }

    // Jika eror 401 (Unauthorized) terjadi di rute dashboard/lainnya, baru tendang ke login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      
      // Hanya alihkan jika saat ini tidak sedang berada di halaman login
      if (router.currentRoute.value.name !== 'login') {
        router.push('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;