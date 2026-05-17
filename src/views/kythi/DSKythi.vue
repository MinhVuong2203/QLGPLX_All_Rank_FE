<template>
  <MainLayout>
    <link href="/css/kythi/kythi-css.css" rel="stylesheet" />

    <div class="ky-thi-container">
      <div class="page-header">
        <div class="header-content">
          <div class="title-section">
            <i class="bi bi-calendar-event-fill"></i>
            <div>
              <h1>Quản lý Kỳ thi</h1>
              <p class="subtitle">Tổ chức và quản lý các kỳ sát hạch GPLX</p>
            </div>
          </div>
          <button class="btn-primary" @click="navigateToCreate">
            <i class="bi bi-plus-circle"></i>
            Tạo kỳ thi mới
          </button>
        </div>
      </div>

      <div v-if="!danhSachKyThi || danhSachKyThi.length === 0" class="empty-state">
        <i class="bi bi-inbox"></i>
        <h3>Chưa có kỳ thi nào</h3>
        <p>Hãy tạo kỳ thi đầu tiên để bắt đầu tổ chức sát hạch</p>
        <button class="btn-primary" @click="navigateToCreate">
          <i class="bi bi-plus-circle"></i>
          Tạo kỳ thi mới
        </button>
      </div>

      <template v-else>
        <div class="filter-section">
          <div class="search-box">
            <i class="bi bi-search"></i>
            <input type="text" placeholder="Tìm kiếm kỳ thi..." v-model="searchText" />
          </div>
          <div class="filter-group">
            <select v-model="filterTrangThai" class="form-select">
              <option value="">Tất cả trạng thái</option>
              <option value="Sắp diễn ra">Sắp diễn ra</option>
              <option value="Đang diễn ra">Đang diễn ra</option>
              <option value="Đã kết thúc">Đã kết thúc</option>
            </select>
            <select v-model="filterMaHang" class="form-select">
              <option value="">Tất cả hạng</option>
              <option v-for="hang in danhSachHang" :key="hang.maHang" :value="hang.maHang">
                {{ hang.maHang }} - {{ hang.tenHang }}
              </option>
            </select>
          </div>
        </div>

        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon upcoming">
              <i class="bi bi-calendar-plus"></i>
            </div>
            <div class="stat-info">
              <h4>{{ countByStatus('Sắp diễn ra') }}</h4>
              <p>Sắp diễn ra</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon ongoing">
              <i class="bi bi-play-circle"></i>
            </div>
            <div class="stat-info">
              <h4>{{ countByStatus('Đang diễn ra') }}</h4>
              <p>Đang diễn ra</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon completed">
              <i class="bi bi-check-circle"></i>
            </div>
            <div class="stat-info">
              <h4>{{ countByStatus('Đã kết thúc') }}</h4>
              <p>Đã kết thúc</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon total">
              <i class="bi bi-people"></i>
            </div>
            <div class="stat-info">
              <h4>{{ totalRegistered }}</h4>
              <p>Thí sinh đã đăng ký</p>
            </div>
          </div>
        </div>

        <div class="ky-thi-grid">
          <div
            v-for="kyThi in paginatedKyThi"
            :key="kyThi.kyThiID"
            :class="['ky-thi-card', getStatusClass(kyThi.trangThai)]"
          >
            <div class="card-header">
              <div class="header-top">
                <span class="badge-hang">{{ kyThi.maHang }} - {{ kyThi.tenHang }}</span>
                <span :class="['badge-status', getStatusClass(kyThi.trangThai)]">
                  {{ kyThi.trangThai }}
                </span>
              </div>
              <h3 class="card-title">{{ kyThi.tenKyThi }}</h3>
            </div>

            <div class="card-body">
              <div class="info-row">
                <i class="bi bi-calendar3"></i>
                <div class="info-content">
                  <span class="label">Thời gian</span>
                  <span class="value">
                    {{ formatDate(kyThi.ngayBatDau) }} - {{ formatDate(kyThi.ngayKetThuc) }}
                  </span>
                </div>
              </div>
              <div class="info-row">
                <i class="bi bi-geo-alt"></i>
                <div class="info-content">
                  <span class="label">Địa điểm</span>
                  <span class="value">{{ kyThi.diaDiem }}</span>
                </div>
              </div>
              <div class="info-row">
                <i class="bi bi-people"></i>
                <div class="info-content">
                  <span class="label">Thí sinh</span>
                  <span class="value">{{ kyThi.soLuongDangKy }} / {{ kyThi.soLuongToiDa }}</span>
                </div>
              </div>

              <div class="progress-section">
                <div class="progress-info">
                  <span>Tỷ lệ đăng ký</span>
                  <span class="percentage"
                    >{{ getPercentage(kyThi.soLuongDangKy, kyThi.soLuongToiDa) }}%</span
                  >
                </div>
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: getPercentage(kyThi.soLuongDangKy, kyThi.soLuongToiDa) + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <button type="button" class="btn-action" @click.stop="openDetailModal(kyThi)">
                <i class="bi bi-eye"></i>
                Chi tiết
              </button>
              <button class="btn-action" @click="navigateToAddHoSo(kyThi.kyThiID)">
                <i class="bi bi-person-plus"></i>
                Thêm thí sinh
              </button>
              <button type="button" class="btn-action" @click.stop="openEditModal(kyThi)">
                <i class="bi bi-pencil"></i>
                Sửa
              </button>
              <button class="btn-action delete" @click="deleteKyThi(kyThi.kyThiID)">
                <i class="bi bi-trash"></i>
                Xóa
              </button>
            </div>
          </div>
        </div>

        <div v-if="filteredKyThi.length > pageSize" class="pagination-bar">
          <div class="pagination-info">
            Hiển thị {{ pageStart }}-{{ pageEnd }} / {{ filteredKyThi.length }}
          </div>

          <div class="pagination-actions">
            <button type="button" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
              Trước
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              type="button"
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            <button
              type="button"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              Sau
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- ================= DETAIL MODAL ================= -->

    <div v-if="showDetailModal && selectedKyThi" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <div class="modal-title-group">
            <div class="modal-icon">
              <i class="bi bi-calendar-event"></i>
            </div>

            <div>
              <h2>Chi tiết kỳ thi</h2>

              <p>
                {{ selectedKyThi.tenKyThi }}
              </p>
            </div>
          </div>

          <button type="button" class="modal-close" @click="closeDetailModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-card">
              <span class="detail-label"> Hạng GPLX </span>

              <strong>
                {{ selectedKyThi.maHang }}
                -
                {{ selectedKyThi.tenHang }}
              </strong>
            </div>

            <div class="detail-card">
              <span class="detail-label"> Trạng thái </span>

              <span class="badge-status" :class="getStatusClass(selectedKyThi.trangThai)">
                {{ selectedKyThi.trangThai }}
              </span>
            </div>

            <div class="detail-card full">
              <span class="detail-label"> Địa điểm </span>

              <strong>
                {{ selectedKyThi.diaDiem }}
              </strong>
            </div>

            <div class="detail-card">
              <span class="detail-label"> Ngày bắt đầu </span>

              <strong>
                {{ new Date(selectedKyThi.ngayBatDau).toLocaleDateString('vi-VN') }}
              </strong>
            </div>

            <div class="detail-card">
              <span class="detail-label"> Ngày kết thúc </span>

              <strong>
                {{ new Date(selectedKyThi.ngayKetThuc).toLocaleDateString('vi-VN') }}
              </strong>
            </div>

            <div class="detail-card full">
              <span class="detail-label"> Số lượng đăng ký </span>

              <div class="modal-progress">
                <div class="modal-progress-top">
                  <span>
                    {{ selectedKyThi.soLuongDangKy }}
                    /
                    {{ selectedKyThi.soLuongToiDa }}
                  </span>

                  <span>
                    {{ getPercentage(selectedKyThi.soLuongDangKy, selectedKyThi.soLuongToiDa) }}%
                  </span>
                </div>

                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{
                      width:
                        getPercentage(selectedKyThi.soLuongDangKy, selectedKyThi.soLuongToiDa) +
                        '%',
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= EDIT MODAL ================= -->

    <div v-if="showEditModal && selectedKyThi" class="modal-overlay" @click="closeEditModal">
      <div class="modal-container modal-large" @click.stop>
        <div class="modal-header">
          <div class="modal-title-group">
            <div class="modal-icon edit">
              <i class="bi bi-pencil-square"></i>
            </div>

            <div>
              <h2>Chỉnh sửa kỳ thi</h2>

              <p>
                {{ selectedKyThi.tenKyThi }}
              </p>
            </div>
          </div>

          <button type="button" class="modal-close" @click="closeEditModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="modal-form-grid">
            <div class="form-group full">
              <label>Tên kỳ thi</label>

              <input
                v-model="editModel.tenKyThi"
                type="text"
                class="modal-input"
                :disabled="isEditingOngoing"
              />
            </div>

            <div class="form-group">
              <label>Hạng GPLX</label>

              <select v-model="editModel.maHang" class="modal-input" :disabled="isEditingOngoing">
                <option v-for="hang in danhSachHang" :key="hang.maHang" :value="hang.maHang">
                  {{ hang.maHang }} -
                  {{ hang.tenHang }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Số lượng tối đa</label>

              <input
                v-model.number="editModel.soLuongToiDa"
                type="number"
                class="modal-input"
                :min="isEditingOngoing ? (selectedKyThi.soLuongDangKy || 0) + 1 : 1"
              />
            </div>

            <div class="form-group">
              <label>Ngày bắt đầu</label>

              <input
                v-model="editModel.ngayBatDau"
                type="date"
                class="modal-input"
                :disabled="isEditingOngoing"
                :min="todayInput"
              />
            </div>

            <div class="form-group">
              <label>Ngày kết thúc</label>

              <input
                v-model="editModel.ngayKetThuc"
                type="date"
                class="modal-input"
                :min="isEditingOngoing ? todayInput : editModel.ngayBatDau"
              />
            </div>

            <div class="form-group full">
              <label>Địa điểm</label>

              <input v-model="editModel.diaDiem" type="text" class="modal-input" />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click="closeEditModal">Hủy</button>

          <button type="button" class="btn-primary" @click="handleUpdateKyThi">
            <i class="bi bi-check-circle"></i>
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import MainLayout from '@/components/layout/MainLayout.vue'
import { useToastStore } from '@/stores/toastStore'
import { useLoadingStore } from '@/stores/loadingStore'
import { Modal } from 'bootstrap'

const router = useRouter()
const toastStore = useToastStore()
const loadingStore = useLoadingStore()

const danhSachKyThi = ref([])
const danhSachHang = ref([])
const searchText = ref('')
const filterTrangThai = ref('')
const filterMaHang = ref('')
const currentPage = ref(1)
const pageSize = 9

const showDetailModal = ref(false)
const showEditModal = ref(false)
const selectedKyThi = ref(null)

let timer = null

// Computed
const filteredKyThi = computed(() => {
  return danhSachKyThiWithStatus.value.filter((k) => {
    const matchSearch =
      !searchText.value || k.tenKyThi?.toLowerCase().includes(searchText.value.toLowerCase())

    const matchStatus = !filterTrangThai.value || k.trangThai === filterTrangThai.value

    const matchHang = !filterMaHang.value || k.maHang === filterMaHang.value

    return matchSearch && matchStatus && matchHang
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredKyThi.value.length / pageSize)))

const paginatedKyThi = computed(() => {
  const start = (currentPage.value - 1) * pageSize

  return filteredKyThi.value.slice(start, start + pageSize)
})

const pageStart = computed(() => {
  if (!filteredKyThi.value.length) return 0

  return (currentPage.value - 1) * pageSize + 1
})

const pageEnd = computed(() => Math.min(currentPage.value * pageSize, filteredKyThi.value.length))

const goToPage = (page) => {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}

watch([searchText, filterTrangThai, filterMaHang], () => {
  currentPage.value = 1
})

const countByStatus = computed(() => (status) => {
  return danhSachKyThiWithStatus.value.filter((k) => k.trangThai === status).length
})

const totalRegistered = computed(() => {
  return danhSachKyThi.value.reduce((sum, k) => sum + (k.soLuongDangKy || 0), 0)
})

const todayInput = computed(() => toDateInput(new Date()))
const isEditingOngoing = computed(() => selectedKyThi.value?.trangThai === 'Äang diá»…n ra')

// Methods
const loadHang = async () => {
  try {
    loadingStore.show()
    const response = await api.get('/api/HangGiayPhep')
    danhSachHang.value = response.data
  } catch (error) {
    toastStore.error('Không tải được danh sách hạng GPLX')
    console.error(error)
  } finally {
    loadingStore.hide()
  }
}

const loadData = async () => {
  try {
    loadingStore.show()
    const response = await api.get('/api/KyThi')
    danhSachKyThi.value = response.data

    if (!danhSachKyThi.value || danhSachKyThi.value.length === 0) {
      toastStore.info('Chưa có kỳ thi nào')
    }
  } catch (error) {
    console.error(error)
    toastStore.error('Không thể tải danh sách kỳ thi!')
  } finally {
    loadingStore.hide()
  }
}
// Hàm tính trạng thái của kỳ thi dựa trên ngày bắt đầu và kết thúc
const getTrangThai = (k) => {
  const today = normalizeDate(new Date())
  const start = normalizeDate(k.ngayBatDau)
  const end = normalizeDate(k.ngayKetThuc)
  if (end < today) return 'ÄÃ£ káº¿t thÃºc'

  if (today < start) return 'Sắp diễn ra'
  if (today >= start && today <= end) return 'Đang diễn ra'
  return 'Đã kết thúc'
}

const danhSachKyThiWithStatus = computed(() =>
  danhSachKyThi.value.map((k) => ({
    ...k,
    trangThai: getTrangThai(k),
  })),
)

const getStatusClass = (trangThai) => {
  const statusMap = {
    'Sắp diễn ra': 'upcoming',
    'Đang diễn ra': 'ongoing',
    'Đã kết thúc': 'completed',
  }
  return statusMap[trangThai] || ''
}

const getPercentage = (current, max) => {
  if (max === 0) return 0
  return Math.round((current / max) * 100)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

const normalizeDate = (value) => {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

const toDateInput = (value) => {
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const navigateToCreate = () => {
  router.push('/ky-thi/them')
}

const navigateToEdit = (id) => {
  router.push(`/ky-thi/sua/${id}`)
}

const navigateToDetail = (id) => {
  router.push(`/ky-thi/chi-tiet/${id}`)
}

const navigateToAddHoSo = (id) => {
  router.push(`/ky-thi/${id}/them-ho-so`)
}

const deleteKyThi = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa?')) return

  try {
    loadingStore.show()
    const response = await api.delete(`/api/KyThi/${id}`)

    if (response.status === 200) {
      toastStore.success('Xóa kỳ thi thành công!')
      await loadData()
    } else {
      toastStore.error('Không thể xóa kỳ thi!')
    }
  } catch (error) {
    console.error(error)
    toastStore.error('Đã xảy ra lỗi khi xóa!')
  } finally {
    loadingStore.hide()
  }
}

onMounted(async () => {
  await loadHang()
  await loadData()
  // Auto update trạng thái mỗi phút
  timer = setInterval(() => {
    danhSachKyThi.value = [...danhSachKyThi.value]
  }, 60000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

//  Modal logic for Detail Modal
const editModel = ref({
  tenKyThi: '',
  maHang: '',
  ngayBatDau: '',
  ngayKetThuc: '',
  diaDiem: '',
  soLuongToiDa: 0,
})

const openDetailModal = (kyThi) => {
  selectedKyThi.value = kyThi

  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false

  selectedKyThi.value = null
}

const openEditModal = (kyThi) => {
  if (kyThi.trangThai === 'ÄÃ£ káº¿t thÃºc') {
    toastStore.warning('Ká»³ thi Ä‘Ã£ káº¿t thÃºc, khÃ´ng thá»ƒ chá»‰nh sá»­a')
    return
  }

  selectedKyThi.value = kyThi

  editModel.value = {
    tenKyThi: kyThi.tenKyThi,
    maHang: kyThi.maHang,
    ngayBatDau: kyThi.ngayBatDau?.split('T')[0],
    ngayKetThuc: kyThi.ngayKetThuc?.split('T')[0],
    diaDiem: kyThi.diaDiem,
    soLuongToiDa: kyThi.soLuongToiDa,
  }

  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedKyThi.value = null
}

const handleUpdateKyThi = async () => {
  if (!validateEditForm()) return

  try {
    loadingStore.show()
    if (new Date(editModel.value.ngayKetThuc) < new Date(editModel.value.ngayBatDau)) {
      toastStore.show('Ngày kết thúc phải sau ngày bắt đầu', 'warning', 'Dữ liệu không hợp lệ')

      return
    }

    await api.put(`/api/KyThi/${selectedKyThi.value.kyThiID}`, editModel.value)

    toastStore.show('Cập nhật kỳ thi thành công', 'success', 'Thành công')

    closeEditModal()

    await loadData()
  } catch (err) {
    console.error(err)

    toastStore.show('Không thể cập nhật kỳ thi', 'error', 'Lỗi hệ thống')
  } finally {
    loadingStore.hide()
  }
}

const validateEditForm = () => {
  const status = selectedKyThi.value?.trangThai
  const today = normalizeDate(new Date())
  const startDate = normalizeDate(editModel.value.ngayBatDau)
  const endDate = normalizeDate(editModel.value.ngayKetThuc)
  const maxQuantity = Number(editModel.value.soLuongToiDa || 0)
  const registered = Number(selectedKyThi.value?.soLuongDangKy || 0)

  if (status === 'ÄÃ£ káº¿t thÃºc') {
    toastStore.warning('Ky thi da ket thuc, khong the chinh sua')
    return false
  }

  if (status === 'Äang diá»…n ra') {
    if (endDate < today) {
      toastStore.warning('Ngay ket thuc phai lon hon hoac bang ngay hien tai')
      return false
    }

    if (maxQuantity <= registered) {
      toastStore.warning('So luong toi da phai lon hon so luong da dang ky')
      return false
    }

    return true
  }

  if (!editModel.value.tenKyThi?.trim()) {
    toastStore.warning('Ten ky thi khong duoc de trong')
    return false
  }

  if (editModel.value.tenKyThi.length > 150) {
    toastStore.warning('Ten ky thi toi da 150 ky tu')
    return false
  }

  if (!editModel.value.maHang) {
    toastStore.warning('Hang GPLX khong duoc de trong')
    return false
  }

  if (startDate < today) {
    toastStore.warning('Ngay bat dau khong hop le')
    return false
  }

  if (endDate < startDate) {
    toastStore.warning('Ngay ket thuc phai sau ngay bat dau')
    return false
  }

  if (maxQuantity < 1) {
    toastStore.warning('So luong phai lon hon 0')
    return false
  }

  return true
}
</script>

<style scoped>
@import '@/assets/css/kythi/kythi-css.css';
</style>
