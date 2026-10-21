<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="modal-box detail-box">
            <div class="modal-header bg-detail">
                <h4><i class='bx bxs-user-detail'></i> Detail Pelanggan & Kendaraan</h4>
                <i class='bx bx-x close-icon' @click="$emit('close')"></i>
            </div>

            <div class="modal-body">
                <h5 class="section-title"><i class='bx bxs-user'></i> Data Diri</h5>
                <table class="table-info-mentah">
                    <tbody>
                        <tr>
                            <td class="label">Nama Pelanggan</td>
                            <td class="titik-dua">:</td>
                            <td class="value"><strong>{{ dataPelanggan.nama_pelanggan }}</strong></td>
                        </tr>
                        <tr>
                            <td class="label">No. Handphone</td>
                            <td class="titik-dua">:</td>
                            <td class="value">{{ dataPelanggan.no_hp }}</td>
                        </tr>
                        <tr>
                            <td class="label">Alamat Rumah</td>
                            <td class="titik-dua">:</td>
                            <td class="value">{{ dataPelanggan.alamat }}</td>
                        </tr>
                        <tr>
                            <td class="label">Dibuat Oleh</td>
                            <td class="titik-dua">:</td>
                            <td class="value"><span class="badge-cashier">{{ dataPelanggan.created_by }}</span></td>
                        </tr>
                    </tbody>
                </table>

                <hr class="divider" />

                <h5 class="section-title"><i class='bx bxs-car'></i> Daftar Kendaraan ({{
                    dataPelanggan.kendaraan?.length || 0 }})</h5>

                <div v-if="!dataPelanggan.kendaraan || dataPelanggan.kendaraan.length === 0" class="no-vehicle-alert">
                    * Pelanggan ini belum memiliki data kendaraan terdaftar.
                </div>

                <div v-else class="vehicle-detail-grid">
                    <div v-for="(vch, idx) in dataPelanggan.kendaraan" :key="idx" class="vehicle-card-detail">
                        <div class="card-vehicle-header">
                            <span>Kendaraan #{{ idx + 1 }}</span>
                            <span class="plate-badge">{{ vch.no_polisi }}</span>
                        </div>

                        <table class="table-card-info">
                            <tbody>
                                <tr>
                                    <td>Merek / Tipe</td>
                                    <td>:</td>
                                    <td><strong>{{ vch.merek_tipe }}</strong></td>
                                </tr>
                                <tr>
                                    <td>No. Rangka</td>
                                    <td>:</td>
                                    <td>{{ vch.no_rangka || '-' }}</td>
                                </tr>
                                <tr>
                                    <td>No. Mesin</td>
                                    <td>:</td>
                                    <td>{{ vch.no_mesin || '-' }}</td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn-cancel" @click="$emit('close')">Tutup Detail</button>
            </div>
        </div>
    </div>
</template>

<script setup>
// Mendefinisikan properti kiriman dari file utama (Parent)
defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    dataPelanggan: {
        type: Object,
        required: true,
        default: () => ({})
    }
});

// Mendefinisikan event emit untuk menutup modal ke parent
defineEmits(['close']);
</script>

<style scoped>
/* CSS khusus Modal Detail */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-box {
    background: white;
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.modal-header {
    padding: 16px 24px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-icon {
    font-size: 24px;
    cursor: pointer;
    color: #888;
}

.modal-body {
    padding: 24px;
    overflow-y: auto;
    flex-grow: 1;
}

.modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.btn-cancel {
    background: #eee;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
}

.detail-box {
    width: 700px;
    max-height: 90vh;
}

.bg-detail h4 {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #333;
    margin: 0;
}

.section-title {
    font-size: 14px;
    font-weight: 700;
    color: #3C91E6;
    margin-top: 0;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.table-info-mentah {
    width: 100%;
    margin-bottom: 10px;
    border-collapse: collapse;
}

.table-info-mentah td {
    padding: 6px 0;
    border: none;
    font-size: 14px;
    text-align: left;
}

.table-info-mentah td.label {
    width: 150px;
    color: #666;
}

.table-info-mentah td.titik-dua {
    width: 20px;
}

.badge-cashier {
    background: #FFE0D3;
    color: #FD7238;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
}

.divider {
    border: 0;
    border-top: 1px solid #eee;
    margin: 20px 0;
}

.vehicle-detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 14px;
    margin-top: 10px;
}

.vehicle-card-detail {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 10px;
    padding: 14px;
}

.card-vehicle-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-weight: bold;
    color: #666;
    border-bottom: 1px dashed #ddd;
    padding-bottom: 8px;
    margin-bottom: 10px;
}

.plate-badge {
    background: #3C91E6;
    color: #fff;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 700;
}

.table-card-info {
    width: 100%;
    border-collapse: collapse;
}

.table-card-info td {
    padding: 4px 0;
    border: none;
    font-size: 13px;
    text-align: left;
}

.table-card-info td:first-child {
    color: #777;
    width: 90px;
}

.no-vehicle-alert {
    font-size: 13px;
    color: #dc3545;
    font-style: italic;
    background: #fff5f5;
    padding: 10px;
    border-radius: 6px;
}
</style>