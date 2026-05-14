<template>
  <MainLayout>
    <div class="canbo-page">
      <div class="canbo-hero">
        <div>
          <div class="canbo-eyebrow">Quản trị hệ thống</div>
          <h1>Quản lý cán bộ</h1>
          <p>Thêm, cập nhật, khóa tài khoản và phân quyền chức năng cho cán bộ.</p>
        </div>

        <button class="canbo-btn canbo-btn-primary" @click="goCreate">
          <i class="bi bi-person-plus-fill"></i>
          Thêm cán bộ
        </button>
      </div>

      <div class="canbo-toolbar">
        <div class="canbo-search">
          <i class="bi bi-search"></i>
          <input
            v-model="keyword"
            type="text"
            placeholder="Tìm theo họ tên, email, CCCD, username..."
            @keyup.enter="loadData"
          />
        </div>

        <select v-model="trangThai" class="canbo-select" @change="loadData">
          <option value="">Tất cả trạng thái</option>
          <option value="1">Đang hoạt động</option>
          <option value="0">Đã khóa</option>
        </select>

        <button class="canbo-btn canbo-btn-soft" @click="loadData">
          <i class="bi bi-arrow-clockwise"></i>
          Làm mới
        </button>
      </div>

      <div class="canbo-card">
        <div class="canbo-card-header">
          <div>
            <h2>Danh sách cán bộ</h2>
            <p>{{ danhSachLoc.length }} cán bộ được tìm thấy</p>
          </div>
        </div>

        <div v-if="danhSachLoc.length === 0" class="canbo-empty">
          <i class="bi bi-people"></i>
          <h3>Chưa có cán bộ</h3>
          <p>Hãy thêm cán bộ đầu tiên để bắt đầu phân quyền hệ thống.</p>
        </div>

        <div v-else class="canbo-table-wrap">
          <table class="my-table canbo-table">
            <thead>
              <tr>
                <th>Cán bộ</th>
                <th>Chức vụ</th>
                <th>Liên hệ</th>
                <th>Quyền</th>
                <th>Trạng thái</th>
                <th class="text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in danhSachPhanTrang" :key="item.publicId">
                <td>
                  <div class="canbo-user">
                    <div class="canbo-avatar">
                      <img v-if="item.anh3x4" :src="item.anh3x4" alt="Ảnh cán bộ" />
                      <span v-else>
                        {{ Helper.getInitials(item.hoTen) }}
                      </span>
                    </div>

                    <div>
                      <div class="canbo-name">{{ item.hoTen }}</div>
                      <div class="canbo-username">@{{ item.username }}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <span class="canbo-role">
                    {{ item.tenChucVu || 'Chưa có' }}
                  </span>
                </td>

                <td>
                  <div class="canbo-contact">{{ item.email }}</div>
                  <div class="canbo-sub">{{ item.dienThoai || 'Chưa cập nhật' }}</div>
                </td>

                <td>
                  <button class="canbo-permission-pill" @click="goPermission(item)">
                    <i class="bi bi-shield-lock"></i>
                    {{ item.soQuyen }} quyền
                  </button>
                </td>

                <td>
                  <span
                    class="canbo-status"
                    :class="item.trangThai ? 'canbo-status-active' : 'canbo-status-lock'"
                  >
                    {{ item.trangThai ? 'Hoạt động' : 'Đã khóa' }}
                  </span>
                </td>

                <td>
                  <div class="canbo-actions">
                    <button class="canbo-icon-btn" title="Sửa" @click="goEdit(item)">
                      <i class="bi bi-pencil-square"></i>
                    </button>

                    <button class="canbo-icon-btn" title="Phân quyền" @click="goPermission(item)">
                      <i class="bi bi-key-fill"></i>
                    </button>

                    <button
                      class="canbo-icon-btn"
                      :title="item.trangThai ? 'Khóa' : 'Mở khóa'"
                      @click="toggleStatus(item)"
                    >
                      <i :class="item.trangThai ? 'bi bi-lock-fill' : 'bi bi-unlock-fill'"></i>
                    </button>

                    <button
                      class="canbo-icon-btn danger"
                      title="Ngưng hoạt động"
                      @click="askDelete(item)"
                    >
                      <i class="bi bi-trash3-fill"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="danhSachLoc.length > 0" class="canbo-pagination">
          <div class="canbo-pagination-info">
            Hiển thị
            <strong>{{ startIndex + 1 }}</strong>
            -
            <strong>{{ endIndex }}</strong>
            trong tổng số
            <strong>{{ totalItems }}</strong>
            cán bộ
          </div>

          <div class="canbo-pagination-actions">
            <select v-model="pageSize" class="canbo-page-size" @change="changePageSize">
              <option v-for="size in pageSizeOptions" :key="size" :value="size">
                Hiển thị - {{ size }}
              </option>
            </select>

            <button
              class="canbo-page-btn"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              <i class="bi bi-chevron-left"></i>
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              class="canbo-page-btn"
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>

            <button
              class="canbo-page-btn"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div v-if="showConfirm" class="canbo-modal-backdrop">
        <div class="canbo-confirm">
          <div class="canbo-confirm-icon">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </div>

          <h3>Ngưng hoạt động cán bộ?</h3>

          <p>
            Cán bộ
            <strong>{{ selectedCanBo?.hoTen }}</strong>
            sẽ bị khóa tài khoản và không thể sử dụng hệ thống.
          </p>

          <div class="canbo-confirm-actions">
            <button class="canbo-btn canbo-btn-soft" @click="cancelDelete">Hủy</button>

            <button class="canbo-btn canbo-btn-danger" @click="confirmDelete">Đồng ý khóa</button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
