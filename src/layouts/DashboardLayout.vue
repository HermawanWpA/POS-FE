<template>
    <div :class="{ dark: isDarkMode }">
        <section id="sidebar" :class="{ hide: isSidebarHidden }">
            <a href="#" class="brand">
                <i class='bx bxs-smile bx-lg'></i>
                <span class="text">AdminHub</span>
            </a>
            <ul class="side-menu top">
                <li :class="{ active: $route.path === '/dashboard' }">
                    <router-link to="/dashboard">
                        <i class='bx bxs-dashboard bx-sm'></i>
                        <span class="text">Dashboard</span>
                    </router-link>
                </li>
                <li :class="{ active: $route.name === 'pelanggan-manage' }">
                    <router-link :to="{ name: 'pelanggan-manage' }">
                        <i class='bx bxs-user-detail bx-sm'></i>
                        <span class="text">Customer</span>
                    </router-link>
                </li>
                <li :class="{ active: $route.name === 'mekanik-manage' }">
                    <router-link :to="{ name: 'mekanik-manage' }">
                        <i class='bx bxs-wrench bx-sm'></i>
                        <span class="text">Mekanik</span>
                     </router-link>
                </li>
               <li :class="{ active: $route.name === 'jasa-manage' }">
                    <router-link :to="{ name: 'jasa-manage' }">
                        <i class='bx bxs-briefcase bx-sm'></i>
                        <span class="text">Master Jasa</span>
                    </router-link>
                </li>

                 <li :class="{ active: $route.name === 'sparepart-manage' }">
                    <router-link :to="{ name: 'sparepart-manage' }">
                        <i class='bx bxs-component bx-sm'></i>
                        <span class="text">Master Sparepart</span>
                     </router-link>
                </li>

                 <li :class="{ active: $route.name === 'transaksi-manage' }">
                    <router-link :to="{ name: 'transaksi-manage' }">
                        <i class='bx bxs-wallet bx-sm'></i>
                        <span class="text">Transaksi</span>
                    </router-link>
                </li>
                <!-- <li>
                    <a href="#">
                        <i class='bx bxs-doughnut-chart bx-sm'></i>
                        <span class="text">Analytics</span>
                    </a>
                </li> -->

                <li v-if="userRole === 'admin'" :class="{ active: $route.path === '/dashboard/tambah-user' }">
                    <router-link to="/dashboard/tambah-user">
                        <i class='bx bxs-user-plus bx-sm'></i>
                        <span class="text">Tambah User</span>
                    </router-link>
                </li>
            </ul>
            <ul class="side-menu bottom">
                <li>
                    <a href="#">
                        <i class='bx bxs-cog bx-sm bx-spin-hover'></i>
                        <span class="text">Settings</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="logout" @click.prevent="handleLogout">
                        <i class='bx bx-power-off bx-sm bx-burst-hover'></i>
                        <span class="text">Logout</span>
                    </a>
                </li>
            </ul>
        </section>

        <section id="content">
            <nav>
                <i class='bx bx-menu bx-sm' @click="toggleSidebar"></i>
                <a href="#" class="nav-link">Categories</a>
                <form action="#" :class="{ show: isSearchShow }">
                    <div class="form-input">
                        <input type="search" placeholder="Search...">
                        <button type="button" class="search-btn" @click="toggleSearch">
                            <i class='bx' :class="isSearchShow ? 'bx-x' : 'bx-search'"></i>
                        </button>
                    </div>
                </form>

                <input type="checkbox" class="checkbox" id="switch-mode" hidden v-model="isDarkMode" />
                <label class="swith-lm" for="switch-mode">
                    <i class="bx bxs-moon"></i>
                    <i class="bx bx-sun"></i>
                    <div class="ball"></div>
                </label>

                <a href="#" class="notification" @click.stop="toggleMenu('notification')">
                    <i class='bx bxs-bell bx-tada-hover'></i>
                    <span class="num">8</span>
                </a>
                <div class="notification-menu" :class="{ show: activeMenu === 'notification' }">
                    <ul>
                        <li>New message from John</li>
                        <li>Your order has been shipped</li>
                        <li>Reminder: Meeting at 3PM</li>
                    </ul>
                </div>

                <a href="#" class="profile" @click.stop="toggleMenu('profile')">
                    <img src="../assets/images/icons.png" alt="Profile">
                </a>
                <div class="profile-menu" :class="{ show: activeMenu === 'profile' }">
                    <ul>
                        <li><a href="#">My Profile</a></li>
                        <li><a href="#" @click.prevent="handleLogout">Log Out</a></li>
                    </ul>
                </div>
            </nav>

            <RouterView />
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// State Reaktif
const isSidebarHidden = ref(false);
const isSearchShow = ref(false);
const isDarkMode = ref(false);
const activeMenu = ref(null); // 'notification' | 'profile' | null
const userRole = ref('');

const toggleSidebar = () => {
    isSidebarHidden.value = !isSidebarHidden.value;
};

const toggleSearch = (e) => {
    if (window.innerWidth < 768) {
        e.preventDefault();
        isSearchShow.value = !isSearchShow.value;
    }
};

const toggleMenu = (menuName) => {
    activeMenu.value = activeMenu.value === menuName ? null : menuName;
};

const closeAllMenus = () => {
    activeMenu.value = null;
};

const handleResize = () => {
    if (window.innerWidth <= 576) {
        isSidebarHidden.value = true;
    } else {
        isSidebarHidden.value = false;
    }
};

const handleLogout = () => {
    // 1. Jalankan fungsi logout di Pinia (Hapus token)
    authStore.logout();

    // 2. Bersihkan sisa data role di local storage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // 3. Tendang user kembali ke halaman Login dengan membawa pesan sukses
    router.push({ path: '/login', query: { logout: 'success' } });
};

// Lifecycle Hooks disatukan di sini agar efisien dan rapi
onMounted(() => {
    handleResize();

    // Ambil data role saat layout dashboard dimuat
    userRole.value = localStorage.getItem('role') || '';

    window.addEventListener('resize', handleResize);
    window.addEventListener('click', closeAllMenus);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('click', closeAllMenus);
});
</script>

<style>
/* Memanggil file asset stylesheet dashboard */
@import '../assets/styles/dashboard.css';
</style>