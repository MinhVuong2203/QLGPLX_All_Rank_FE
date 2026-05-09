<template>
  <MainLayout>
    <link href="/css/hoso/ds-ho-so.css" rel="stylesheet" />

    <div class="page-container">
      <!-- HEADER -->

      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Quản lý hồ sơ GPLX</h1>

          <p class="page-subtitle">Danh sách tất cả hồ sơ đăng ký thi giấy phép lái xe</p>
        </div>

        <div class="page-header-right">
          <RouterLink to="/ho-so/them-moi" class="btn-primary">
            <lord-icon
              src="https://cdn.lordicon.com/mfdeeuho.json"
              trigger="hover"
              stroke="bold"
              state="hover-swirl"
              style="width: 30px; height: 30px"
            >
            </lord-icon>
            Tạo hồ sơ mới
          </RouterLink>
        </div>
      </div>

      <!-- STATS -->

      <div class="stats-grid">
        <div class="stat-card stat-total">
          <div class="stat-content">
            <lord-icon
              src="https://cdn.lordicon.com/ifyskbjd.json"
              trigger="loop"
              stroke="bold"
              state="hover-unfold"
              style="width: 50px; height: 50px"
            >
            </lord-icon>
            <div class="stat-text">
              <div class="stat-label">Tổng hồ sơ</div>
              <div class="stat-value">{{ danhSachHoSo.length }}</div>
            </div>
          </div>
        </div>

        <div class="stat-card stat-processing">
          <div class="stat-content">
            <lord-icon
              src="https://cdn.lordicon.com/fsumdotc.json"
              trigger="loop"
              delay="300"
              stroke="bold"
              state="morph-play"
              style="width: 50px; height: 50px"
            >
            </lord-icon>
            <div class="stat-text">
              <div class="stat-label">Đang xử lý</div>
              <div class="stat-value">
                {{ getCountByStatus('Đang xử lý') }}
              </div>
            </div>
          </div>
        </div>

        <div class="stat-card stat-approved">
          <div class="stat-content">
            <lord-icon
              src="https://cdn.lordicon.com/hqvguthc.json"
              trigger="loop"
              delay="300"
              stroke="bold"
              style="width: 50px; height: 50px"
            >
            </lord-icon>
            <div class="stat-text">
              <div class="stat-label">Đã duyệt</div>
              <div class="stat-value">
                {{ getCountByStatus('Đã duyệt') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FILTER -->

      <div class="filter-section">
        <div class="filter-bar">
          <div class="filter-group">
            <input
              v-model="searchText"
              type="text"
              placeholder="Tìm kiếm..."
              class="filter-input"
            />
          </div>

          <div class="filter-group">
            <select v-model="filterStatus" class="filter-select">
              <option value="">Tất cả</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đã duyệt">Đã duyệt</option>
              <option value="Từ chối">Từ chối</option>
            </select>
          </div>

          <div class="filter-group">
            <select v-model="filterHang" class="filter-select">
              <option value="">Tất cả</option>

              <option v-for="hang in danhSachHang" :key="hang.maHang" :value="hang.maHang">
                {{ hang.maHang }} -
                {{ hang.tenHang }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <select v-model="filterPayment" class="filter-select">
              <option value="">Tất cả</option>
              <option value="true">Đã thanh toán</option>
              <option value="false">Chưa thanh toán</option>
            </select>
          </div>

          <button v-if="hasActiveFilters" class="btn-reset-filter" @click="resetFilters">
            Xóa bộ lọc
          </button>
        </div>
      </div>

      <!-- TABLE -->

      <div class="table-section">
        <div v-if="filteredList.length === 0" class="empty-state">Không có dữ liệu</div>
        <div v-else class="table-container">
          <table class="hoso-table">
            <thead>
              <tr>
                <th>Mã HS</th>
                <th>Công dân</th>
                <th>Hạng</th>
                <th>Ngày nộp</th>
                <th>Trạng thái</th>
                <th>Thanh toán</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="hs in filteredList" :key="hs.hoSoId">
                <td>
                  <span class="id-badge"> #{{ hs.hoSoId }} </span>
                </td>

                <td>
                  <strong>
                    {{ hs.tenCongDan }}
                  </strong>
                </td>

                <td>
                  <span class="hang-badge">
                    {{ hs.maHang }}
                  </span>
                </td>

                <td>
                  {{ new Date(hs.ngayNop).toLocaleString('vi-VN') }}
                </td>

                <td>
                  <span class="status-badge" :class="`status-${getStatusClass(hs.trangThai)}`">
                    {{ hs.trangThai }}
                  </span>
                </td>

                <td>
                  <span
                    class="payment-badge"
                    :class="hs.trangThaiThanhToan ? 'payment-paid' : 'payment-unpaid'"
                  >
                    {{ hs.trangThaiThanhToan ? 'Đã thanh toán' : 'Chưa thanh toán' }}
                  </span>
                </td>

                <td>
                  <div class="action-buttons">
                    <button class="btn-action btn-view" @click="openViewModal(hs)">Xem</button>

                    <button class="btn-action btn-edit" @click="openEditModal(hs)">Sửa</button>

                    <button class="btn-action btn-delete" @click="confirmDelete(hs)">Xóa</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL XEM CHI TIẾT ==================== -->

    <div v-if="showViewModal && selectedHoSo" class="modal-overlay" @click="closeViewModal">
      <div class="modal-content modal-large" @click.stop>
        <div class="modal-header modal-header-view">
          <div class="modal-header-icon">👁</div>

          <div>
            <h3>Chi tiết hồ sơ</h3>

            <span class="modal-subtitle"> Mã hồ sơ: #{{ selectedHoSo.hoSoId }} </span>
          </div>

          <button type="button" class="modal-close" @click="closeViewModal">✕</button>
        </div>

        <div class="modal-body">
          <div class="info-grid">
            <!-- Công dân -->

            <div class="info-section">
              <div class="info-section-title">Thông tin công dân</div>

              <div class="info-row">
                <span class="info-label"> Họ tên </span>

                <span class="info-value">
                  <strong>
                    {{ selectedHoSo.tenCongDan }}
                  </strong>
                </span>
              </div>

              <div class="info-row">
                <span class="info-label"> CCCD </span>

                <span class="info-value">
                  {{ selectedHoSo.cccd }}
                </span>
              </div>

              <div class="info-row">
                <span class="info-label"> Mã công dân </span>

                <span class="info-value">
                  {{ selectedHoSo.maCongDan }}
                </span>
              </div>
            </div>

            <!-- Hồ sơ -->

            <div class="info-section">
              <div class="info-section-title">Thông tin hồ sơ</div>

              <div class="info-row">
                <span class="info-label"> Hạng GPLX </span>

                <span class="info-value">
                  <span class="hang-badge">
                    {{ selectedHoSo.maHang }}
                  </span>

                  <span v-if="selectedHoSo.tenHang" style="margin-left: 6px">
                    — {{ selectedHoSo.tenHang }}
                  </span>
                </span>
              </div>

              <div class="info-row">
                <span class="info-label"> Ngày nộp </span>

                <span class="info-value">
                  {{ new Date(selectedHoSo.ngayNop).toLocaleString('vi-VN') }}
                </span>
              </div>

              <div class="info-row">
                <span class="info-label"> Trạng thái </span>

                <span class="info-value">
                  <span
                    class="status-badge"
                    :class="`status-${getStatusClass(selectedHoSo.trangThai)}`"
                  >
                    {{ selectedHoSo.trangThai }}
                  </span>
                </span>
              </div>

              <div class="info-row">
                <span class="info-label"> Thanh toán </span>

                <span class="info-value">
                  <span
                    class="payment-badge"
                    :class="selectedHoSo.trangThaiThanhToan ? 'payment-paid' : 'payment-unpaid'"
                  >
                    {{ selectedHoSo.trangThaiThanhToan ? 'Đã thanh toán' : 'Chưa thanh toán' }}
                  </span>
                </span>
              </div>

              <div v-if="selectedHoSo.ghiChu" class="info-row">
                <span class="info-label"> Ghi chú </span>

                <span class="info-value">
                  {{ selectedHoSo.ghiChu }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click="closeViewModal">Đóng</button>

          <button type="button" class="btn-primary" @click="chuyenSangEdit">Chỉnh sửa</button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL CHỈNH SỬA ==================== -->

    <div v-if="showEditModal && selectedHoSo" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content modal-large" @click.stop>
        <div class="modal-header modal-header-edit">
          <div class="modal-header-icon">✏</div>

          <div>
            <h3>Chỉnh sửa hồ sơ</h3>

            <span class="modal-subtitle">
              {{ selectedHoSo.tenCongDan }}
              — #{{ selectedHoSo.hoSoId }}
            </span>
          </div>

          <button type="button" class="modal-close" @click="closeEditModal">✕</button>
        </div>

        <div class="modal-body">
          <div class="edit-form">
            <!-- Hạng -->

            <div class="form-group">
              <label class="form-label"> Hạng GPLX </label>

              <select v-model="editMaHang" class="filter-select form-select">
                <option value="">-- Chọn hạng --</option>

                <option v-for="hang in danhSachHang" :key="hang.maHang" :value="hang.maHang">
                  {{ hang.maHang }} -
                  {{ hang.tenHang }}
                </option>
              </select>
            </div>

            <!-- Ghi chú -->

            <div class="form-group">
              <label class="form-label"> Ghi chú </label>

              <textarea v-model="editGhiChu" rows="3" class="filter-input form-textarea"></textarea>
            </div>

            <!-- Thanh toán -->

            <div class="form-group">
              <label class="checkbox-label">
                <input v-model="editTrangThaiThanhToan" type="checkbox" class="checkbox-input" />

                <span class="checkbox-custom"></span>

                <span> Đã thanh toán </span>
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer modal-footer-edit">
          <button type="button" class="btn-secondary" @click="closeEditModal">Hủy</button>

          <div class="modal-footer-actions">
            <button type="button" class="btn-danger-outline" @click="tuChoiHoSo">Từ chối</button>

            <button type="button" class="btn-success" @click="duyetHoSo">Duyệt</button>

            <button type="button" class="btn-primary" @click="saveEdit">OK</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL DELETE ==================== -->

    <div v-if="showDeleteModal && selectedHoSo" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Xác nhận xóa hồ sơ</h3>

          <button type="button" class="modal-close" @click="closeDeleteModal">✕</button>
        </div>

        <div class="modal-body">
          <p class="modal-message">
            Bạn có chắc chắn muốn xóa hồ sơ của

            <strong>
              {{ selectedHoSo.tenCongDan }}
            </strong>

            (Hạng {{ selectedHoSo.maHang }})?
          </p>

          <p class="modal-warning">Hành động này không thể hoàn tác!</p>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click="closeDeleteModal">Hủy bỏ</button>

          <button type="button" class="btn-danger" @click="deleteHoSo">Xóa hồ sơ</button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import MainLayout from '@/components/layout/MainLayout.vue'

const danhSachHoSo = ref([])
const danhSachHang = ref([])

const loading = ref(false)

import { useToastStore } from '@/stores/toastStore'
import { useLoadingStore } from '@/stores/loadingStore'

const toastStore = useToastStore()
const loadingStore = useLoadingStore()

const showLoading = () => {
  loadingStore.show()
}

const hideLoading = () => {
  loadingStore.hide()
}

// Filter
const searchText = ref('')
const filterStatus = ref('')
const filterHang = ref('')
const filterPayment = ref('')

// Modal
const showViewModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const selectedHoSo = ref(null)

// Edit form
const editMaHang = ref('')
const editGhiChu = ref('')
const editTrangThaiThanhToan = ref(false)

onMounted(() => {
  loadData()
})

const loadData = async () => {
  try {
    showLoading()

    const [hosoRes, hangRes] = await Promise.all([
      api.get('/api/Hoso'),
      api.get('/api/HangGiayPhep'),
    ])

    danhSachHoSo.value = hosoRes.data
    danhSachHang.value = hangRes.data
  } catch (err) {
    console.error(err)

    toastStore.show('Không thể tải dữ liệu hồ sơ', 'error', 'Lỗi hệ thống')
  } finally {
    hideLoading()
  }
}

const filteredList = computed(() => {
  let filtered = [...danhSachHoSo.value]

  // Search
  if (searchText.value.trim()) {
    const search = searchText.value.toLowerCase()

    filtered = filtered.filter(
      (h) =>
        h.tenCongDan?.toLowerCase().includes(search) ||
        h.cccd?.includes(search) ||
        h.maHang?.toLowerCase().includes(search) ||
        h.tenHang?.toLowerCase().includes(search),
    )
  }

  // Status
  if (filterStatus.value) {
    filtered = filtered.filter((h) => h.trangThai === filterStatus.value)
  }

  // Hang
  if (filterHang.value) {
    filtered = filtered.filter((h) => h.maHang === filterHang.value)
  }

  // Payment
  if (filterPayment.value !== '') {
    const isPaid = filterPayment.value === 'true'

    filtered = filtered.filter((h) => h.trangThaiThanhToan === isPaid)
  }

  return filtered.sort((a, b) => new Date(b.ngayNop) - new Date(a.ngayNop))
})

const getCountByStatus = (status) => {
  return danhSachHoSo.value.filter((h) => h.trangThai === status).length
}

const getCountByPaymentStatus = (isPaid) => {
  return danhSachHoSo.value.filter((h) => h.trangThaiThanhToan === isPaid).length
}

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'đang xử lý':
      return 'processing'

    case 'đã duyệt':
      return 'approved'

    case 'từ chối':
      return 'rejected'

    case 'hoàn thành':
      return 'completed'

    default:
      return 'default'
  }
}

const hasActiveFilters = computed(() => {
  return searchText.value || filterStatus.value || filterHang.value || filterPayment.value
})

const resetFilters = () => {
  searchText.value = ''
  filterStatus.value = ''
  filterHang.value = ''
  filterPayment.value = ''
}

// ================= VIEW =================

const openViewModal = (hoso) => {
  selectedHoSo.value = hoso
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedHoSo.value = null
}

const chuyenSangEdit = () => {
  if (!selectedHoSo.value) return

  const hs = selectedHoSo.value

  showViewModal.value = false

  editMaHang.value = hs.maHang
  editGhiChu.value = hs.ghiChu || ''
  editTrangThaiThanhToan.value = hs.trangThaiThanhToan || false

  showEditModal.value = true
}

// ================= EDIT =================

const openEditModal = (hoso) => {
  selectedHoSo.value = hoso

  editMaHang.value = hoso.maHang
  editGhiChu.value = hoso.ghiChu || ''
  editTrangThaiThanhToan.value = hoso.trangThaiThanhToan || false

  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedHoSo.value = null
}

const saveEdit = async () => {
  if (!selectedHoSo.value) return

  await callUpdateApi(selectedHoSo.value.trangThai || 'Đang xử lý', 'Cập nhật hồ sơ thành công!')
}

const duyetHoSo = async () => {
  await callUpdateApi('Đã duyệt', 'Duyệt hồ sơ thành công!')
}

const tuChoiHoSo = async () => {
  await callUpdateApi('Từ chối', 'Đã từ chối hồ sơ!')
}
const callUpdateApi = async (trangThai, successMsg) => {
  if (!selectedHoSo.value) return

  try {
    showLoading()

    const dto = {
      maHang: editMaHang.value,
      ghiChu: editGhiChu.value,
      trangThaiThanhToan: editTrangThaiThanhToan.value,
      trangThai,
    }

    await api.put(`/api/Hoso/${selectedHoSo.value.hoSoId}`, dto)

    toastStore.show(successMsg, 'success', 'Thành công')

    closeEditModal()

    await loadData()
  } catch (err) {
    console.error(err)

    toastStore.show('Cập nhật hồ sơ thất bại', 'error', 'Có lỗi xảy ra')
  } finally {
    hideLoading()
  }
}

// ================= DELETE =================

const confirmDelete = (hoso) => {
  selectedHoSo.value = hoso
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedHoSo.value = null
}
const deleteHoSo = async () => {
  if (!selectedHoSo.value) return

  try {
    showLoading()

    await api.delete(`/api/Hoso/${selectedHoSo.value.hoSoId}`)

    toastStore.show('Xóa hồ sơ thành công', 'success', 'Thành công')

    closeDeleteModal()

    await loadData()
  } catch (err) {
    console.error(err)

    toastStore.show('Xóa hồ sơ thất bại', 'error', 'Có lỗi xảy ra')
  } finally {
    hideLoading()
  }
}
</script>

<style scoped>
@import '@/assets/css/hoso/ds-ho-so.css';
</style>
