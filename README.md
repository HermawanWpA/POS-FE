# 🛠️ POS Bengkel - Sistem Kasir & Manajemen Bengkel

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green.style=for-the-badge)

**POS Bengkel** adalah aplikasi *Point of Sale* (Kasir) dan sistem manajemen operasional bengkel berbasis web modern. Aplikasi ini dirancang untuk memudahkan pencatatan transaksi servis, pengelolaan stok *sparepart*, serta manajemen data pelanggan dan kendaraan secara efisien dan *real-time*.

---

## ✨ Fitur-Fitur Utama

- 🛒 **Kasir / Point of Sale (POS):** Transaksi penjualan barang (*sparepart*) dan jasa servis cepat dengan kalkulasi otomatis.
- 📦 **Stok & Sparepart:** Pengelolaan inventaris suku cadang, pelacakan jumlah stok, harga beli/jual, serta peringatan stok menipis.
- 🚘 **Manajemen Pelanggan & Kendaraan:** Pencatatan riwayat servis kendaraan pelanggan berdasarkan plat nomor dan pemilik.
- 📊 **Laporan Transaksi:** Ringkasan laporan penjualan harian/bulanan, riwayat transaksi, dan analisis pendapatan bengkel.
- 🔄 **State Management & API Integration:** Pengelolaan *state* aplikasi yang terpusat dan terintegrasi penuh dengan RESTful API backend.

---

## 🛠️ Stack Teknologi

- **Frontend Framework:** [Vue 3](https://vuejs.org/) (Composition API)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Routing:** [Vue Router](https://router.vuejs.org/)
- **HTTP Client:** [Axios](https://axios-http.com/)

---

## ⚙️ Prasyarat Sistem

Sebelum memulai, pastikan perangkat Anda telah terpasang software berikut:

- **Node.js:** v18.x atau versi lebih baru (Direkomendasikan versi LTS)
- **NPM:** v9.x atau versi lebih baru (Bawaan Node.js)

---

## 🚀 Panduan Instalasi & Penggunaan

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek di lingkungan lokal:

### 1. Cloning / Ekstrak Repository
```bash
git clone https://github.com/username/POS_Bengkel.git
cd POS_Bengkel
```

### 2. Instalasi Dependensi
Jalankan perintah berikut untuk menginstal seluruh pustaka yang dibutuhkan:
```bash
npm install
```

### 3. Konfigurasi Environment (`.env`)
Buat berkas `.env` pada direktori utama proyek dan sesuaikan konfigurasi URL API backend Anda:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 4. Menjalankan Mode Pengembang (Development)
Untuk menjalankan server lokal dengan fitur *Hot-Reload*:
```bash
npm run dev
```
Buka *browser* dan akses alamat yang tertera pada terminal (biasanya `http://localhost:5173`).

### 5. Kompilasi untuk Produksi (Build)
Untuk mengompilasi dan mengoptimasi aplikasi saat siap dideploy ke server produksi:
```bash
npm run build
```
Hasil kompilasi akan tersimpan di dalam folder `dist/`.

---

## 📂 Struktur Direktori Proyek

```text
POS_Bengkel/
├── public/                 # Aset statik publik (favicon, logo, dll.)
├── src/
│   ├── assets/             # File media, gambar, dan stylesheet global
│   ├── components/         # Komponen UI Vue yang dapat digunakan ulang (reusable)
│   ├── router/             # Konfigurasi navigasi dan rute aplikasi (Vue Router)
│   ├── stores/             # Pengelolaan state terpusat (Pinia Store)
│   ├── views/              # Halaman utama aplikasi (Dashboard, POS, Stok, Laporan)
│   ├── App.vue             # Root component
│   └── main.js             # Entry point utama aplikasi Vue
├── .env                    # File variabel lingkungan
├── index.html              # Template HTML utama
├── package.json            # Daftar dependensi dan skrip proyek
└── vite.config.js          # Konfigurasi build Vite
```

---

## 💻 Rekomendasi Setup Lingkungan Pengembangan

### Editor / IDE
- **[VS Code](https://code.visualstudio.com/)** + Ekstensi Resmi **[Vue (Official / Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)**.
  > *Catatan:* Nonaktifkan ekstensi Vetur jika sebelumnya terpasang untuk menghindari konflik sintaks.

### Browser & Alat Debugging
- **Chromium-based Browser** (Google Chrome, Microsoft Edge, Brave)
  - Pasang **[Vue.js Devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)** untuk inspeksi komponen dan state.
  - Aktifkan fitur *Custom Object Formatter* di Console DevTools.
- **Mozilla Firefox**
  - Pasang **[Vue.js Devtools for Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)**.

---

## 📄 Lisensi

Proyek ini dilindungi di bawah lisensi [MIT License](LICENSE). Anda bebas untuk menggunakannya, memodifikasi, dan mendistribusikannya kembali sesuai ketentuan lisensi.