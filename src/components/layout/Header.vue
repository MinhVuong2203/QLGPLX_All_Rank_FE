<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import api from '@/services/api'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { useThemeStore } from '@/stores/themeStore'
import { useSidebarStore } from '@/stores/sidebarStore'
import { getActiveMenuItem } from '@/utils/navItems'

const themeStore = useThemeStore()
const sidebarStore = useSidebarStore()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const showDropdown = ref(false)
const showProfileModal = ref(false)
const showHoSoSearchModal = ref(false)
const headerSearch = ref('')
const modalSearch = ref('')
const hoSoList = ref([])
const loadingHoSo = ref(false)

const canBo = computed(() => authStore.canBo || {})
const currentNavTitle = computed(() => getActiveMenuItem(route.path).label)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleLogout = async () => {
  await authStore.logout()
  toastStore.success('Đăng xuất thành công')
  router.push('/login')
}

const openProfileModal = () => {
  showDropdown.value = false
  showProfileModal.value = true
}

const closeProfileModal = () => {
  showProfileModal.value = false
}

const loadHoSo = async () => {
  if (hoSoList.value.length) return

  try {
    loadingHoSo.value = true
    const response = await api.get('/api/Hoso')
    hoSoList.value = response.data || []
  } catch (error) {
    console.error(error)
    toastStore.error('Không thể tải danh sách hồ sơ')
  } finally {
    loadingHoSo.value = false
  }
}

const openHoSoSearchModal = async (keyword = '') => {
  showDropdown.value = false
  showHoSoSearchModal.value = true
  modalSearch.value = keyword.trim()
  await loadHoSo()
}

const openHoSoSearchModalFromHeader = () => {
  openHoSoSearchModal(headerSearch.value)
}

const closeHoSoSearchModal = () => {
  showHoSoSearchModal.value = false
}

const filteredHoSo = computed(() => {
  const keyword = modalSearch.value.trim().toLowerCase()
  const list = [...hoSoList.value].sort((a, b) => new Date(b.ngayNop) - new Date(a.ngayNop))

  if (!keyword) return list.slice(0, 12)

  return list
    .filter(
      (hoso) =>
        hoso.tenCongDan?.toLowerCase().includes(keyword) ||
        hoso.cccd?.toLowerCase().includes(keyword) ||
        hoso.maHang?.toLowerCase().includes(keyword) ||
        hoso.tenHang?.toLowerCase().includes(keyword) ||
        String(hoso.hoSoId || '').includes(keyword),
    )
    .slice(0, 20)
})

const formatDate = (value) => {
  if (!value) return 'Chưa cập nhật'
  return new Date(value).toLocaleString('vi-VN')
}

const getStatusClass = (status) => {
  const normalized = status?.toLowerCase()

  if (normalized === 'đã duyệt') return 'approved'
  if (normalized === 'từ chối') return 'rejected'
  if (normalized === 'hoàn thành') return 'completed'

  return 'processing'
}

const goToHoSoPage = () => {
  closeHoSoSearchModal()
  router.push('/ho-so')
}

const goToEditProfile = () => {
  if (!canBo.value.publicId) return
  closeProfileModal()
  router.push(`/can-bo/sua/${canBo.value.publicId}`)
}
</script>

