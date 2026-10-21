<template>
    <main>
        <div class="table-data">
            <div class="order">
                <div class="head">
                    <h3>Data Mekanik & Spesialisasi</h3>
                    <div class="search-container-custom">
                        <input type="text" v-model="searchQuery" @keyup.enter="handleSearchSubmit"
                            placeholder="Cari mekanik..." />
                        <button type="button" class="search-btn-blue" @click="handleSearchSubmit">
                            <i class='bx bx-search'></i>
                        </button>
                    </div>
                    <button class="btn-tambah" @click="openModalAdd">
                        <i class='bx bx-plus'></i> Tambah Mekanik
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
                            <th>Nama Mekanik</th>
                            <th>No. HP</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="listMekanik.length === 0">
                            <td colspan="5" style="text-align: center; color: #888;">Belum ada data mekanik.</td>
                        </tr>
                        <tr v-for="(mekanik, index) in listMekanik" :key="index">
                            <td style="text-align: center; font-weight: 600; color: #666;">
                                {{ ((pagination.current_page - 1) * pagination.limit) + index + 1 }}
                            </td>
                            <td><strong>{{ mekanik.nama_mekanik || mekanik.NamaMekanik || mekanik.namaMekanik
                                    }}</strong></td>
                            <td>{{ mekanik.no_hp || mekanik.NoHp || mekanik.noHp }}</td>
                            <td>
                                <span
                                    :class="['badge-status', mekanik.status_aktif === 'aktif' ? 'status-active' : 'status-inactive']">
                                    {{ mekanik.status_aktif }}
                                </span>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-detail" @click="openModalDetail(mekanik)" title="Lihat Detail">
                                        <i class='bx bx-info-circle'></i>
                                    </button>
                                    <button class="btn-edit" @click="openModalEdit(mekanik, index)">
                                        <i class='bx bxs-edit'></i>
                                    </button>
                                    <button class="btn-delete" @click="deleteMekanik(mekanik)">
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
                                pagination.total_page }}</strong> (Total: {{ pagination.total_data }} mekanik)
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
                        <h4>{{ isEditMode ? 'Edit Data Mekanik' : 'Tambah Mekanik Baru' }}</h4>
                        <i class='bx bx-x close-icon' @click="closeModal"></i>
                    </div>

                    <form @submit.prevent="saveMekanik">
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Nama Mekanik</label>
                                <input type="text" v-model="form.nama_mekanik" required
                                    placeholder="Contoh: Agus Sumarno" />
                            </div>

                            <div class="form-group">
                                <label>No. HP</label>
                                <input type="text" v-model="form.no_hp" @input="validateNoHp" required
                                    placeholder="Contoh: 081234567890" maxlength="13" />
                            </div>

                            <div class="form-group">
                                <label>Status Kerja</label>
                                <select v-model="form.status_aktif" required class="custom-select">
                                    <option :value="true">aktif</option>
                                    <option :value="false">nonaktif</option>
                                </select>
                            </div>

                            <!-- <input type="hidden" v-model="form.created_at" /> -->
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn-cancel" @click="closeModal">Batal</button>
                            <button type="submit" class="btn-save">
                                <i class='bx bx-save'></i> Simpan Data Mekanik
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
        <DetailMekanikModal :isOpen="isDetailModalOpen" :dataMekanik="selectedMekanikDetail"
            @close="isDetailModalOpen = false" />
    </main>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import DetailMekanikModal from '@/components/modal/DetailMekanikModal.vue'; // Diubah sesuai nama modal baru
import api from '@/services/apiClient';
import { useAuthStore } from '@/stores/auth';

const isDetailModalOpen = ref(false);
const selectedMekanikDetail = ref({});

const listMekanik = ref([]);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedIndex = ref(null);
const authStore = useAuthStore();

const searchQuery = ref('');

const pagination = ref({
    current_page: 1,
    limit: 5, // Standar default tampilan data
    total_data: 0,
    total_page: 0
});

const openModalDetail = (mekanik) => {
    selectedMekanikDetail.value = JSON.parse(JSON.stringify(mekanik));
    isDetailModalOpen.value = true;
};

const alert = ref({ message: '', type: '' });

const handleSearchSubmit = () => {
    fetchMekanik(1, searchQuery.value);
};

