<template>
    <main>
        <div class="table-data">
            <div class="order">
                <div class="head">
                    <h3>Data Transaksi Bengkel</h3>
                    <div class="search-container-custom">
                        <input type="text" v-model="searchQuery" @keyup.enter="handleSearchSubmit"
                            placeholder="Cari nama pemilik atau no. polisi..." />
                        <button type="button" class="search-btn-blue" @click="handleSearchSubmit">
                            <i class='bx bx-search'></i>
                        </button>
                    </div>
                    <button class="btn-tambah" @click="openTambahModal">
                        <i class='bx bx-plus'></i> Tambah Transaksi
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
                            <th>No. Polisi</th>
                            <th>Pemilik</th>
                            <th>KM</th>
                            <th>Uang Muka</th>
                            <th>Diskon</th>
                            <th>Metode</th>
                            <th>Catatan</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="listTransaksi.length === 0">
                            <td colspan="10" style="text-align: center; color: #888;">Belum ada data transaksi.</td>
                        </tr>
                        <tr v-for="(trx, index) in listTransaksi" :key="index">
                            <td style="text-align: center; font-weight: 600; color: #666;">
                                {{ ((pagination.current_page - 1) * pagination.limit) + index + 1 }}
                            </td>
                            <td><span class="badge-nopol">{{ trx.no_polisi }}</span></td>

                            <td>
                                <strong>{{ trx.pelanggan?.nama_pelanggan || trx.nama_pelanggan || 'Umum' }}</strong>
                                <br>
                                <small style="color: #777;">{{ trx.pelanggan?.no_hp || trx.telp || '-' }}</small>
                            </td>

                            <td>{{ (trx.km_kendaraan || 0).toLocaleString('id-ID') }} Km</td>
                            <td>Rp {{ (trx.uang_muka || 0).toLocaleString('id-ID') }}</td>
                            <td>Rp {{ (trx.diskon || 0).toLocaleString('id-ID') }}</td>
                            <td><span class="badge-metode">{{ trx.metode_pembayaran }}</span></td>
                            <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                                :title="trx.catatan">
                                {{ trx.catatan || '-' }}
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-detail" @click="openModalDetail(trx)" title="Lihat Detail">
                                        <i class='bx bx-info-circle'></i>
                                    </button>
                                    <button class="btn-edit" @click="openModalEdit(trx, index)" title="Edit Transaksi">
                                        <i class='bx bxs-edit'></i>
                                    </button>
                                    <button class="btn-delete" @click="deleteTransaksi(trx)" title="Hapus Transaksi">
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
                                pagination.total_page }}</strong> (Total: {{ pagination.total_data }} data transaksi)
                        </div>
                        <div class="limit-selector">
                            <label for="limitSelect">Tampilkan:</label>
                            <select id="limitSelect" v-model="pagination.limit" @change="handleLimitChange">
                                <option :value="2">2</option>
                                <option :value="5">5</option>
                                <option :value="10">10</option>
                                <option :value="20">20</option>
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
                <div class="modal-box large-modal">
                    <div class="modal-header">
                        <h4>{{ isEditMode ? 'Edit Transaksi' : 'Tambah Transaksi Baru' }}</h4>
                        <i class='bx bx-x close-icon' @click="closeModal"></i>
                    </div>

                    <form @submit.prevent="saveTransaksi">
                        <div class="modal-body scrollable-body">
                            <input type="hidden" v-model.number="form.id_user" />

                            <h5 class="section-title">Data Kendaraan & Pemilik</h5>
                            <div class="form-row-custom">
                                <div class="form-group flex-1">
                                    <label>Nama Pemilik</label>
                                    <div class="select-wrapper">
                                        <select v-model="form.id_pelanggan" @change="onPelangganChange" required
                                            class="select-custom">
                                            <option :value="null" disabled selected>--- Pilih Pelanggan ---</option>
                                          <option v-for="pelanggan in listPelanggan" :key="pelanggan.id" :value="pelanggan.id">
                                                {{ pelanggan.nama_pelanggan }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group flex-1">
                                    <label>No. Telepon</label>
                                    <input type="text" v-model="form.telp" disabled placeholder="Otomatis terisi..." />
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Alamat</label>
                                <textarea v-model="form.alamat" disabled placeholder="Otomatis terisi..."
                                    rows="2"></textarea>
                            </div>

                            <div class="form-row-custom">
                                <div class="form-group flex-1">
                                    <label>No. Polisi</label>
                                    <input type="text" v-model="form.no_polisi" required
                                        placeholder="Contoh: T 1234 DF" />
                                </div>
                                <div class="form-group flex-1">
                                    <label>KM Kendaraan</label>
                                    <input type="number" v-model.number="form.km_kendaraan" required min="0" />
                                </div>
                            </div>

                            <h5 class="section-title">Mekanik & Finansial</h5>
                            <div class="form-row-custom">
                                <div class="form-group-custom flex-1">
                                    <label>Mekanik Utama</label>
                                    <div class="select-wrapper">
                                        <select v-model="form.id_mekanik" required class="select-custom">
                                            <option value="" disabled selected>--- Pilih Mekanik Utama ---</option>
                                            <option v-for="mekanik in listMekanik" :key="mekanik.id_mekanik"
                                                :value="mekanik.id_mekanik">
                                                {{ mekanik.nama_mekanik }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group flex-1">
                                    <label>Mekanik Pembantu (Opsional)</label>
                                    <div class="select-wrapper">
                                        <select v-model="form.id_mekanik_2" class="select-custom">
                                            <option value="">--- Tidak Ada Mekanik Pembantu ---</option>
                                            <option v-for="mekanik in listMekanik" :key="mekanik.id_mekanik"
                                                :value="mekanik.id_mekanik">
                                                {{ mekanik.nama_mekanik }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="form-row-custom">
                                <div class="form-group flex-1">
                                    <label>Uang Muka (Rp)</label>
                                    <input type="number" v-model.number="form.uang_muka" min="0" />
                                    <small v-if="form.uang_muka" class="nominal-terbilang hpp-color">
                                        {{ angkaKeTerbilang(form.uang_muka) }} Rupiah
                                    </small>
                                </div>
                                <div class="form-group flex-1">
                                    <label>Diskon (Rp)</label>
                                    <input type="number" v-model.number="form.diskon" min="0" />
                                    <small v-if="form.diskon" class="nominal-terbilang jual-color">
                                        {{ angkaKeTerbilang(form.diskon) }} Rupiah
                                    </small>
                                </div>
                            </div>

                            <div class="form-row-custom">
                                <div class="form-group flex-1">
                                    <label>Metode Pembayaran</label>
                                    <div class="select-wrapper">
                                        <select v-model="form.metode_pembayaran" required class="select-custom">
                                            <option value="" disabled selected>--- Pilih Metode ---</option>
                                            <option value="tunai">Tunai</option>
                                            <option value="transfer">Transfer</option>
                                            <option value="debit">Debit</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group flex-1">
                                    <label>Catatan Keluhan</label>
                                    <input type="text" v-model="form.catatan"
                                        placeholder="Keluhan rem berdecit, dll." />
                                </div>
                            </div>

                            <div class="form-row-custom dyn-section">
                                <div class="flex-1">
                                    <h5 class="section-title">
                                        List Jasa
                                        <button type="button" class="btn-add-row" @click="addJasaRow">+</button>
                                    </h5>

                                    <div v-for="(jasa, i) in form.list_jasa" :key="'jasa-form-' + i"
                                        class="dynamic-item" style="gap: 10px; margin-bottom: 8px; display: flex;">
                                        <div class="select-wrapper" style="flex: 2;">
                                            <select v-model="jasa.id_jasa" @change="onJasaChange(i)" required
                                                class="select-custom">
                                                <option value="" disabled selected>--- Pilih Jasa ---</option>
                                                <option v-for="itemJasa in listMasterJasa" :key="itemJasa.id_jasa"
                                                    :value="itemJasa.id_jasa">
                                                    {{ itemJasa.nama_jasa }}
                                                </option>
                                            </select>
                                        </div>

                                        <span class="harga-display"
                                            style="min-width: 80px; font-weight: bold; align-self: center;">
                                            Rp {{ jasa.harga ? jasa.harga.toLocaleString('id-ID') : '0' }}
                                        </span>

                                        <button type="button" class="btn-del-row" @click="removeJasaRow(i)">×</button>
                                    </div>
                                </div>

                                <div class="flex-1">
                                    <h5 class="section-title">
                                        List Sparepart
                                        <button type="button" class="btn-add-row" @click="addSparepartRow">+</button>
                                    </h5>

                                    <div v-for="(sp, i) in form.list_sparepart" :key="'sp-form-' + i"
                                        class="dynamic-item" style="gap: 10px; margin-bottom: 8px; display: flex;">
                                        <div class="select-wrapper" style="flex: 2;">
                                            <select v-model="sp.kode_sparepart" @change="onSparepartChange(i)" required
                                                class="select-custom">
                                                <option value="" disabled selected>--- Pilih Sparepart ---</option>
                                                <option v-for="itemSp in listMasterSparepart"
                                                    :key="itemSp.kode_sparepart" :value="itemSp.kode_sparepart">
                                                    {{ itemSp.nama_sparepart }}
                                                </option>
                                            </select>
                                        </div>
                                        <input type="number" v-model.number="sp.qty" placeholder="Qty" min="1" required
                                            style="width: 60px;" />
                                        <span class="harga-display"
                                            style="min-width: 80px; align-self: center; font-weight: bold;">
                                            Rp {{ sp.harga ? (sp.harga * (sp.qty || 1)).toLocaleString('id-ID') : '0' }}
                                        </span>
                                        <button type="button" class="btn-del-row"
                                            @click="removeSparepartRow(i)">×</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn-cancel" @click="closeModal">Batal</button>
                            <button type="submit" class="btn-save">
                                <i class='bx bx-save'></i> Simpan Transaksi
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <DetailTransaksiModal :isOpen="isDetailModalOpen" :dataFull="selectedTransaksiDetail"
            @close="isDetailModalOpen = false" />
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DetailTransaksiModal from '@/components/modal/DetailTransaksiModal.vue';
import api from '@/services/apiClient';

const isDetailModalOpen = ref(false);
const selectedTransaksiDetail = ref({});
const listTransaksi = ref([]);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedIndex = ref(null);
const searchQuery = ref('');
const listPelanggan = ref([]);
const listMekanik = ref([]);
const isLoadingMekanik = ref(false);
const listMasterJasa = ref([]);
const listMasterSparepart = ref([]);

const pagination = ref({
    current_page: 1,
    limit: 5,
    total_data: 0,
    total_page: 0
});

const alert = ref({ message: '', type: '' });

const formDefault = {
   id_pelanggan: "", // Sinkron dengan <option value="">
    no_polisi: "",
    km_kendaraan: 0,
    id_mekanik: "",   // Jika mekanik juga bermasalah, lakukan hal yang sama
    id_mekanik_2: "",
    id_user: 1, 
    uang_muka: 0,
    diskon: 0,
    metode_pembayaran: "tunai",
    catatan: "",
    list_jasa: [],
    list_sparepart: []
};

const form = ref({ ...formDefault });

const hargaTampilanJasa = ref([]);
const hargaTampilanSparepart = ref([]);

hargaTampilanJasa.value = [];
hargaTampilanSparepart.value = [];

// --- PERBAIKAN UTAMA: Akses properti .value dengan benar ---
const onPelangganChange = () => {
    // Cari data pelanggan di dalam master list berdasarkan id
   const pelangganTerpilih = listPelanggan.value.find((p) => p.id == form.value.id_pelanggan);

    if (pelangganTerpilih) {
        // Otomatis isi data telepon dan alamat ke form tampilan
        form.value.telp = pelangganTerpilih.no_hp || pelangganTerpilih.telp || "";
        form.value.alamat = pelangganTerpilih.alamat || "";

        console.log("Pelanggan Berhasil Dipilih:", pelangganTerpilih);
    } else {
        form.value.telp = "";
        form.value.alamat = "";
    }
};

const fetchMasterPelanggan = async () => {
    try {
        const res = await api.get('/pelanggan');

        // DEBUG 1: Lihat apa isi res.data dari server
        console.log("Isi Response API:", res.data);

        // Coba sesuaikan pengisian data
        if (res.data && res.data.data) {
            listPelanggan.value = res.data.data;
        } else {
            listPelanggan.value = res.data;
        }

        // DEBUG 2: Pastikan listPelanggan terisi
        console.log("Isi listPelanggan setelah diisi:", listPelanggan.value);

    } catch (error) {
        // Jika masuk ke sini, berarti ada masalah koneksi/server (misal 401 Unauthorized atau 404 Not Found)
        console.error("Gagal memuat master data pelanggan:", error);
    }
};

const fetchMasterMekanik = async () => {
    isLoadingMekanik.value = true;
    try {
        const res = await api.get('/mekanik');

        // Sesuaikan dengan response API backend Anda (res.data atau res.data.data)
        listMekanik.value = res.data.data || res.data;
    } catch (error) {
        console.error("Gagal memuat master data mekanik:", error);
    } finally {
        isLoadingMekanik.value = false;
    }
};

const fetchMasterJasa = async () => {
    try {
        const res = await api.get('/jasa'); // Sesuaikan endpoint Anda
        listMasterJasa.value = res.data.data || res.data;
    } catch (error) {
        console.error("Gagal memuat master jasa:", error);
    }
};

const fetchMasterSparepart = async () => {
    try {
        const res = await api.get('/sparepart'); // Sesuaikan endpoint Anda
        listMasterSparepart.value = res.data.data || res.data;
    } catch (error) {
        console.error("Gagal memuat master sparepart:", error);
    }
};

// Lifecycle Hooks untuk memuat data saat component di-load
onMounted(() => {
    fetchTransaksi();
    fetchMasterPelanggan();
    fetchMasterMekanik();
    fetchMasterJasa();
    fetchMasterSparepart();
});

const openTambahModal = () => {
    isEditMode.value = false;
    form.value = JSON.parse(JSON.stringify(formDefault));
    // Gunakan null, jangan dicampur dengan string kosong ""
    form.value.list_jasa = [{ id_jasa: null }];
    form.value.list_sparepart = [{ kode_sparepart: null, qty: 1 }];
    hargaTampilanJasa.value = [0];
    hargaTampilanSparepart.value = [0];
    isModalOpen.value = true;
};

const openModalEdit = (trx, index) => {
    isEditMode.value = true;
    selectedIndex.value = index;
    form.value = JSON.parse(JSON.stringify(trx));

    // Antispasi jika backend menggunakan penamaan 'id' bukan 'id_transaksi'
    if (!form.value.id_transaksi && trx.id) {
        form.value.id_transaksi = trx.id;
    }

    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

// const addJasaRow = () => { form.value.list_jasa.push({ id_jasa: null }); };
const addJasaRow = () => {
    form.value.list_jasa.push({ id_jasa: null }); // Konsisten gunakan null
    hargaTampilanJasa.value.push(0);
};
// const addSparepartRow = () => { form.value.list_sparepart.push({ kode_sparepart: '', qty: 1 }); };
const addSparepartRow = () => {
    form.value.list_sparepart.push({ kode_sparepart: null, qty: 1 }); // Konsisten gunakan null
    hargaTampilanSparepart.value.push(0);
};
// const removeJasaRow = (index) => { form.value.list_jasa.splice(index, 1); };
const removeJasaRow = (index) => {
    form.value.list_jasa.splice(index, 1);
    hargaTampilanJasa.value.splice(index, 1);
};
// const removeSparepartRow = (index) => { form.value.list_sparepart.splice(index, 1); };
const removeSparepartRow = (index) => {
    form.value.list_sparepart.splice(index, 1);
    hargaTampilanSparepart.value.splice(index, 1);
};

const onJasaChange = (index) => {
    const barisJasa = form.value.list_jasa[index];
    const masterTerpilih = listMasterJasa.value.find(
        (item) => item.id_jasa == barisJasa.id_jasa
    );

    if (masterTerpilih) {
        // Simpan harga ke state pembantu, BUKAN ke objek form utama
        hargaTampilanJasa.value[index] = masterTerpilih.harga_satuan || masterTerpilih.harga || masterTerpilih.tarif || 0;
    } else {
        hargaTampilanJasa.value[index] = 0;
    }
};

// FUNGSI LOGIKA SAAT SPAREPART DIPILIH
const onSparepartChange = (index) => {
    const barisSparepart = form.value.list_sparepart[index];
    const masterTerpilih = listMasterSparepart.value.find(
        (item) => item.kode_sparepart == barisSparepart.kode_sparepart
    );

    if (masterTerpilih) {
        // Simpan harga ke state pembantu, BUKAN ke objek form utama
        hargaTampilanSparepart.value[index] = masterTerpilih.harga_jual || masterTerpilih.harga || 0;
    } else {
        hargaTampilanSparepart.value[index] = 0;
    }
};

const handleSearchSubmit = () => { fetchTransaksi(1, searchQuery.value); };
const handleLimitChange = () => { fetchTransaksi(1, searchQuery.value); };
const changePage = (page) => { if (page >= 1 && page <= pagination.value.total_page) fetchTransaksi(page, searchQuery.value); };

const showAlert = (message, type = 'success') => {
    alert.value = { message, type };
    setTimeout(() => { alert.value = { message: '', type: '' }; }, 4000);
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
    return 'Angka terlalu besar';
};

const fetchTransaksi = async (pageTarget = 1, keyword = '') => {
    try {
        const currentLimit = pagination.value.limit || 5;
        const response = await api.get('/transaksi', {
            params: { keyword: keyword, page: pageTarget, limit: currentLimit }
        });
        const resBody = response.data;
        const rawData = resBody?.data || resBody?.Data || [];
        listTransaksi.value = rawData;

        const meta = resBody?.meta || resBody?.Meta;
        if (meta) {
            pagination.value.current_page = meta.current_page || pageTarget;
            pagination.value.limit = meta.limit || currentLimit;
            pagination.value.total_data = meta.total_data || 0;
            pagination.value.total_page = meta.total_page || 1;
        } else {
            pagination.value.current_page = pageTarget;
            pagination.value.total_data = rawData.length;
            pagination.value.total_page = Math.ceil(rawData.length / currentLimit) || 1;
        }
    } catch (error) {
        console.error("Gagal memuat data transaksi:", error);
        listTransaksi.value = [];
    }
};

const openModalDetail = async (trx) => {
    try {
        const idTransaksi = trx.id || trx.id_transaksi;
        if (!idTransaksi) { showAlert('ID Transaksi tidak ditemukan.', 'error'); return; }
        const response = await api.get(`/transaksi/${idTransaksi}`);
        if (response.data && response.data.data) {
            selectedTransaksiDetail.value = response.data.data;
        } else {
            selectedTransaksiDetail.value = { header: { ...trx }, detail_jasa: [], detail_sparepart: [] };
        }
        isDetailModalOpen.value = true;
    } catch (error) {
        selectedTransaksiDetail.value = { header: { ...trx }, detail_jasa: [], detail_sparepart: [] };
        isDetailModalOpen.value = true;
    }
};

const saveTransaksi = async () => {
    try {
        const rawIdPelanggan = form.value.id_pelanggan;
        
        // Validasi dini: jika kosong, null, atau undefined, langsung cegah kirim payload
        if (rawIdPelanggan === "" || rawIdPelanggan === null || rawIdPelanggan === undefined) {
            window.alert("Gagal: Anda belum memilih pelanggan di form!");
            return;
        }
           const idPelanggan = Number(rawIdPelanggan);
        const idUser = form.value.id_user ? Number(form.value.id_user) : 1; 
        const idMekanik = form.value.id_mekanik ? Number(form.value.id_mekanik) : null;

            // Validasi dan bersihkan list_jasa dari nilai null / kosong
            const cleanJasa = form.value.list_jasa
                .filter(jasa => jasa.id_jasa !== null && jasa.id_jasa !== "")
                .map(jasa => ({
                    id_jasa: Number(jasa.id_jasa)
                }));

            // Validasi dan bersihkan list_sparepart dari nilai null / kosong
            const cleanSparepart = form.value.list_sparepart
                .filter(sp => sp.kode_sparepart !== null && sp.kode_sparepart !== "")
                .map(sp => ({
                    kode_sparepart: String(sp.kode_sparepart).trim(),
                    qty: Number(sp.qty || 1)
                }));

       const payload = {
            id_pelanggan: idPelanggan, // Sekarang dijamin berisi angka valid
            no_polisi: form.value.no_polisi ? String(form.value.no_polisi).trim() : "",
            km_kendaraan: Number(form.value.km_kendaraan || 0),
            id_mekanik: idMekanik,
            id_mekanik_2: form.value.id_mekanik_2 ? Number(form.value.id_mekanik_2) : null,
            id_user: idUser,
            uang_muka: Number(form.value.uang_muka || 0),
            diskon: Number(form.value.diskon || 0),
            metode_pembayaran: form.value.metode_pembayaran || "tunai",
            catatan: form.value.catatan || "-",
            list_jasa: cleanJasa,
            list_sparepart: cleanSparepart
        };

            console.log("=== MEMULAI PROSES SIMPAN ===");
            console.log("Payload Terfilter:", JSON.stringify(payload));

            if (!payload.id_pelanggan) {
                window.alert("Gagal: Anda belum memilih pelanggan!");
                return;
            }
        if (!payload.no_polisi) {
            window.alert("Gagal: Nomor Polisi wajib diisi!");
            return;
        }
        if (!payload.id_mekanik) {
            window.alert("Gagal: Mekanik Utama wajib dipilih!");
            return;
        }

        let res;
        if (isEditMode.value) {
            res = await api.put(`/transaksi/${form.value.id_transaksi}`, payload);
        } else {
            res = await api.post('/transaksi', payload);
        }

        console.log("Respon Berhasil:", res.data);
        window.alert("Transaksi berhasil disimpan ke database!");
        closeModal();

        fetchTransaksi();

    } catch (error) {
        console.error("=== DETAIL ERROR BACKEND ===");
        if (error.response) {
            console.error("Status Code:", error.response.status);
            console.error("Pesan Validasi Laravel:", error.response.data);

            // Mengambil pesan error detail dari Laravel jika ada (struktur error.response.data.errors)
            const errors = error.response.data.errors;
            let pesanServer = error.response.data.message || "Terjadi kesalahan validasi.";

            if (errors) {
                pesanServer = Object.values(errors).flat().join("\n");
            }

            window.alert(`Gagal Menyimpan!\n\nDetail Error:\n${pesanServer}`);
        } else {
            console.error("Network Error:", error.message);
            window.alert("Gagal menyimpan: Masalah jaringan atau server mati.");
        }
    }
};
</script>

<style scoped>
@import '@/assets/styles/content.css';

.flex-1 {
    flex: 1;
}

.form-row-custom {
    display: flex;
    gap: 15px;
    margin-bottom: 10px;
}

.section-title {
    margin: 15px 0 10px 0;
    font-size: 14px;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.badge-nopol {
    background-color: #333;
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    font-family: monospace;
    font-weight: bold;
}

.badge-metode {
    background-color: #e3f2fd;
    color: #0d47a1;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
    font-size: 11px;
    font-weight: bold;
}

.large-modal {
    max-width: 700px;
    width: 90%;
}

.scrollable-body {
    max-height: 70vh;
    overflow-y: auto;
    padding-right: 5px;
}

.dynamic-item {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    align-items: center;
}

.dynamic-item input {
    flex: 1;
    padding: 6px;
}

.btn-add-row {
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    width: 24px;
    height: 24px;
    cursor: pointer;
}

.btn-del-row {
    background: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    font-weight: bold;
}

.dyn-section {
    background: #f9f9f9;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #eee;
    margin-top: 15px;
}

.nominal-terbilang {
    display: block;
    margin-top: 4px;
    font-size: 11px;
    font-style: italic;
    padding: 4px 8px;
    border-radius: 4px;
}

.hpp-color {
    color: #e65100;
    background-color: #fff3e0;
}

.jual-color {
    color: #1b5e20;
    background-color: #e8f5e9;
}

.alert {
    padding: 12px;
    margin-bottom: 20px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
}

.success-alert {
    background-color: #e8f5e9;
    color: #2e7d32;
    border: 1px solid #a5d6a7;
}

.error-alert {
    background-color: #ffebee;
    color: #c62828;
    border: 1px solid #ef9a9a;
}

textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none;
}

/* Pembungkus utama form group */
.form-group-custom {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Label Input */
.form-group-custom label {
    font-size: 14px;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 6px;
}

/* Pembungkus Select untuk menempatkan panah kustom */
.select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

/* Desain Elemen Select */
.select-custom {
    width: 100%;
    padding: 10px 40px 10px 12px;
    /* Jarak kanan dilebihkan untuk ruang panah */
    font-size: 14px;
    color: #2d3748;
    background-color: #ffffff;
    border: 1px solid #cbd5e0;
    border-radius: 6px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    /* MENGHILANGKAN PANAH BAWAAN BROWSER */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
}

/* Efek Focus saat Select diklik */
.select-custom:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}

/* Ikon Panah Kustom buatan sendiri dengan CSS */
.select-wrapper::after {
    content: "";
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    /* Membuat segitiga kecil menghadap ke bawah */
    border-width: 6px 5px 0 5px;
    border-style: solid;
    border-color: #a0aec0 transparent transparent transparent;
    pointer-events: none;
    /* Klik tembus ke select di bawahnya */
}

/* Perubahan warna panah saat select difokuskan */
.select-wrapper:focus-within::after {
    border-top-color: #3182ce;
}
</style>