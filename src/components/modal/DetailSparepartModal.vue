<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="modal-box detail-box">
            <div class="modal-header bg-detail">
                <h4><i class='bx bx-receipt'></i> Detail Data Master Sparepart</h4>
                <i class='bx bx-x close-icon' @click="$emit('close')"></i>
            </div>

            <div class="modal-body">
                <h5 class="section-title"><i class='bx bx-info-circle'></i> Informasi Detail Produk</h5>
                <table class="table-info-mentah">
                    <tbody>
                        <tr>
                            <td class="label">Kode Sparepart</td>
                            <td class="titik-dua">:</td>
                            <td class="value">
                                <span class="badge-kode">{{ dataSparepart.kode_sparepart || dataSparepart.KodeSparepart || '-' }}</span>
                            </td>
                        </tr>
                        <tr>
                            <td class="label">Nama Sparepart</td>
                            <td class="titik-dua">:</td>
                            <td class="value"><strong>{{ dataSparepart.nama_sparepart || dataSparepart.NamaSparepart }}</strong></td>
                        </tr>
                        <tr>
                            <td class="label">Stok Sekarang</td>
                            <td class="titik-dua">:</td>
                            <td class="value">
                                <span :class="(dataSparepart.stok_sekarang || 0) <= (dataSparepart.stok_minimum || 0) ? 'stok-kritis' : 'stok-normal'">
                                    {{ dataSparepart.stok_sekarang || dataSparepart.StokSekarang || 0 }}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td class="label">Stok Minimum</td>
                            <td class="titik-dua">:</td>
                            <td class="value">{{ dataSparepart.stok_minimum || dataSparepart.StokMinimum || 0 }}</td>
                        </tr>
                        <tr>
                            <td class="label">Harga Beli (HPP)</td>
                            <td class="titik-dua">:</td>
                            <td class="value" style="font-weight: 600; color: #e65100;">
                                Rp {{ (dataSparepart.harga_beli_hpp || dataSparepart.HargaBeliHpp || 0).toLocaleString('id-ID') }}
                            </td>
                        </tr>
                        <tr>
                            <td class="label">Harga Jual</td>
                            <td class="titik-dua">:</td>
                            <td class="value" style="font-weight: 600; color: #2e7d32;">
                                Rp {{ (dataSparepart.harga_jual || dataSparepart.HargaJual || 0).toLocaleString('id-ID') }}
                            </td>
                        </tr>
                        <tr>
                            <td class="label">Lokasi Rak / Lemari</td>
                            <td class="titik-dua">:</td>
                            <td class="value">
                                <span class="badge-rak">{{ dataSparepart.lokasi_rak || dataSparepart.LokasiRak || '-' }}</span>
                            </td>
                        </tr>
                        <tr>
                            <td class="label">Dibuat Oleh</td>
                            <td class="titik-dua">:</td>
                            <td class="value">
                                <span class="badge-creator">{{ dataSparepart.created_by || dataSparepart.CreatedBy || 'Admin' }}</span>
                            </td>
                        </tr>
                        <tr>
                            <td class="label">Waktu Pembuatan</td>
                            <td class="titik-dua">:</td>
                            <td class="value">
                                <span class="badge-date">{{ formatTanggal(dataSparepart.created_at || dataSparepart.CreatedAt) }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn-cancel" @click="$emit('close')">Tutup Detail</button>
            </div>
        </div>
    </div>
</template>

<script setup>
// Mengubah props dari dataJasa menjadi dataSparepart
defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    dataSparepart: {
        type: Object,
        required: true,
        default: () => ({})
    }
});

defineEmits(['close']);

const formatTanggal = (dateStr) => {
    if (!dateStr) return '-';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateStr;
    }
};
</script>

<style scoped>
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
    font-weight: 600;
}

.detail-box {
    width: 480px;
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
    margin-bottom: 16px;
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
    padding: 10px 0;
    border: none;
    font-size: 14px;
    text-align: left;
    vertical-align: middle;
}

.table-info-mentah td.label {
    width: 160px;
    color: #666;
}

.table-info-mentah td.titik-dua {
    width: 20px;
}

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
    font-size: 13px;
    font-weight: 500;
}

.badge-creator {
    background: #e6f4ea;
    color: #137333;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
}

.badge-date {
    background: #e2f0fe;
    color: #1a73e8;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
}

.stok-kritis {
    background-color: #ffebee;
    color: #c62828;
    font-weight: bold;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid #ef9a9a;
}

.stok-normal {
    font-weight: 600;
    color: #333;
}
</style>