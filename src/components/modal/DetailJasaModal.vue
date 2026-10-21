<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="modal-box detail-box">
            <div class="modal-header bg-detail">
                <h4><i class='bx bx-receipt'></i> Detail Data Master Jasa</h4>
                <i class='bx bx-x close-icon' @click="$emit('close')"></i>
            </div>

            <div class="modal-body">
                <h5 class="section-title"><i class='bx bx-info-circle'></i> Informasi Jasa & Komisi</h5>
                <table class="table-info-mentah">
                    <tbody>
                        <tr>
                            <td class="label">ID Jasa</td>
                            <td class="titik-dua">:</td>
                            <td class="value"><strong>{{ dataJasa.id_jasa || dataJasa.IdJasa || '-' }}</strong></td>
                        </tr>
                        <tr>
                            <td class="label">Nama Jasa</td>
                            <td class="titik-dua">:</td>
                            <td class="value">{{ dataJasa.nama_jasa || dataJasa.NamaJasa }}</td>
                        </tr>
                        <tr>
                            <td class="label">Tarif Jasa</td>
                            <td class="titik-dua">:</td>
                            <td class="value" style="font-weight: 600; color: #2e7d32;">
                                Rp {{ (dataJasa.tarif_jasa || dataJasa.TarifJasa || 0).toLocaleString('id-ID') }}
                            </td>
                        </tr>
                        <tr>
                            <td class="label">Presentasi Komisi</td>
                            <td class="titik-dua">:</td>
                            <td class="value">{{ dataJasa.presentasi_komisi  || dataJasa.PresentasiKomisi || 0 }}%</td>
                        </tr>
                        <tr>
                            <td class="label">Komisi Mekanik</td>
                            <td class="titik-dua">:</td>
                            <td class="value" style="font-weight: 600; color: #1565c0;">
                                Rp {{ (dataJasa.komisi_mekanik || dataJasa.KomisiMekanik || 0).toLocaleString('id-ID') }}
                            </td>
                        </tr>
                        <tr>
                            <td class="label">Dibuat Oleh</td>
                            <td class="titik-dua">:</td>
                            <td class="value">
                                <span class="badge-creator">{{ dataJasa.created_by || dataJasa.CreatedBy || 'Admin' }}</span>
                            </td>
                        </tr>
                        <tr>
                            <td class="label">Waktu Pembuatan</td>
                            <td class="titik-dua">:</td>
                            <td class="value">
                                <span class="badge-date">{{ formatTanggal(dataJasa.created_at || dataJasa.CreatedAt) }}</span>
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
// Mendefinisikan properti kiriman dari file utama (Parent)
defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    dataJasa: {
        type: Object,
        required: true,
        default: () => ({})
    }
});

// Mendefinisikan event emit untuk menutup modal ke parent
defineEmits(['close']);

// Helper untuk mempercantik tampilan format tanggal di UI detail
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
</style>