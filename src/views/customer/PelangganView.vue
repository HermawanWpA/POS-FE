<template>
    <main>
        <div class="table-data">
            <div class="order">
                <div class="head">
                    <h3>Data Pelanggan & Kendaraan</h3>
                    <div class="search-container-custom">
                        <input type="text" v-model="searchQuery" @keyup.enter="handleSearchSubmit"
                            placeholder="Search..." />
                        <button type="button" class="search-btn-blue" @click="handleSearchSubmit">
                            <i class='bx bx-search'></i>
                        </button>
                    </div>
                    <button class="btn-tambah" @click="openModalAdd">
                        <i class='bx bx-plus'></i> Tambah Pelanggan
                    </button>
                </div>

                <div v-if="alert.message"
                    :class="['alert', alert.type === 'success' ? 'success-alert' : 'error-alert']">
                    <i :class="alert.type === 'success' ? 'bx bx-check-circle' : 'bx bx-error-circle'"></i>
                    {{ alert.message }}
                </div>

            <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Nama Pelanggan</th>
                            <th>No. HP</th>
                            <th>Alamat</th>
                            <th>Dibuat Oleh</th>
                            <th>Kendaraan (No. Polisi / Tipe)</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="listPelanggan.length === 0">
                            <td colspan="7" style="text-align: center; color: #888;">Belum ada data pelanggan.</td>
                        </tr>
                        <tr v-for="(pelanggan, index) in listPelanggan" :key="index">
                            <td style="text-align: center; font-weight: 600; color: #666;">
                                {{ ((pagination.current_page - 1) * pagination.limit) + index + 1 }}
                            </td>
                            <td><strong>{{ pelanggan.nama_pelanggan || pelanggan.NamaPelanggan || pelanggan.namaPelanggan }}</strong></td>
                            <td>{{ pelanggan.no_hp || pelanggan.NoHp || pelanggan.noHp }}</td>
                            <td>{{ pelanggan.alamat || pelanggan.Alamat }}</td>
                            <td><span class="badge-cashier">{{ pelanggan.created_by || pelanggan.CreatedBy || pelanggan.createdBy }}</span></td>
                            <td>
                                <ul class="list-kendaraan">
                                    <li v-for="(knd, kIdx) in (pelanggan.kendaraan || pelanggan.Kendaraan)" :key="kIdx">
                                        <span class="plate">{{ knd.no_polisi || knd.NoPolisi || knd.noPolisi }}</span> 
                                        - {{ knd.merek_tipe || knd.MerekTipe || knd.merekTipe }}
                                    </li>
                                </ul>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-detail" @click="openModalDetail(pelanggan)" title="Lihat Detail">
                                        <i class='bx bx-info-circle'></i>
                                    </button>
                                    <button class="btn-edit" @click="openModalEdit(pelanggan, index)">
                                        <i class='bx bxs-edit'></i>
                                    </button>
                                    <button class="btn-delete" @click="deletePelanggan(pelanggan)">
                                        <i class='bx bxs-trash'></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="pagination-container">
                    <div class="pagination-left">
                        <div class="pagination-info">
                            Menampilkan halaman <strong>{{ pagination.current_page }}</strong> dari <strong>{{
                                pagination.total_page }}</strong> (Total: {{ pagination.total_data }} pelanggan)
                        </div>
                        <div class="limit-selector">
                            <label for="limitSelect">Tampilkan:</label>
                            <select id="limitSelect" v-model="pagination.limit" @change="handleLimitChange">
                                <option :value="2">2</option>
                                <option :value="5">5</option>
                                <option :value="10">10</option>
                                <option :value="20">20</option>
                                <option :value="50">50</option>
                            </select>
                            <span>data</span>
                        </div>
                    </div>
                    
                    <div class="pagination-buttons">
                        <button type="button" class="btn-page" :disabled="pagination.current_page === 1"
                            @click="changePage(pagination.current_page - 1)">
                            <i class='bx bx-chevron-left'></i> Prev
                        </button>

                        <button type="button" v-for="page in pagination.total_page" :key="page" class="btn-page"
                            :class="{ active: pagination.current_page === page }" @click="changePage(page)">
                            {{ page }}
                        </button>

                        <button type="button" class="btn-page"
                            :disabled="pagination.current_page === pagination.total_page || pagination.total_page === 0"
                            @click="changePage(pagination.current_page + 1)">
                            Next <i class='bx bx-chevron-right'></i>
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="isModalOpen" class="modal-overlay">
                <div class="modal-box">
                    <div class="modal-header">
                        <h4>{{ isEditMode ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru' }}</h4>
                        <i class='bx bx-x close-icon' @click="closeModal"></i>
                    </div>

                    <form @submit.prevent="savePelanggan">
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Nama Pelanggan</label>
                                <input type="text" v-model="form.nama_pelanggan" required
                                    placeholder="Contoh: Hermawan" />
                            </div>
                            <div class="form-group">
                                <label>No. HP</label>
                                <input type="text" v-model="form.no_hp" @input="validateNoHp" required
                                    placeholder="Contoh: 081234567890" maxlength="13" />
                            </div>
                            <div class="form-group">
                                <label>Alamat</label>
                                <textarea v-model="form.alamat" required
                                    placeholder="Contoh: Jl. Merdeka No. 10"></textarea>
                            </div>

                            <hr class="divider" />

                            <div class="kendaraan-header">
                                <h5>Data Kendaraan Pelanggan</h5>
                                <button type="button" class="btn-add-vehicle" @click="addKendaraanRow">
                                    <i class='bx bx-plus'></i> Tambah Kendaraan
                                </button>
                            </div>

                            <div v-if="form.kendaraan.length === 0" class="empty-vehicle-text">
                                * Wajib menambahkan minimal 1 kendaraan.
                            </div>

                            <div v-for="(vch, idx) in form.kendaraan" :key="idx" class="vehicle-row">
                                <div class="vehicle-title">
                                    <span>Kendaraan #{{ idx + 1 }}</span>
                                    <button type="button" class="btn-remove-vehicle" @click="removeKendaraanRow(idx)">
                                        <i class='bx bx-trash'></i> Hapus
                                    </button>
                                </div>
                                <div class="grid-inputs">
                                    <div class="form-group">
                                        <label>No. Polisi</label>
                                        <input type="text" v-model="vch.no_polisi" required placeholder="T 1234 EWE" />
                                    </div>
                                    <div class="form-group">
                                        <label>Merek & Tipe</label>
                                        <input type="text" v-model="vch.merek_tipe" required
                                            placeholder="Honda CBR 150" />
                                    </div>
                                    <div class="form-group">
                                        <label>No. Rangka</label>
                                        <input type="text" v-model="vch.no_rangka" placeholder="HW2132238" />
                                    </div>
                                    <div class="form-group">
                                        <label>No. Mesin</label>
                                        <input type="text" v-model="vch.no_mesin" placeholder="NS98763" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn-cancel" @click="closeModal">Batal</button>
                            <button type="submit" class="btn-save" :disabled="form.kendaraan.length === 0">
                                <i class='bx bx-save'></i> Simpan Data
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
        <DetailPelangganModal :isOpen="isDetailModalOpen" :dataPelanggan="selectedPelangganDetail"
            @close="isDetailModalOpen = false" />
    </main>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import DetailPelangganModal from '@/components/modal/DetailPelangganModal.vue';
import api from '@/services/apiClient';
import { useAuthStore } from '@/stores/auth';

const isDetailModalOpen = ref(false);
const selectedPelangganDetail = ref({});

const listPelanggan = ref([]);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedIndex = ref(null);
const authStore = useAuthStore();

const searchQuery = ref('');

const pagination = ref({
    current_page: 1,
    limit: 2, 
    total_data: 0,
    total_page: 0
});

const openModalDetail = (pelanggan) => {
    selectedPelangganDetail.value = JSON.parse(JSON.stringify(pelanggan)); 
    isDetailModalOpen.value = true;
};

const alert = ref({ message: '', type: '' });

const handleSearchSubmit = () => {
    fetchPelanggan(1, searchQuery.value);
};

const handleLimitChange = () => {
    fetchPelanggan(1, searchQuery.value);
};

const initialFormState = () => ({
    nama_pelanggan: '',
    no_hp: '',
    alamat: '',
    created_by: '',
    kendaraan: []
});
const form = ref(initialFormState());

const showAlert = (message, type = 'success') => {
    alert.value = { message, type };
    setTimeout(() => { alert.value = { message: '', type: '' }; }, 4000);
};

const validateNoHp = (event) => {
    form.value.no_hp = event.target.value.replace(/\D/g, '');
};

const getCashierName = () => {
    const savedUsername = localStorage.getItem('username');
    return savedUsername ? savedUsername : 'Kasir';
};

const addKendaraanRow = () => {
    form.value.kendaraan.push({
        no_polisi: '',
        merek_tipe: '',
        no_rangka: '',
        no_mesin: ''
    });
};

const removeKendaraanRow = (index) => {
    form.value.kendaraan.splice(index, 1);
};

const fetchPelanggan = async (pageTarget = 1, keyword = '') => {
    try {
        let response;
        const currentLimit = pagination.value.limit || 5;

        if (keyword.trim() !== '') {
            // ==========================================
            // 1. JALUR PENCARIAN (SEARCH)
            // ==========================================
            response = await api.get('/pelanggan/search', {
                params: { 
                    keyword: keyword,
                    page: pageTarget,
                    limit: currentLimit
                }
            });

            const resBody = response.data;
            // Toleransi huruf kapital (Data) atau huruf kecil (data)
            const rawData = resBody?.Data || resBody?.data || (Array.isArray(resBody) ? resBody : []);
            listPelanggan.value = rawData;
            
            // Cek Meta (Kapital atau Kecil)
            const meta = resBody?.Meta || resBody?.meta;
            if (meta) {
                pagination.value.current_page = meta.CurrentPage || meta.current_page || pageTarget;
                pagination.value.total_data   = meta.TotalRows || meta.total_data || rawData.length;
                pagination.value.total_page   = meta.TotalPages || meta.total_page || 1;
            } else {
                pagination.value.current_page = resBody?.current_page || pageTarget;
                pagination.value.total_data   = resBody?.total_data || rawData.length;
                pagination.value.total_page   = resBody?.total_page || Math.ceil(rawData.length / currentLimit) || 1;
            }

        } else {
            // ==========================================
            // 2. JALUR UTAMA (PAGINASI / GET ALL)
            // ==========================================
            response = await api.get('/pelanggan', {
                params: {
                    page: pageTarget,
                    limit: currentLimit
                }
            });

            const resBody = response.data;
            
            // LOG UNTUK DEBUGGING (Intip isi asli dari backend di Console Browser)
            console.log("Isi Response Backend:", resBody);

            // Ambil array data (Coba Data kapital, jika kosong coba data kecil, jika tidak ada set array kosong)
            listPelanggan.value = resBody?.Data || resBody?.data || (Array.isArray(resBody) ? resBody : []);
            
            // Ambil objek Meta (Coba Meta kapital atau meta kecil)
            const meta = resBody?.Meta || resBody?.meta;

            if (meta) {
                // Ambil nilai di dalam Meta dengan toleransi Kapital/Kecil
                pagination.value.current_page = meta.CurrentPage || meta.current_page || pageTarget;
                pagination.value.limit        = meta.PageSize || meta.limit || meta.page_size || currentLimit;
                pagination.value.total_data   = meta.TotalRows || meta.total_data || meta.total_rows || 0;
                pagination.value.total_page   = meta.TotalPages || meta.total_page || meta.total_pages || 1;
            } else {
                // Jalur darurat jika backend mengirim data langsung di root object tanpa bungkus Meta
                pagination.value.current_page = resBody?.current_page || resBody?.CurrentPage || pageTarget;
                pagination.value.limit        = resBody?.limit || resBody?.PageSize || currentLimit;
                pagination.value.total_data   = resBody?.total_data || resBody?.TotalRows || listPelanggan.value.length;
                pagination.value.total_page   = resBody?.total_page || resBody?.TotalPages || Math.ceil(listPelanggan.value.length / currentLimit) || 1;
            }
        }
    } catch (error) {
        console.error("Gagal memuat data pelanggan:", error);
        listPelanggan.value = [];
    }
};
const changePage = (page) => {
    if (page >= 1 && page <= pagination.value.total_page) {
        fetchPelanggan(page, searchQuery.value);
    }
};

const openModalAdd = () => {
    isEditMode.value = false;
    form.value = initialFormState();
    form.value.created_by = getCashierName();
    addKendaraanRow();
    isModalOpen.value = true;
};

const openModalEdit = (pelanggan, index) => {
    isEditMode.value = true;
    selectedIndex.value = index;
    
    // Normalisasi data dari backend sebelum dimasukkan ke form v-model lokal
    const normalizedPelanggan = JSON.parse(JSON.stringify(pelanggan));
    const rawKendaraan = normalizedPelanggan.kendaraan || normalizedPelanggan.Kendaraan || [];
    
    normalizedPelanggan.kendaraan = rawKendaraan.map(k => ({
        id: k.id || k.ID,
        no_polisi: k.no_polisi || k.NoPolisi || k.noPolisi || '',
        merek_tipe: k.merek_tipe || k.MerekTipe || k.merekTipe || '',
        no_rangka: k.no_rangka || k.NoRangka || k.noRangka || '',
        no_mesin: k.no_mesin || k.NoMesin || k.noMesin || ''
    }));
    
    form.value = normalizedPelanggan;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    form.value = initialFormState();
};

const savePelanggan = async () => {
    if (form.value.kendaraan.length === 0) {
        showAlert('Wajib mengisi minimal satu kendaraan!', 'error');
        return;
    }

    try {
        if (isEditMode.value) {
            await api.put(`/pelanggan/${form.value.id}`, form.value);
            showAlert('Data pelanggan berhasil diperbarui!');
        } else {
            await api.post('/pelanggan', form.value);
            showAlert('Pelanggan baru berhasil ditambahkan!');
        }
        closeModal();
        fetchPelanggan(pagination.value.current_page);
    } catch (error) {
        console.error("Gagal menyimpan ke database:", error);
        showAlert(error.response?.data?.message || 'Gagal menyimpan data ke database.', 'error');
    }
};

const deletePelanggan = async (pelanggan) => {
    if (!pelanggan.id) {
        showAlert('Gagal menghapus: ID pelanggan tidak ditemukan.', 'error');
        return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus pelanggan "${pelanggan.nama_pelanggan || pelanggan.NamaPelanggan}" beserta seluruh kendaraannya?`)) {
        try {
            await api.delete(`/pelanggan/${pelanggan.id}`);
            showAlert('Data pelanggan berhasil dihapus dari database.', 'success');

            if (listPelanggan.value.length === 1 && pagination.value.current_page > 1) {
                fetchPelanggan(pagination.value.current_page - 1);
            } else {
                fetchPelanggan(pagination.value.current_page);
            }
        } catch (error) {
            console.error("Gagal menghapus data dari server:", error);
            const errorMsg = error.response?.data?.message || 'Gagal menghapus data dari server.';
            showAlert(errorMsg, 'error');
        }
    }
};

onMounted(() => {
    fetchPelanggan(pagination.value.current_page);
});
</script>

<style scoped>
/* Bagian CSS Anda dipertahankan seutuhnya tanpa ada yang dirubah */
@import '@/assets/styles/content.css';
</style>