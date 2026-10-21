<template>
    <div v-if="isOpen" class="modal-overlay no-print">
        <div class="modal-box large-box print-container">
            <div class="modal-header no-print">
                <h3><i class='bx bx-printer'></i> Preview Nota Service #{{ dataFull.header?.id_transaksi || '-' }}</h3>
                <i class='bx bx-x close-icon' @click="$emit('close')"></i>
            </div>

            <div class="modal-body font-nota">
                <div class="kop-bengkel">
                    <div class="kop-kiri">
                        <strong>PT HONDA BERMARTABAT</strong><br />
                        <span>Jl. Raya Klari No. 12, Karawang</span><br />
                        <span>Telp. : 0812-3456-7890</span>
                    </div>
                    <div class="kop-tengah">
                        <h2 class="title-nota">NOTA SERVICE</h2>
                    </div>
                </div>
                <hr class="line-double" />

                <div class="metadata-grid">
                    <div class="meta-col">
                        <p><span>No. Faktur</span> : {{ dataFull.header?.id_transaksi || '-' }}</p>
                        <p><span>Tgl. Transaksi</span>: {{ formatTanggal(dataFull.header?.tanggal_transaksi) }}</p>
                        <p>
                            <span>Operator</span> :
                            {{ dataFull.header?.user?.nama_user || '-' }}
                        </p>
                        <p>
                            <span>Mekanik 1</span> :
                            {{ dataFull.header?.mekanik_1?.nama_mekanik || '-' }}
                        </p>
                        <p>
                            <span>Mekanik 2</span> :
                            {{ dataFull.header?.mekanik_2?.nama_mekanik || '-' }}
                        </p>
                    </div>
                    <div class="meta-col">
                        <p><span>Pemilik</span>: {{ dataFull.header?.pelanggan?.nama_pelanggan || 'Umum' }}</p>
                        <p><span>Alamat</span>: {{ dataFull.header?.pelanggan?.alamat || '-' }}</p>
                        <p><span>Telp.</span>: {{ dataFull.header?.pelanggan?.no_hp || '-' }}</p>
                        <p><span>No. Polisi</span>: <strong> {{ dataFull.header?.no_polisi || '-' }}</strong></p>
                        <p><span>KM. Kendaraan</span>: {{ (dataFull.header?.km_kendaraan || 0).toLocaleString('id-ID')
                            }} KM</p>
                    </div>
                </div>

                <table class="nota-table-main">
                    <thead>
                        <tr>
                            <th width="40">No.</th>
                            <th>Nama Part / Jasa Service</th>
                            <th width="60" class="text-center">Qty</th>
                            <th width="120" class="text-right">Harga Satuan</th>
                            <th width="140" class="text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(jasa, index) in dataFull.detail_jasa" :key="'j-detail-' + index">
                            <td class="text-center">{{ index + 1 }}</td>
                            <td>{{ jasa.nama_jasa || `Jasa Service (ID: ${jasa.id_jasa})` }}</td>
                            <td class="text-center">1</td>
                            <td class="text-right">Rp {{ (jasa.harga_penerapan || 0).toLocaleString('id-ID') }}</td>
                            <td class="text-right">Rp {{ (jasa.harga_penerapan || 0).toLocaleString('id-ID') }}</td>
                        </tr>
                        <tr v-for="(sp, index) in dataFull.detail_sparepart" :key="'s-detail-' + index">
                            <td class="text-center">{{ (dataFull.detail_jasa?.length || 0) + index + 1 }}</td>
                            <td>{{ sp.nama_sparepart || sp.kode_sparepart }}</td>
                            <td class="text-center">{{ sp.qty }}</td>
                            <td class="text-right">Rp {{ (sp.harga_satuan || 0).toLocaleString('id-ID') }}</td>
                            <td class="text-right">Rp {{ ((sp.qty || 1) * (sp.harga_satuan ||
                                0)).toLocaleString('id-ID') }}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="nota-billing-container">
                    <div class="info-tambahan">
                        <p v-if="dataFull.header?.catatan"><strong>Catatan:</strong> <br> {{ dataFull.header?.catatan }}
                        </p>
                        <p><strong>Metode Pembayaran:</strong> <span class="badge-pay">{{
                            dataFull.header?.metode_pembayaran?.toUpperCase() || '-' }}</span></p>
                    </div>

                    <div class="billing-wrapper">
                        <div class="bill-row">
                            <span class="lbl">Subtotal</span><span class="dots">:</span>
                            <span class="val">Rp {{ (dataFull.header?.subtotal ||
                                hitungSubtotal()).toLocaleString('id-ID') }}</span>
                        </div>
                        <div class="bill-row">
                            <span class="lbl">Diskon</span><span class="dots">:</span>
                            <span class="val" style="color: #c62828;">- Rp {{ (dataFull.header?.diskon ||
                                0).toLocaleString('id-ID') }}</span>
                        </div>
                        <div class="bill-row">
                            <span class="lbl">Uang Muka</span><span class="dots">:</span>
                            <span class="val">Rp {{ (dataFull.header?.uang_muka || 0).toLocaleString('id-ID') }}</span>
                        </div>
                        <div class="bill-row text-bold">
                            <span class="lbl">Netto</span><span class="dots">:</span>
                            <span class="val">Rp {{ (dataFull.header?.netto || hitungNetto()).toLocaleString('id-ID')
                                }}</span>
                        </div>
                    </div>
                </div>

                <div class="signature-box">
                    <div class="sig-col">
                        <p>Tanda Terima</p>
                        <div class="line-space"></div>
                        <p>( ____________________ )</p>
                    </div>
                    <div class="sig-col text-right">
                        <p>Hormat Kami,</p>
                        <div class="line-space"></div>
                        <p>( ____________________ )</p>
                    </div>
                </div>
            </div>

            <div class="modal-footer no-print">
                <button class="btn-print-thermal" @click="printWindow"><i class='bx bx-printer'></i> Print
                    Dokumen</button>
                <button class="btn-close" @click="$emit('close')">Keluar</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    isOpen: { type: Boolean, required: true },
    dataFull: { type: Object, required: true }
});
defineEmits(['close']);

