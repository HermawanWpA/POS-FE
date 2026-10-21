import {
  createRouter,
  createWebHistory
} from 'vue-router';

const routes = [{
    path: '/login',
    name: 'login',
    // PENTING: Pastikan rute login berada di tingkat paling atas, BUKAN di dalam children dashboard!
    component: () => import('../views/auth/LoginView.vue'),
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/dashboard',
    component: () => import('../layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true
    }, // Semua rute di dalam sini butuh token
    children: [{
        path: '',
        name: 'dashboard-home',
        component: () => import('../views/dashboard/DashboardView.vue')
      },
      {
        path: 'tambah-user',
        name: 'tambah-user',
        component: () => import('../views/dashboard/TambahUserView.vue'),
        meta: {
          requiresAdmin: true
        } // Khusus admin
      },
      {
        path: 'pelanggan',
        name: 'pelanggan-manage',
        // PERBAIKAN PATH: Sekarang mengarah ke folder customer
        component: () => import('../views/customer/PelangganView.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'mekanik',
        name: 'mekanik-manage',
        // PERBAIKAN PATH: Sekarang mengarah ke folder customer
        component: () => import('../views/mekanik/MekanikView.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'jasa',
        name: 'jasa-manage',
        // PERBAIKAN PATH: Sekarang mengarah ke folder customer
        component: () => import('../views/jasa/JasaView.vue'),
        meta: {
          requiresAuth: true
        }
      },
        {
        path: 'sparepart',
        name: 'sparepart-manage',
        // PERBAIKAN PATH: Sekarang mengarah ke folder customer
        component: () => import('../views/sparepart/SparepartView.vue'),
        meta: {
          requiresAuth: true
        }
      },
        {
        path: 'transaksi',
        name: 'transaksi-manage',
        // PERBAIKAN PATH: Sekarang mengarah ke folder customer
        component: () => import('../views/transaksi/TransaksiView.vue'),
        meta: {
          requiresAuth: true
        }
      },
      // {
      //   path: 'my-store',
      //   name: 'my-store',
      //   component: () => import('../views/dashboard/MyStoreView.vue')
      // }
    ]
  },
  // Jika mengetik URL asal atau kosong, arahkan otomatis ke login
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// ====================================================================
// CORE FIX: LOGIKA NAVIGATION GUARD YANG JAUH LEBIH KETAT & AMAN
// ====================================================================
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); //

  // LOGIKA 1: Jika halaman yang dituju memuat aturan 'requiresAuth' (Dashboard dll)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Tapi ternyata TOKEN TIDAK ADA
    if (!token) {
      // Langsung tendang ke login, JANGAN memunculkan errorMessage di form login dulu!
      return next({
        name: 'login'
      });
    }

    // Tapi jika TOKEN ADA, dan halaman tersebut butuh 'requiresAdmin'
    if (to.matched.some(record => record.meta.requiresAdmin) && userRole !== 'admin') {
      alert('Akses ditolak: Hanya Admin yang dapat mengakses halaman ini!');
      return next({
        name: 'dashboard-home'
      }); // Kembalikan ke halaman utama dashboard
    }
  }

  // LOGIKA 2: Jika pengguna mau ke halaman khusus tamu (/login) tapi dia SUDAH LOGIN (punya token)
  if (to.matched.some(record => record.meta.requiresGuest) && token) {
    return next({
      name: 'dashboard-home'
    }); // Buat apa login lagi? Lempar ke dashboard
  }

  // JIKA TIDAK MEMENUHI KONDISI DI ATAS (Bebas Akses / Halaman Login sewaktu belum punya token)
  next();
});

export default router;