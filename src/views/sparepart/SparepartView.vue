<template>
    <main>
        <div class="table-data">
            <div class="order">
                <div class="head">
                    <h3>Data Master Sparepart</h3>
                    <div class="search-container-custom">
                        <input type="text" v-model="searchQuery" @keyup.enter="handleSearchSubmit"
                            placeholder="Cari kode atau nama sparepart..." />
                        <button type="button" class="search-btn-blue" @click="handleSearchSubmit">
                            <i class='bx bx-search'></i>
                        </button>
                    </div>
                    <button class="btn-tambah" @click="openModalAdd">
                        <i class='bx bx-plus'></i> Tambah Sparepart
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
                            <th>Kode</th>
                            <th>Nama Sparepart</th>
                            <th>Stok / Min</th>
                            <th>Harga Beli (HPP)</th>
                            <th>Harga Jual</th>
                            <th>Rak</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="listSparepart.length === 0">
                            <td colspan="8" style="text-align: center; color: #888;">Belum ada data master sparepart.
                            </td>
                        </tr>
                        <tr v-for="(part, index) in listSparepart" :key="index">
                            <td style="text-align: center; font-weight: 600; color: #666;">
                                {{ ((pagination.current_page - 1) * pagination.limit) + index + 1 }}
                            </td>
                            <td><span class="badge-kode">{{ part.kode_sparepart || part.KodeSparepart }}</span></td>
                            <td><strong>{{ part.nama_sparepart || part.NamaSparepart }}</strong></td>
                            <td>
                                <span
                                    :class="(part.stok_sekarang || part.StokSekarang || 0) <= (part.stok_minimum || part.StokMinimum || 0) ? 'stok-kritis' : ''">
                                    {{ part.stok_sekarang || part.StokSekarang || 0 }}
                                </span>
                                <span style="color: #999; font-size: 11px;"> / Min: {{ part.stok_minimum ||
                                    part.StokMinimum || 0 }}</span>
                            </td>
                            <td>Rp {{ (part.harga_beli_hpp || part.HargaBeliHpp || 0).toLocaleString('id-ID') }}</td>
                            <td>Rp {{ (part.harga_jual || part.HargaJual || 0).toLocaleString('id-ID') }}</td>
                            <td><span class="badge-rak">{{ part.lokasi_rak || part.LokasiRak || '-' }}</span></td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-detail" @click="openModalDetail(part)" title="Lihat Detail">
                                        <i class='bx bx-info-circle'></i>
                                    </button>
                                    <button class="btn-edit" @click="openModalEdit(part, index)">
                                        <i class='bx bxs-edit'></i>
                                    </button>
                                    <button class="btn-delete" @click="deleteSparepart(part)">
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
                                pagination.total_page }}</strong> (Total: {{ pagination.total_data }} data sparepart)
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
                        <h4>{{ isEditMode ? 'Edit Data Sparepart' : 'Tambah Sparepart Baru' }}</h4>
                        <i class='bx bx-x close-icon' @click="closeModal"></i>
                    </div>

                    <form @submit.prevent="saveSparepart">
                        <div class="modal-body">
                            <div v-if="alert.message"
                                :class="['alert', alert.type === 'success' ? 'success-alert' : 'error-alert']">
                                <i :class="alert.type === 'success' ? 'bx bx-check-circle' : 'bx bx-error-circle'"></i>
                                {{ alert.message }}
                            </div>
                            <div class="form-group">
                                <label>Kode Sparepart</label>
                                <input type="text" v-model="form.kode_sparepart" required :disabled="isEditMode"
                                    placeholder="Contoh: BRG-001 / OLI-MPX2" />
                            </div>

                            <div class="form-group">
                                <label>Nama Sparepart</label>
                                <input type="text" v-model="form.nama_sparepart" required
                                    placeholder="Contoh: Oli MPX 2 0.8L" />
                            </div>

                            <div class="form-row-custom">
                                <div class="form-group text-left-side">
                                    <label>Stok Sekarang</label>
                                    <input type="number" v-model.number="form.stok_sekarang" required min="0"
                                        placeholder="0" />
                                </div>
                                <div class="form-group text-right-side">
                                    <label>Stok Minimum</label>
                                    <input type="number" v-model.number="form.stok_minimum" required min="0"
                                        placeholder="0" />
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Harga Beli / HPP (Rp)</label>
                                <input type="number" v-model.number="form.harga_beli_hpp" required min="0"
                                    placeholder="Contoh: 45000" />
                                <small v-if="form.harga_beli_hpp" class="nominal-terbilang hpp-color">
                                    <i class='bx bx-money'></i> {{ angkaKeTerbilang(form.harga_beli_hpp) }} Rupiah
                                </small>
                            </div>

                            <div class="form-group">
                                <label>Harga Jual (Rp)</label>
                                <input type="number" v-model.number="form.harga_jual" required min="0"
                                    placeholder="Contoh: 55000" />
                                <small v-if="form.harga_jual" class="nominal-terbilang jual-color">
                                    <i class='bx bx-money-withdraw'></i> {{ angkaKeTerbilang(form.harga_jual) }} Rupiah
                                </small>
                            </div>

                            <div class="form-group">
                                <label>Lokasi Rak / Lemari</label>
                                <input type="text" v-model="form.lokasi_rak" placeholder="Contoh: A-1 / RAK-OLI" />
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn-cancel" @click="closeModal">Batal</button>
                            <button type="submit" class="btn-save">
                                <i class='bx bx-save'></i> Simpan Sparepart
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
        <DetailSparepartModal :isOpen="isDetailModalOpen" :dataSparepart="selectedSparepartDetail"
            @close="isDetailModalOpen = false" />
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DetailSparepartModal from '@/components/modal/DetailSparepartModal.vue'; 
import api from '@/services/apiClient';

