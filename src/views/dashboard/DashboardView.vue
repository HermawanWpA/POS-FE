<template>
  <main>
    <div class="head-title">
      <div class="left">
        <h1>Dashboard</h1>
        <ul class="breadcrumb">
          <li><a href="#">Dashboard</a></li>
          <li><i class='bx bx-chevron-right'></i></li>
          <li><a class="active" href="#">Home</a></li>
        </ul>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state" style="color: var(--dark); padding: 20px; font-weight: 500;">
      <i class='bx bx-loader-alt bx-spin'></i> Memuat data dari server...
    </div>

    <template v-else>
      <ul class="box-info grid-4-columns">
        <li>
          <i class='bx bxs-car-mechanic' style="background: #e8f5e9; color: #4caf50;"></i>
          <span class="text">
            <h3>{{ stats.jumlahKendaraanServis }}</h3>
            <p>Kendaraan Servis (Bulan Ini)</p>
          </span>
        </li>

        <li>
          <i class='bx bxs-group' style="background: #e3f2fd; color: #2196f3;"></i>
          <span class="text">
            <h3>{{ stats.totalPelanggan }}</h3>
            <p>Pelanggan Baru (Bulan Ini)</p>
          </span>
        </li>

        <li>
          <i class='bx bxs-wallet' style="background: #fff3e0; color: #ff9800;"></i>
          <span class="text">
            <h3>Rp {{ formatRupiah(stats.labaKotor) }}</h3>
            <p>Laba Kotor</p>
          </span>
        </li>

        <li>
          <i class='bx bxs-dollar-circle' style="background: #fce4ec; color: #e91e63;"></i>
          <span class="text">
            <h3>Rp {{ formatRupiah(stats.labaBersih) }}</h3>
            <p>Laba Bersih</p>
          </span>
        </li>
      </ul>

      <div class="table-data">
        <div class="order">
          <div class="head">
            <h3>Recent Orders</h3>
            <i class='bx bx-search'></i>
            <i class='bx bx-filter'></i>
          </div>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Date Order</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id_transaksi || order.id">
                <td>
                  <img :src="order.user_avatar || 'https://placehold.co/600x400/png'">
                  <p>{{ order.user_name || order.customer_name || 'No Name' }}</p>
                </td>
                <td>{{ order.date || order.tanggal || '-' }}</td>
                <td>
                  <span class="status" :class="order.status ? order.status.toLowerCase() : 'pending'">
                    {{ order.status || 'Pending' }}
                  </span>
                </td>
              </tr>
              <tr v-if="orders.length === 0">
                <td colspan="3" style="text-align: center; color: var(--dark-grey); font-style: italic; padding: 20px;">
                  Tidak ada pesanan terbaru.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="todo">
          <div class="head">
            <h3>Todos</h3>
            <i class='bx bx-plus icon'></i>
            <i class='bx bx-filter'></i>
          </div>
          <ul class="todo-list">
            <li v-for="todo in todos" :key="todo.id" :class="todo.completed || todo.is_done ? 'completed' : 'not-completed'">
              <p>{{ todo.title || todo.tugas }}</p>
              <i class='bx bx-dots-vertical-rounded'></i>
            </li>
            <li v-if="todos.length === 0" style="background: none; justify-content: center; color: var(--dark-grey);">
              Semua tugas selesai!
            </li>
          </ul>
        </div>
      </div>
    </template>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/apiClient';

const isLoading = ref(true);
const orders = ref([]);
const todos = ref([]);

const stats = ref({
  jumlahKendaraanServis: 0,
  totalPelanggan: 0,
  labaKotor: 0,
  labaBersih: 0
});

// Fungsi pembantu mengekstrak angka dari objek bersarang (nested object)
const extractDataValue = (rawField) => {
  if (rawField === null || rawField === undefined) return 0;
  
  // Jika field dari backend berupa object (seperti di screenshot), ambil properti 'bulan_ini'
  // Anda bisa mengganti '.bulan_ini' menjadi '.hari_ini' jika ingin summary harian
  if (typeof rawField === 'object') {
    return rawField.bulan_ini ?? rawField.hari_ini ?? rawField.total ?? 0;
  }
  
  // Jika tipe data sudah angka biasa/string tunggal, langsung return jalurnya
  return rawField;
};

const fetchDashboardData = async () => {
  try {
    isLoading.value = true;
    const response = await api.get('/dashboard/stats');
    const resData = response.data?.data || response.data;
    
    if (resData) {
      // Ambil objek mentah dari respons JSON backend
      const rawVehicles = resData.stats?.jumlah_kendaraan_servis ?? resData.jumlah_kendaraan_servis;
      const rawCustomers = resData.stats?.total_pelanggan ?? resData.total_pelanggan;
      const rawKotor = resData.stats?.laba_kotor ?? resData.laba_kotor;
      const rawBersih = resData.stats?.laba_bersih ?? resData.laba_bersih;

      // Ekstrak data menggunakan ekstraktor pintar agar tidak bocor mentah-mentah
      stats.value = {
        jumlahKendaraanServis: extractDataValue(rawVehicles),
        totalPelanggan: extractDataValue(rawCustomers),
        labaKotor: extractDataValue(rawKotor),
        labaBersih: extractDataValue(rawBersih)
      };
      
      orders.value = resData.recent_orders || resData.data_orders || [];
      todos.value = resData.todos || resData.data_todos || [];
    }
  } catch (error) {
    console.error('Gagal memuat data dari backend Echo:', error);
  } home: {
    isLoading.value = false;
    setTimeout(() => {
      initDashboardJS();
    }, 50);
  }
};

const formatRupiah = (val) => {
  // Antisipasi jika nilai bukan angka seutuhnya agar tidak memicu NaN
  const number = Number(val);
  if (isNaN(number)) return '0';
  return new Intl.NumberFormat('id-ID').format(number);
};

const initDashboardJS = () => {
  const menuBar = document.querySelector('#content nav .bx.bx-menu');
  const sidebar = document.getElementById('sidebar');
  if (menuBar && sidebar) {
    menuBar.onclick = () => sidebar.classList.toggle('hide');
  }

  const switchMode = document.getElementById('switch-mode');
  if (switchMode) {
    switchMode.onchange = function () {
      document.body.classList.toggle('dark', this.checked);
    };
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.grid-4-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  grid-gap: 24px;
  background: transparent;
  padding: 0;
}
.loading-state {
  display: flex;
  align-items: center;
  grid-gap: 10px;
  font-size: 16px;
}
</style>