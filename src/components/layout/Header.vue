<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { useThemeStore } from '@/stores/themeStore'
import { useSidebarStore } from '@/stores/sidebarStore'

const themeStore = useThemeStore()
const sidebarStore = useSidebarStore()

const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const handleLogout = async () => {
  await authStore.logout()

  toastStore.show('Đăng xuất thành công', 'success', 'Thành công')

  router.push('/login')
}
</script>

<template>
  <header class="main-header">
    <div class="header-left">
      <button class="sidebar-toggle" @click="sidebarStore.toggleSidebar()">☰</button>

      <div class="header-breadcrumb">Trang chủ</div>
    </div>

    <div class="header-center">
      <input class="search-input" placeholder="Tìm kiếm..." />
    </div>

    <div class="header-right">
      <button class="header-btn" @click="themeStore.toggleTheme()">
        <lord-icon
          :src="
            themeStore.isDark
              ? 'https://cdn.lordicon.com/sswuvtso.json'
              : 'https://cdn.lordicon.com/gbslybgg.json'
          "
          trigger="loop"
          stroke="bold"
          state="loop-cycle"
          style="width: 28px; height: 28px"
        >
        </lord-icon>
      </button>

      <div class="header-user" @click="toggleDropdown">
        <img class="user-avatar" v-if="authStore.avatar" :src="authStore.avatar" alt="Avatar" />

        <div v-else class="user-avatar">
          {{ authStore.hoTen?.charAt(0)?.toUpperCase() || 'C' }}
        </div>

        <div class="user-info">
          <span class="user-name">{{ authStore.hoTen || authStore.username }}</span>
          <span class="user-role">{{ authStore.canBo?.tenChucVu }}</span>
        </div>

        <div v-if="showDropdown" class="user-dropdown">
          <a href="#">Hồ sơ</a>
          <!-- <a href="#">Cài đặt</a> -->
          <!-- <hr /> -->
          <button class="header-logout-btn" @click="handleLogout">
            <i class="bi bi-box-arrow-right"></i>
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