const isDetailModalOpen = ref(false);
const selectedSparepartDetail = ref({});

const listSparepart = ref([]);
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

const openModalDetail = (part) => {
    selectedSparepartDetail.value = JSON.parse(JSON.stringify(part));
    isDetailModalOpen.value = true;
};

const alert = ref({ message: '', type: '' });

const handleSearchSubmit = () => {
    fetchSparepart(1, searchQuery.value);
};

const handleLimitChange = () => {
    fetchSparepart(1, searchQuery.value);
};

// PERBAIKAN: Mengganti stok_barang dengan stok_sekarang pada initial state form
const initialFormState = () => ({
    kode_sparepart: '',
    nama_sparepart: '',
    stok_sekarang: 0,
    stok_minimum: 0,
    harga_beli_hpp: 0,
    harga_jual: 0,
    locations_rak: '',
    lokasi_rak: '',
    created_by: ''
});
const form = ref(initialFormState());

const showAlert = (message, type = 'success') => {
    alert.value = { message, type };
    setTimeout(() => { alert.value = { message: '', type: '' }; }, 4000);
};

const getCashierName = () => {
    const savedUsername = localStorage.getItem('username');
    return savedUsername ? savedUsername : 'Admin';
};

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

const fetchSparepart = async (pageTarget = 1, keyword = '') => {
    try {
        let response;
        const currentLimit = pagination.value.limit || 5;

        if (keyword.trim() !== '') {
            response = await api.get('/sparepart/search', {
                params: { keyword: keyword, page: pageTarget, limit: currentLimit }
            });
        } else {
            response = await api.get('/sparepart', {
                params: { page: pageTarget, limit: currentLimit }
            });
        }

        const resBody = response.data;
        const rawData = resBody?.Data || resBody?.data || (Array.isArray(resBody) ? resBody : []);
        listSparepart.value = rawData;

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
        console.error("Gagal memuat data sparepart:", error);
        listSparepart.value = [];
    }
};

const changePage = (page) => {
    if (page >= 1 && page <= pagination.value.total_page) {
        fetchSparepart(page, searchQuery.value);
    }
};

const openModalAdd = () => {
    isEditMode.value = false;
    form.value = initialFormState();
    form.value.created_by = getCashierName();
    isModalOpen.value = true;
};

const openModalEdit = (part, index) => {
    isEditMode.value = true;
    selectedIndex.value = index;
    
    const clonedPart = JSON.parse(JSON.stringify(part));
    
    // Pastikan properti ID angka dipetakan ke id_sparepart
    clonedPart.id_sparepart = clonedPart.id_sparepart || clonedPart.IdSparepart || clonedPart.id || clonedPart.Id;
    
    form.value = clonedPart;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    form.value = initialFormState();
};

