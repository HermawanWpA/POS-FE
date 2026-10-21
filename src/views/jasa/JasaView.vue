<template>
    <main>
        <div class="table-data">
            <div class="order">
                <div class="head">
                    <h3>Data Master Jasa & Komisi</h3>
                    <div class="search-container-custom">
                        <input type="text" v-model="searchQuery" @keyup.enter="handleSearchSubmit"
                            placeholder="Cari nama jasa..." />
                        <button type="button" class="search-btn-blue" @click="handleSearchSubmit">
                            <i class='bx bx-search'></i>
                        </button>
                    </div>
                    <button class="btn-tambah" @click="openModalAdd">
                        <i class='bx bx-plus'></i> Tambah Jasa
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
                            <th>Nama Jasa</th>
                            <th>Tarif Jasa</th>
                            <th>Komisi (%)</th>
                            <th>Komisi Mekanik</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="listJasa.length === 0">
                            <td colspan="6" style="text-align: center; color: #888;">Belum ada data master jasa.</td>
                        </tr>
                        <tr v-for="(jasa, index) in listJasa" :key="index">
                            <td style="text-align: center; font-weight: 600; color: #666;">
                                {{ ((pagination.current_page - 1) * pagination.limit) + index + 1 }}
                            </td>
                            <td><strong>{{ jasa.nama_jasa || jasa.NamaJasa }}</strong></td>
                            <td>Rp {{ (jasa.tarif_jasa || jasa.TarifJasa || 0).toLocaleString('id-ID') }}</td>
                            <td style="text-align: center;">{{ jasa.presentasi_komisi || jasa.PresentasiKomisi || 0 }}%</td>
                            <td>Rp {{ (jasa.komisi_mekanik || jasa.KomisiMekanik || 0).toLocaleString('id-ID') }}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-detail" @click="openModalDetail(jasa)" title="Lihat Detail">
                                        <i class='bx bx-info-circle'></i>
                                    </button>
                                    <button class="btn-edit" @click="openModalEdit(jasa, index)">
                                        <i class='bx bx-max bxs-edit'></i>
                                    </button>
                                    <button class="btn-delete" @click="deleteJasa(jasa)">
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
                                pagination.total_page }}</strong> (Total: {{ pagination.total_data }} data jasa)
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
                        <h4>{{ isEditMode ? 'Edit Data Jasa' : 'Tambah Jasa Baru' }}</h4>
                        <i class='bx bx-x close-icon' @click="closeModal"></i>
                    </div>

                    <form @submit.prevent="saveJasa">
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Nama Jasa</label>
                                <input type="text" v-model="form.nama_jasa" required
                                    placeholder="Contoh: Service Motor Matic" />
                            </div>

                            <div class="form-group">
                                <label>Tarif Jasa (Rp)</label>
                                <input type="number" v-model.number="form.tarif_jasa" @input="calculateKomisi" required
                                    placeholder="Contoh: 50000" min="0" />
                                <small v-if="form.tarif_jasa" class="nominal-terbilang">
                                    <i class='bx bx-money'></i> {{ angkaKeTerbilang(form.tarif_jasa) }} Rupiah
                                </small>
                            </div>

                            <div class="form-group">
                                <label>Presentasi Komisi (%)</label>
                                <input type="number" v-model.number="form.presentasi_komisi" @input="calculateKomisi" required
                                    placeholder="Contoh: 10" min="0" max="100" step="0.1" />
                            </div>

                            <div class="form-group">
                                <label>Komisi Mekanik (Otomatis)</label>
                                <input type="number" v-model.number="form.komisi_mekanik" disabled
                                    placeholder="Hasil hitung otomatis" />
                                <small v-if="form.komisi_mekanik" class="nominal-terbilang komisi-color">
                                    <i class='bx bx-calculator'></i> {{ angkaKeTerbilang(form.komisi_mekanik) }} Rupiah
                                </small>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn-cancel" @click="closeModal">Batal</button>
                            <button type="submit" class="btn-save">
                                <i class='bx bx-save'></i> Simpan Data Jasa
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
        <DetailJasaModal :isOpen="isDetailModalOpen" :dataJasa="selectedJasaDetail"
            @close="isDetailModalOpen = false" />
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DetailJasaModal from '@/components/modal/DetailJasaModal.vue';
import api from '@/services/apiClient';

const isDetailModalOpen = ref(false);
const selectedJasaDetail = ref({});

const listJasa = ref([]);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedIndex = ref(null);

const searchQuery = ref('');

const pagination = ref({
    current_page: 1,
    limit: 5,
    total_data: 0,
    total_page: 0
});

const openModalDetail = (jasa) => {
    selectedJasaDetail.value = JSON.parse(JSON.stringify(jasa));
    isDetailModalOpen.value = true;
};

const alert = ref({ message: '', type: '' });

const handleSearchSubmit = () => {
    fetchJasa(1, searchQuery.value);
};

const handleLimitChange = () => {
    fetchJasa(1, searchQuery.value);
};

const initialFormState = () => ({
    nama_jasa: '',
    tarif_jasa: 0,
    presentasi_komisi: 0,
    komisi_mekanik: 0,
    created_by: ''
});
const form = ref(initialFormState());

const showAlert = (message, type = 'success') => {
    alert.value = { message, type };
    setTimeout(() => { alert.value = { message: '', type: '' }; }, 4000);
};

const calculateKomisi = () => {
    const tarif = form.value.tarif_jasa || 0;
    const persen = form.value.presentasi_komisi || 0;
    form.value.komisi_mekanik = Math.round((tarif * persen) / 100);
};

