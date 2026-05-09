<script setup>
import { ref } from 'vue'

import { useThemeStore } from '@/stores/themeStore'
import { useSidebarStore } from '@/stores/sidebarStore'

const themeStore = useThemeStore()
const sidebarStore = useSidebarStore()

const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
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
        <div class="user-avatar">A</div>

        <div class="user-info">
          <span class="user-name">Admin</span>
          <span class="user-role">Quản trị viên</span>
        </div>

        <div v-if="showDropdown" class="user-dropdown">
          <a href="#">Hồ sơ</a>
          <a href="#">Cài đặt</a>
          <hr />
          <a href="#">Đăng xuất</a>
        </div>
      </div>
    </div>
  </header>
</template>