<template>
  <header class="main-header">
    <div class="header-left">
      <button class="sidebar-toggle" @click="sidebarStore.toggleSidebar()">☰</button>
      <div class="header-breadcrumb">{{ currentNavTitle }}</div>
    </div>

    <div class="header-center">
      <div class="header-search">
        <!-- <i class="bi bi-search search-icon"></i> -->
        <input
          v-model="headerSearch"
          class="search-input"
          placeholder="Tìm hồ sơ theo tên, CCCD, hạng GPLX..."
          @focus="openHoSoSearchModalFromHeader"
          @keydown.enter.prevent="openHoSoSearchModalFromHeader"
        />
      </div>
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
        />
      </button>

      <div class="header-user" @click="toggleDropdown">
        <img v-if="authStore.avatar" class="user-avatar" :src="authStore.avatar" alt="Avatar" />

        <div v-else class="user-avatar">
          {{ authStore.hoTen?.charAt(0)?.toUpperCase() || 'C' }}
        </div>

        <div class="user-info">
          <span class="user-name">{{ authStore.hoTen || authStore.username }}</span>
          <span class="user-role">{{ authStore.canBo?.tenChucVu }}</span>
        </div>

        <div v-if="showDropdown" class="user-dropdown">  
          <button class="header-profile-link" @click.stop="openProfileModal">
            <i class="bi bi-person-vcard"></i> 
            Hồ sơ
          </button>
          <button class="header-logout-btn" @click.stop="handleLogout">
            <i class="bi bi-box-arrow-right"></i>
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <div v-if="showProfileModal" class="header-modal-overlay" @click="closeProfileModal">
      <section class="header-hoso-modal header-profile-modal" @click.stop>
        <div class="header-hoso-modal-head">
          <div>
            <span class="header-modal-eyebrow">Thông tin cá nhân</span>
            <h2>Hồ sơ cán bộ</h2>
          </div>
          <button type="button" class="header-modal-close" @click="closeProfileModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="header-profile-body">
          <div class="header-profile-card">
            <img
              v-if="canBo.anh3x4"
              class="header-profile-avatar"
              :src="canBo.anh3x4"
              alt="Ảnh cán bộ"
            />
            <div v-else class="header-profile-avatar">
              {{ canBo.hoTen?.charAt(0)?.toUpperCase() || 'C' }}
            </div>

            <div>
              <h3>{{ canBo.hoTen || 'Chưa cập nhật họ tên' }}</h3>
              <p>{{ canBo.tenChucVu || 'Chưa cập nhật chức vụ' }}</p>
              <span class="header-profile-status">Đang đăng nhập</span>
            </div>
          </div>

          <div class="header-profile-grid">
            <div class="header-profile-field">
              <span>Tài khoản</span>
              <strong>{{ canBo.username || 'Chưa cập nhật' }}</strong>
            </div>
            <div class="header-profile-field">
              <span>Email</span>
              <strong>{{ canBo.email || 'Chưa cập nhật' }}</strong>
            </div>
            <div class="header-profile-field">
              <span>CCCD</span>
              <strong>{{ canBo.cccd || 'Chưa cập nhật' }}</strong>
            </div>
            <div class="header-profile-field">
              <span>Số điện thoại</span>
              <strong>{{ canBo.dienThoai || 'Chưa cập nhật' }}</strong>
            </div>
            <div class="header-profile-field">
              <span>Mã chức vụ</span>
              <strong>{{ canBo.maChucVu || 'Chưa cập nhật' }}</strong>
            </div>
            <div class="header-profile-field">
              <span>Số quyền</span>
              <strong>{{ canBo.quyen?.length || canBo.soQuyen || 0 }}</strong>
            </div>
          </div>

          <div class="header-profile-permissions">
            <span>Quyền truy cập</span>
            <div>
              <em v-if="!canBo.quyen?.length">Chưa có quyền</em>
              <strong v-for="permission in canBo.quyen" v-else :key="permission">
                {{ permission }}
              </strong> 
            </div>
          </div>
        </div>

        <div class="header-modal-footer">
          <span>Thông tin lấy từ tài khoản cán bộ đang đăng nhập</span>
         
        </div>
      </section>
    </div>
  </Teleport>

  <Teleport to="body">
    <div v-if="showHoSoSearchModal" class="header-modal-overlay" @click="closeHoSoSearchModal">
      <section class="header-hoso-modal" @click.stop>
        <div class="header-hoso-modal-head">
          <div>
            <span class="header-modal-eyebrow">Tra cứu nhanh</span>
            <h2>Hồ sơ GPLX</h2>
          </div>
          <button type="button" class="header-modal-close" @click="closeHoSoSearchModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="header-modal-search">
          <i class="bi bi-search"></i>
          <input
            v-model="modalSearch"
            type="text"
            placeholder="Nhập tên công dân, CCCD, mã hồ sơ hoặc hạng GPLX"
            autofocus
          />
        </div>

        <div class="header-modal-body">
          <div v-if="loadingHoSo" class="header-modal-empty">Đang tải hồ sơ...</div>

          <div v-else-if="filteredHoSo.length === 0" class="header-modal-empty">
            Không tìm thấy hồ sơ phù hợp
          </div>

          <div v-else class="header-hoso-list">
            <button
              v-for="hoso in filteredHoSo"
              :key="hoso.hoSoId"
              type="button"
              class="header-hoso-item"
              @click="goToHoSoPage"
            >
              <div class="header-hoso-main">
                <span class="header-hoso-id">#{{ hoso.hoSoId }}</span>
                <strong>{{ hoso.tenCongDan || 'Chưa có tên' }}</strong>
                <span>{{ hoso.cccd || 'Chưa có CCCD' }}</span>
              </div>
              <div class="header-hoso-meta">
                <span class="header-hoso-hang">{{ hoso.maHang }}</span>
                <span class="header-hoso-status" :class="`is-${getStatusClass(hoso.trangThai)}`">
                  {{ hoso.trangThai || 'Chưa cập nhật' }}
                </span>
                <span>{{ formatDate(hoso.ngayNop) }}</span>
              </div>
            </button>
          </div>
        </div>

        <div class="header-modal-footer">
          <span>Hiển thị tối đa 20 kết quả phù hợp</span>
          <button type="button" @click="goToHoSoPage">Mở trang hồ sơ</button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
