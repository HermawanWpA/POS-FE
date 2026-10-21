<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="modal-box detail-box">
            <div class="modal-header bg-detail">
                <h4><i class='bx bxs-user-detail'></i> Detail Data Mekanik</h4>
                <i class='bx bx-x close-icon' @click="$emit('close')"></i>
            </div>

            <div class="modal-body">
                <h5 class="section-title"><i class='bx bxs-user'></i> Profil Mekanik</h5>
                <table class="table-info-mentah">
                    <tbody>
                        <tr>
                            <td class="label">Nama Mekanik</td>
                            <td class="titik-dua">:</td>
                            <td class="value"><strong>{{ dataMekanik.nama_mekanik }}</strong></td>
                        </tr>
                        <tr>
                            <td class="label">No. Handphone</td>
                            <td class="titik-dua">:</td>
                            <td class="value">{{ dataMekanik.no_hp }}</td>
                        </tr>
                        <tr>
                            <td class="label">Status Kerja</td>
                            <td class="titik-dua">:</td>
                            <td class="value">
                                <span :class="['badge-status', formatStatusAktif(dataMekanik.status_aktif) === 'aktif' ? 'status-active' : 'status-inactive']">
                                    {{ formatStatusAktif(dataMekanik.status_aktif) }}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td class="label">Waktu Pendaftaran</td>
                            <td class="titik-dua">:</td>
                            <td class="value">
                                <span class="badge-date">{{ formatTanggal(dataMekanik.created_at) }}</span>
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
const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    dataMekanik: {
        type: Object,
        required: true,
        default: () => ({})
    }
});

// Mendefinisikan event emit untuk menutup modal ke parent
defineEmits(['close']);

// Helper untuk normalisasi status (baik boolean true/false maupun string "Aktif")
const formatStatusAktif = (status) => {
    if (typeof status === 'boolean') {
        return status ? 'Aktif' : 'Tidak Aktif';
    }
    return status || 'Aktif';
};

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
    width: 500px; /* Dipersempit karena data sudah lebih ringkas */
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
    padding: 10px 0; /* Padding agak diperbesar agar baris data lebih renggang dan estetik */
    border: none;
    font-size: 14px;
    text-align: left;
    vertical-align: middle;
}

.table-info-mentah td.label {
    width: 150px;
    color: #666;
}

.table-info-mentah td.titik-dua {
    width: 20px;
}

/* Badge Status */
.badge-status {
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 600;
    border-radius: 20px;
    display: inline-block;
}

.status-active {
    background-color: #d1e7dd;
    color: #0f5132;
    border: 1px solid #badbcc;
}

.status-inactive {
    background-color: #f8d7da;
    color: #842029;
    border: 1px solid #f5c2c7;
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