const handleLimitChange = () => {
    fetchMekanik(1, searchQuery.value);
};

const initialFormState = () => ({
    nama_mekanik: '',
    no_hp: '',
    status_aktif: true,
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
    return savedUsername ? savedUsername : 'Admin';
};


const fetchMekanik = async (pageTarget = 1, keyword = '') => {
    try {
        let response;
        const currentLimit = pagination.value.limit || 5;

        if (keyword.trim() !== '') {
            // ==========================================
            // 1. JALUR PENCARIAN (SEARCH MEKANIK)
            // ==========================================
            response = await api.get('/mekanik/search', {
                params: {
                    keyword: keyword,
                    page: pageTarget,
                    limit: currentLimit
                }
            });

            const resBody = response.data;
            const rawData = resBody?.Data || resBody?.data || (Array.isArray(resBody) ? resBody : []);
            listMekanik.value = rawData;

            const meta = resBody?.Meta || resBody?.meta;
            if (meta) {
                pagination.value.current_page = meta.CurrentPage || meta.current_page || pageTarget;
                pagination.value.total_data = meta.TotalRows || meta.total_data || rawData.length;
                pagination.value.total_page = meta.TotalPages || meta.total_page || 1;
            } else {
                pagination.value.current_page = resBody?.current_page || pageTarget;
                pagination.value.total_data = resBody?.total_data || rawData.length;
                pagination.value.total_page = resBody?.total_page || Math.ceil(rawData.length / currentLimit) || 1;
            }

        } else {
            // ==========================================
            // 2. JALUR UTAMA (GET ALL MEKANIK / PAGINASI)
            // ==========================================
            response = await api.get('/mekanik', {
                params: {
                    page: pageTarget,
                    limit: currentLimit
                }
            });

            const resBody = response.data;
            console.log("Isi Response Backend Mekanik:", resBody);

            listMekanik.value = resBody?.Data || resBody?.data || (Array.isArray(resBody) ? resBody : []);

            const meta = resBody?.Meta || resBody?.meta;
            if (meta) {
                pagination.value.current_page = meta.CurrentPage || meta.current_page || pageTarget;
                pagination.value.limit = meta.PageSize || meta.limit || meta.page_size || currentLimit;
                pagination.value.total_data = meta.TotalRows || meta.total_data || meta.total_rows || 0;
                pagination.value.total_page = meta.TotalPages || meta.total_page || meta.total_pages || 1;
            } else {
                pagination.value.current_page = resBody?.current_page || resBody?.CurrentPage || pageTarget;
                pagination.value.limit = resBody?.limit || resBody?.PageSize || currentLimit;
                pagination.value.total_data = resBody?.total_data || resBody?.TotalRows || listMekanik.value.length;
                pagination.value.total_page = resBody?.total_page || resBody?.TotalPages || Math.ceil(listMekanik.value.length / currentLimit) || 1;
            }
        }
    } catch (error) {
        console.error("Gagal memuat data mekanik:", error);
        listMekanik.value = [];
    }
};

const changePage = (page) => {
    if (page >= 1 && page <= pagination.value.total_page) {
        fetchMekanik(page, searchQuery.value);
    }
};

const openModalAdd = () => {
    isEditMode.value = false;
    form.value = initialFormState();
    form.value.created_by = getCashierName();
    form.value = initialFormState();
    isModalOpen.value = true;
};

const openModalEdit = (mekanik, index) => {
    isEditMode.value = true;
    selectedIndex.value = index;

    const normalizedMekanik = JSON.parse(JSON.stringify(mekanik));

    // Ambil nilai status dari backend (baik kapital atau huruf kecil)
    const rawStatus = normalizedMekanik.status_aktif || normalizedMekanik.StatusAktif || '';

    // Jika stringnya mengandung kata 'aktif' (case-insensitive), set true. Jika tidak, set false.
    normalizedMekanik.status_aktif = rawStatus.toLowerCase().includes('aktif');

    form.value = normalizedMekanik;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    form.value = initialFormState();
};

const saveMekanik = async () => {
    try {
        // MAPPING PAYLOAD: Sesuaikan teks string nonaktif dengan ekspektasi backend
        const payload = {
            nama_mekanik: form.value.nama_mekanik,
            no_hp: form.value.no_hp,

            // COBA SALAH SATU FORMAT DI BAWAH INI JIKA "Tidak Aktif" DIKEMBALIKAN ERROR 400:
            // Opsi A: 'Nonaktif' (Sering digunakan di backend)
            status_aktif: form.value.status_aktif ? 'Aktif' : 'Nonaktif'

            // Opsi B: Jika A gagal, ganti ke 'Tidak Aktif' (pastikan spasi sesuai)
            // status_aktif: form.value.status_aktif ? 'Aktif' : 'Tidak Aktif'
        };

        console.log("Payload dikirim:", payload);

        if (isEditMode.value) {
            await api.put(`/mekanik/${form.value.id_mekanik}`, payload);
            showAlert('Data mekanik berhasil diperbarui!');
        } else {
            await api.post('/mekanik', payload);
            showAlert('Mekanik baru berhasil ditambahkan!');
        }

        closeModal();
        fetchMekanik(pagination.value.current_page);
    } catch (error) {
        console.error("Gagal menyimpan:", error);
        // Tampilkan pesan error murni dari backend agar Anda tahu string apa yang diminta
        const backendMessage = error.response?.data?.message || error.response?.data?.error || error.response?.data;
        showAlert(typeof backendMessage === 'string' ? backendMessage : 'Gagal menyimpan data (400 Bad Request).', 'error');
    }
};

const deleteMekanik = async (mekanik) => {
    if (!mekanik.id_mekanik) {
        showAlert('Gagal menghapus: ID mekanik tidak ditemukan.', 'error');
        return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus mekanik "${mekanik.nama_mekanik || mekanik.NamaMekanik}" beserta riwayat keahliannya?`)) {
        try {
            await api.delete(`/mekanik/${mekanik.id_mekanik}`);
            showAlert('Data mekanik berhasil dihapus dari database.', 'success');

            if (listMekanik.value.length === 1 && pagination.value.current_page > 1) {
                fetchMekanik(pagination.value.current_page - 1);
            } else {
                fetchMekanik(pagination.value.current_page);
            }
        } catch (error) {
            console.error("Gagal menghapus data dari server:", error);
            const errorMsg = error.response?.data?.message || 'Gagal menghapus data dari server.';
            showAlert(errorMsg, 'error');
        }
    }
};

onMounted(() => {
    fetchMekanik(pagination.value.current_page);
});
</script>
<style scoped>
/* Bagian CSS Anda dipertahankan seutuhnya tanpa ada yang dirubah */
@import '@/assets/styles/content.css';

/* Style Dasar untuk Semua Badge Status */
.badge-status {
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 600;
    border-radius: 20px;
    display: inline-block;
    text-align: center;
}

/* Warna Hijau untuk Status Aktif */
.status-active {
    background-color: #d1e7dd;
    /* Hijau soft */
    color: #0f5132;
    /* Teks hijau tua */
    border: 1px solid #badbcc;
}

/* Warna Merah untuk Status Cuti / Resign (Tidak Aktif) */
.status-inactive {
    background-color: #f8d7da;
    /* Merah soft */
    color: #842029;
    /* Teks merah tua */
    border: 1px solid #f5c2c7;
}

/* Container form group untuk memastikan jarak rapi */
.form-group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 6px;
}

/* Mempercantik Element Select */
.form-group select {
    width: 100%;
    padding: 10px 15px;
    font-size: 14px;
    font-family: inherit;
    color: #333;
    background-color: #fff;
    border: 1px solid #dcdcdc;
    border-radius: 6px;
    outline: none;
    transition: all 0.3s ease;
    cursor: pointer;

    /* Menghilangkan panah default bawaan browser (Chrome, Safari, Firefox) */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    /* Menambahkan custom icon panah menggunakan background SVG */
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
    padding-right: 40px;
    /* Jaga jarak teks agar tidak menabrak panah */
}

/* Efek Focus saat Select diklik */
.form-group select:focus {
    border-color: #3c91e6;
    /* Warna biru soft dashboard */
    box-shadow: 0 0 0 3px rgba(60, 145, 230, 0.15);
}

/* Styling untuk pilihan option di dalamnya */
.form-group select option {
    padding: 10px;
    background-color: #fff;
    color: #333;
}
</style>