const saveSparepart = async () => {
    try {
        const hargaBeli = parseInt(form.value.harga_beli_hpp) || 0;
        const hargaJual = parseInt(form.value.harga_jual) || 0;

        if (hargaJual < hargaBeli) {
            showAlert('Gagal menyimpan! Harga jual tidak boleh lebih rendah dari harga beli (HPP).', 'error');
            return; 
        }

        // Ambil string kode unik untuk dimasukkan ke URL parameter
        const urlParameterKode = form.value.kode_sparepart || form.value.KodeSparepart;

        if (!urlParameterKode) {
            showAlert('Gagal memperbarui! Kode sparepart tidak ditemukan pada data form.', 'error');
            return;
        }

        // Siapkan data body request (Payload)
        const payload = {
            nama_sparepart: form.value.nama_sparepart,
            stok_sekarang: parseInt(form.value.stok_sekarang) || 0,
            stok_minimum: parseInt(form.value.stok_minimum) || 0,
            harga_beli_hpp: hargaBeli,
            harga_jual: hargaJual,
            lokasi_rak: form.value.lokasi_rak,
            created_by: form.value.created_by || getCashierName()
        };

        console.log(form.value.kode_sparepart,'data check')

        if (isEditMode.value) {
            // Mengirim ke /api/v1/sparepart/OLI-YML-1L
          await api.put(`/sparepart/${form.value.kode_sparepart}`, payload);
            showAlert('Data sparepart berhasil diperbarui!');
        } else {
            // Jika Tambah Baru, kode_sparepart wajib dimasukkan ke dalam body request
            payload.kode_sparepart = urlParameterKode;
            await api.post('/sparepart', payload);
            showAlert('Sparepart baru berhasil ditambahkan!');
        }

        closeModal();
        fetchSparepart(pagination.value.current_page);
    } catch (error) {
        console.error("Gagal menyimpan data:", error);
        const backendMessage = error.response?.data?.message || error.response?.data?.error || 'Gagal menyimpan data.';
        showAlert(backendMessage, 'error');
    }
};
const deleteSparepart = async (part) => {
    // Antisipasi jika properti menggunakan nama snake_case atau CamelCase
    const kode = part.kode_sparepart || part.KodeSparepart;
    
    if (!kode) {
        showAlert('Gagal menghapus! Kode sparepart tidak valid atau tidak ditemukan.', 'error');
        return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus sparepart "${part.nama_sparepart || part.NamaSparepart}"?`)) {
        try {
            // Gunakan encodeURIComponent agar karakter seperti '-' atau '/' aman dikirim lewat URL
            await api.delete(`/sparepart/${encodeURIComponent(kode)}`);
            
            showAlert('Data sparepart berhasil dihapus.', 'success');
            
            // Refresh data tabel
            fetchSparepart(listSparepart.value.length === 1 && pagination.value.current_page > 1 
                ? pagination.value.current_page - 1 
                : pagination.value.current_page
            );
        } catch (error) {
            console.error("Gagal menghapus suku cadang:", error);
            const backendMessage = error.response?.data?.message || error.response?.data?.error || 'Gagal menghapus data dari server.';
            showAlert(backendMessage, 'error');
        }
    }
};

onMounted(() => {
    fetchSparepart(pagination.value.current_page);
});
</script>

<style scoped>
@import '@/assets/styles/content.css';

/* Desain Form Baris Ganda Custom */
.form-row-custom {
    display: flex;
    gap: 15px;
}

.text-left-side,
.text-right-side {
    flex: 1;
}

/* Penanda Stok Kritis */
.stok-kritis {
    background-color: #ffffe0;
    color: #d32f2f;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px dashed #d32f2f;
}

/* Badges */
.badge-kode {
    background-color: #f1f3f5;
    color: #495057;
    padding: 4px 8px;
    border-radius: 4px;
    font-family: monospace;
    font-weight: 600;
}

.badge-rak {
    background-color: #e3f2fd;
    color: #0d47a1;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
}

/* Style Info Terbilang Huruf di Bawah Inputan */
.nominal-terbilang {
    display: block;
    margin-top: 6px;
    font-size: 11px;
    font-weight: 500;
    font-style: italic;
    padding: 6px 10px;
    border-radius: 6px;
}

.hpp-color {
    color: #e65100;
    background-color: #fff3e0;
    border-left: 3px solid #ff9800;
}

.jual-color {
    color: #1b5e20;
    background-color: #e8f5e9;
    border-left: 3px solid #4caf50;
}

/* Style Dasar Alert */
.alert {
    padding: 12px 16px;
    margin-bottom: 20px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    font-size: 14px;
    animation: fadeIn 0.3s ease-in-out;
}

/* Style Khusus Jika Sukses (Hijau) */
.success-alert {
    background-color: #e8f5e9;
    color: #2e7d32;
    border: 1px solid #a5d6a7;
}

/* Style Khusus Jika Error/Gagal (Merah) */
.error-alert {
    background-color: #ffebee;
    color: #c62828;
    border: 1px solid #ef9a9a;
}

.alert i {
    font-size: 18px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>