const formatTanggal = (dateStr) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Fungsi hitung otomatis jika key 'subtotal' tidak dikirim langsung oleh API
const hitungSubtotal = () => {
    const jList = props.dataFull.list_jasa || [];
    const sList = props.dataFull.list_sparepart || [];

    const totalJasa = jList.reduce((acc, curr) => acc + (curr.harga_penerapan || curr.harga || 0), 0);
    const totalSp = sList.reduce((acc, curr) => acc + ((curr.qty || 1) * (curr.harga_satuan || curr.harga_jual || 0)), 0);

    return totalJasa + totalSp;
};

const hitungNetto = () => {
    const sub = props.dataFull.subtotal || hitungSubtotal();
    const diskon = props.dataFull.diskon || 0;
    const dp = props.dataFull.uang_muka || 0;
    return sub - diskon - dp;
};

const printWindow = () => {
    window.print();
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

.modal-box.large-box {
    width: 750px;
    background: white;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
}

.modal-header {
    padding: 14px 20px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    font-size: 16px;
    color: #333;
}

.close-icon {
    font-size: 24px;
    cursor: pointer;
}

.modal-body {
    padding: 24px;
    overflow-y: auto;
    flex-grow: 1;
}

/* Layout Gaya Excel Nota Service */
.font-nota {
    font-family: 'Courier New', Courier, monospace;
    color: #000;
}

.kop-bengkel {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.kop-kiri {
    font-size: 13px;
    line-height: 1.4;
}

.title-nota {
    font-size: 20px;
    font-weight: bold;
    text-decoration: underline;
    margin: 0;
    letter-spacing: 1px;
}

.line-double {
    border: none;
    border-top: 3px double #000;
    margin: 12px 0;
}

.metadata-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    font-size: 13px;
    margin-bottom: 16px;
}

.meta-col p {
    margin: 4px 0;
    display: flex;
}

.meta-col p span {
    width: 130px;
    display: inline-block;
}

.nota-table-main {
    width: 100%;
    border-collapse: collapse;
    margin-top: 14px;
}

.nota-table-main th {
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    background: #e9ecef;
    padding: 6px;
    font-size: 13px;
}

.nota-table-main td {
    padding: 8px 6px;
    border-bottom: 1px dashed #ccc;
    font-size: 13px;
}

.nota-billing-container {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    gap: 20px;
}

.info-tambahan {
    font-size: 12px;
    max-width: 400px;
    text-align: left;
    line-height: 1.4;
}

.badge-pay {
    background: #e2e8f0;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 11px;
}

.billing-wrapper {
    width: 280px;
    font-size: 13px;
}

.bill-row {
    display: flex;
    padding: 4px 0;
}

.bill-row .lbl {
    width: 100px;
}

.bill-row .dots {
    width: 20px;
}

.bill-row .val {
    flex-grow: 1;
    text-align: right;
}

.text-bold {
    font-weight: bold;
    font-size: 14px;
    border-top: 1px solid #000;
    padding-top: 6px;
}

.signature-box {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    font-size: 13px;
}

.sig-col {
    width: 200px;
}

.line-space {
    height: 50px;
}

.modal-footer {
    padding: 12px 20px;
    border-top: 1px solid #ddd;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.btn-close {
    background: #6c757d;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-print-thermal {
    background: #0d6efd;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
}

.text-right {
    text-align: right;
}

.text-center {
    text-align: center;
}

/* CSS PRINT ENGINE ARCHITECTURE */
@media print {
    body * {
        visibility: hidden;
    }

    .print-container,
    .print-container * {
        visibility: visible;
    }

    .print-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        max-height: initial;
        box-shadow: none;
    }

    .no-print {
        display: none !important;
    }

    .modal-body {
        overflow-y: visible !important;
        height: auto !important;
    }
}
</style>