// Fungsi JavaScript Konversi Angka Menjadi Kalimat Terbilang Indonesia
const angkaKeTerbilang = (angka) => {
    const kata = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
    angka = Math.floor(Math.abs(angka));
    
    if (angka < 12) return kata[angka];
    if (angka < 20) return angkaKeTerbilang(angka - 10) + ' Belas';
    if (angka < 100) return angkaKeTerbilang(angka / 10) + ' Puluh ' + angkaKeTerbilang(angka % 10);
    if (angka < 200) return 'Seratus ' + angkaKeTerbilang(angka - 100);
    if (angka < 1000) return angkaKeTerbilang(angka / 100) + ' Ratus ' + angkaKeTerbilang(angka % 100);
    if (angka < 2000) return 'Seribu ' + angkaKeTerbilang(angka - 1000);
    if (angka < 1000000) return angkaKeTerbilang(angka / 1000) + ' Ribu ' + angkaKeTerbilang(angka % 1000);
    if (angka < 1000000000) return angkaKeTerbilang(angka / 1000000) + ' Juta ' + angkaKeTerbilang(angka % 1000000);
    return 'Angka terlalu besar';
};

const getCashierName = () => {
    const savedUsername = localStorage.getItem('username');
    return savedUsername ? savedUsername : 'Admin';
};

const fetchJasa = async (pageTarget = 1, keyword = '') => {
    try {
        let response;
        const currentLimit = pagination.value.limit || 5;

        if (keyword.trim() !== '') {
            response = await api.get('/jasa/search', {
                params: {
                    keyword: keyword,
                    page: pageTarget,
                    limit: currentLimit
                }
            });
        } else {
            response = await api.get('/jasa', {
                params: {
                    page: pageTarget,
                    limit: currentLimit
                }
            });
        }

        const resBody = response.data;
        const rawData = resBody?.Data || resBody?.data || (Array.isArray(resBody) ? resBody : []);
        listJasa.value = rawData;

        const meta = resBody?.Meta || resBody?.meta;
        if (meta) {
            pagination.value.current_page = meta.CurrentPage || meta.current_page || pageTarget;
            pagination.value.limit = meta.PageSize || meta.limit || currentLimit;
            pagination.value.total_data = meta.TotalRows || meta.total_data || 0;
            pagination.value.total_page = meta.TotalPages || meta.total_page || 1;
        } else {
            pagination.value.current_page = pageTarget;
            pagination.value.total_data = rawData.length;
            pagination.value.total_page = Math.ceil(rawData.length / currentLimit) || 1;
        }
    } catch (error) {
        console.error("Gagal memuat data master jasa:", error);
        listJasa.value = [];
    }
};

const changePage = (page) => {
    if (page >= 1 && page <= pagination.value.total_page) {
        fetchJasa(page, searchQuery.value);
    }
};

const openModalAdd = () => {
    isEditMode.value = false;
    form.value = initialFormState();
    form.value.created_by = getCashierName();
    isModalOpen.value = true;
};

const openModalEdit = (jasa, index) => {
    isEditMode.value = true;
    selectedIndex.value = index;
    form.value = JSON.parse(JSON.stringify(jasa));
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    form.value = initialFormState();
};

const saveJasa = async () => {
    try {
        calculateKomisi();
        const payload = {
            nama_jasa: form.value.nama_jasa,
            tarif_jasa: form.value.tarif_jasa,
            presentasi_komisi: form.value.presentasi_komisi,
            komisi_mekanik: form.value.komisi_mekanik,
            created_by: form.value.created_by || getCashierName()
        };

        if (isEditMode.value) {
            await api.put(`/jasa/${form.value.id_jasa}`, payload);
            showAlert('Data master jasa berhasil diperbarui!');
        } else {
            await api.post('/jasa', payload);
            showAlert('Data jasa baru berhasil ditambahkan!');
        }

        closeModal();
        fetchJasa(pagination.value.current_page);
    } catch (error) {
        console.error("Gagal menyimpan data jasa:", error);
        const backendMessage = error.response?.data?.message || error.response?.data?.error || 'Gagal menyimpan data.';
        showAlert(backendMessage, 'error');
    }
};

const deleteJasa = async (jasa) => {
    const idJasa = jasa.id_jasa || jasa.IdJasa;
    if (!idJasa) {
        showAlert('Gagal menghapus: ID jasa tidak ditemukan.', 'error');
        return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus data jasa "${jasa.nama_jasa || jasa.NamaJasa}"?`)) {
        try {
            await api.delete(`/jasa/${idJasa}`);
            showAlert('Data master jasa berhasil dihapus.', 'success');
            fetchJasa(listJasa.value.length === 1 && pagination.value.current_page > 1 ? pagination.value.current_page - 1 : pagination.value.current_page);
        } catch (error) {
            console.error("Gagal menghapus data jasa:", error);
            showAlert('Gagal menghapus data dari server.', 'error');
        }
    }
};

onMounted(() => {
    fetchJasa(pagination.value.current_page);
});
</script>

<style scoped>
/* Gunakan style CSS bawaan Anda yang sudah ada */
@import '@/assets/styles/content.css';

.nominal-terbilang {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    font-weight: 500;
    color: #2e7d32; /* Hijau cerah untuk representasi uang */
    font-style: italic;
    background-color: #e8f5e9;
    padding: 6px 10px;
    border-radius: 6px;
    border-left: 3px solid #4caf50;
}

.komisi-color {
    color: #1565c0; /* Biru cerah khusus penanda komisi */
    background-color: #e3f2fd;
    border-left: 3px solid #2196f3;
}
</style>