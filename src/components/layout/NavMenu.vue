<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-logo">
        <i class="bi bi-shield-check"></i>
      </div>

      <div class="brand-text">
        QLGPLX
        <span class="brand-sub"> Admin Dashboard </span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        active-class="active"
        :class="{ 'no-permission': !hasPermission(item) }"
        @click="handleMenuClick($event, item)"
      >
        <lord-icon
          :src="item.icon"
          trigger="hover"
          delay="100"
          stroke="bold"
          :state="item.state"
          colors="primary:#242424,secondary:#e83a30"
          class="nav-icon"
        >
        </lord-icon>

        <span class="nav-label">
          {{ item.label }}
        </span>

        <i
          v-if="!hasPermission(item)"
          class="bi bi-lock-fill nav-lock"
          title="Bạn không có quyền truy cập chức năng này"
        ></i>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useSidebarStore } from '@/stores/sidebarStore'
import { useAuthStore } from '@/stores/authStore'
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const sidebarStore = useSidebarStore()
const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()

const hasPermission = (item) => {
  if (!item.permission && !item.permissions) return true

  if (item.permission) {
    return authStore.hasPermission(item.permission)
  }

  if (item.permissions) {
    return item.permissions.some((permission) => authStore.hasPermission(permission))
  }

  return true
}

const handleMenuClick = (event, item) => {
  if (!hasPermission(item)) {
    event.preventDefault()
    return
  }

  router.push(item.path)
}

const menuItems = [
  {
    path: '/',
    label: 'TỔNG QUAN',
    icon: 'https://cdn.lordicon.com/zldpstex.json',
    permission: null,
    state: null,
  },
  {
    path: '/cong-dan',
    label: 'CÔNG DÂN',
    icon: 'https://cdn.lordicon.com/rzsnbiaw.json',
    permissions: ['QUAN_LY_HO_SO', 'DUYET_HO_SO'],
    state: 'morph-group',
  },
  {
    path: '/ho-so',
    label: 'HỒ SƠ',
    icon: 'https://cdn.lordicon.com/iubtdgvu.json',
    permissions: ['QUAN_LY_HO_SO', 'DUYET_HO_SO'],
    state: null,
  },
  {
    path: '/ky-thi',
    label: 'KỲ THI',
    icon: 'https://cdn.lordicon.com/noncoqhc.json',
    permission: 'QUAN_LY_KY_THI',
    state: null,
  },
  {
    path: '/ket-qua',
    label: 'KẾT QUẢ',
    icon: 'https://cdn.lordicon.com/aapkxxza.json',
    permission: 'NHAP_KET_QUA_THI',
    state: null,
  },
  {
    path: '/giay-phep',
    label: 'GIẤY PHÉP',
    icon: 'https://cdn.lordicon.com/xvfgwmmv.json',
    permission: 'CAP_GPLX',
    state: null,
  },
  {
    path: '/can-bo',
    label: 'CÁN BỘ',
    icon: 'https://cdn.lordicon.com/xvfgwmmv.json',
    permission: 'QUAN_LY_CAN_BO',
    state: null,
  },
]

onMounted(() => {
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      if (item.classList.contains('no-permission')) return

      const icon = item.querySelector('lord-icon')
      if (icon?.playerInstance) {
        icon.playerInstance.playFromBeginning()
      }
    })
  })
})

watch(
  () => route.path,
  () => {
    setTimeout(() => {
      document.querySelectorAll('.nav-item lord-icon').forEach((icon) => {
        if (icon?.playerInstance) {
          icon.playerInstance.pause()
        }
      })

      const activeItem = document.querySelector('.nav-item.active')
      if (activeItem && !activeItem.classList.contains('no-permission')) {
        const icon = activeItem.querySelector('lord-icon')
        if (icon?.playerInstance) {
          icon.setAttribute('trigger', 'loop')
          icon.playerInstance.playFromBeginning()
        }
      }
    }, 100)
  },
  { immediate: true },
)
</script>