@import '@/assets/css/canbo/canbo.css';
</style>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import MainLayout from '@/components/layout/MainLayout.vue'
import canboService from '@/services/canboService'
import { useLoadingStore } from '@/stores/loadingStore'
import { useToastStore } from '@/stores/toastStore'
import { Helper } from '@/utils/helper'

const router = useRouter()
const loadingStore = useLoadingStore()
const toastStore = useToastStore()

const danhSachCanBo = ref([])
const keyword = ref('')
const trangThai = ref('')
const selectedCanBo = ref(null)
const showConfirm = ref(false)

const currentPage = ref(1)
const pageSize = ref(8)
const pageSizeOptions = [5, 8, 10, 20]

const loadData = async () => {
  loadingStore.show()

  try {
    const params = {}

    if (keyword.value.trim()) {
      params.keyword = keyword.value.trim()
    }

    if (trangThai.value !== '') {
      params.trangThai = trangThai.value === '1'
    }

    const res = await canboService.getAll(params)
    danhSachCanBo.value = (res.data || []).filter((item) => item.tenChucVu !== 'Quản lý') // Lọc bỏ quản trị viên
    currentPage.value = 1
  } catch (error) {
    toastStore.show(
      error.response?.data?.message || 'Không thể tải danh sách cán bộ',
      'error',
      'Lỗi hệ thống',
    )
  } finally {
    loadingStore.hide()
  }
}

const danhSachLoc = computed(() => {
  return danhSachCanBo.value
})

const formatDate = (date) => {
  if (!date) return '-'

  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const goCreate = () => {
  router.push('/can-bo/them')
}

const goEdit = (item) => {
  router.push(`/can-bo/sua/${item.publicId}`)
}

const goPermission = (item) => {
  router.push(`/can-bo/phan-quyen/${item.publicId}`)
}

const askDelete = (item) => {
  selectedCanBo.value = item
  showConfirm.value = true
}

const cancelDelete = () => {
  selectedCanBo.value = null
  showConfirm.value = false
}

const confirmDelete = async () => {
  if (!selectedCanBo.value) return

  loadingStore.show()

  try {
    await canboService.delete(selectedCanBo.value.publicId)

    toastStore.show('Đã ngưng hoạt động cán bộ', 'success', 'Thành công')

    await loadData()
  } catch (error) {
    toastStore.show(
      error.response?.data?.message || 'Không thể ngưng hoạt động cán bộ',
      'error',
      'Lỗi hệ thống',
    )
  } finally {
    loadingStore.hide()
    cancelDelete()
  }
}

const toggleStatus = async (item) => {
  loadingStore.show()

  try {
    await canboService.changeStatus(item.publicId, !item.trangThai)

    const successMsg = !item.trangThai ? 'Đã mở khóa cán bộ' : 'Đã khóa cán bộ'

    toastStore.show(successMsg, 'success', 'Thành công')

    await loadData()
  } catch (error) {
    toastStore.show(
      error.response?.data?.message || 'Không thể đổi trạng thái',
      'error',
      'Lỗi hệ thống',
    )
  } finally {
    loadingStore.hide()
  }
}

const totalItems = computed(() => {
  return danhSachLoc.value.length
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(totalItems.value / pageSize.value))
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * pageSize.value
})

const endIndex = computed(() => {
  return Math.min(startIndex.value + pageSize.value, totalItems.value)
})

const danhSachPhanTrang = computed(() => {
  return danhSachLoc.value.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5

  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return

  currentPage.value = page
}

const changePageSize = () => {
  currentPage.value = 1
}

watch([keyword, trangThai], () => {
  currentPage.value = 1
})

onMounted(async () => {
  await loadData()
})
</script>
