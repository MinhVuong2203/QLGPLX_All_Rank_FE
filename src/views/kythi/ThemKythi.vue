<template>
  <MainLayout>
    <div class="them-ky-thi-container">
      <div class="page-header-compact">
        <button class="btn-back" @click="goBack">
          <i class="bi bi-arrow-left"></i>
          Quay lại
        </button>
        <div class="header-title">
          <i class="bi bi-calendar-plus"></i>
          <h1>Tạo kỳ thi mới</h1>
        </div>
      </div>

      <div class="form-container">
        <form @submit.prevent="handleSubmit">
          <div class="form-section">
            <h3 class="section-title">
              <i class="bi bi-info-circle"></i>
              Thông tin cơ bản
            </h3>

            <div class="form-grid">
              <div class="form-group full-width">
                <label>Tên kỳ thi <span class="required">*</span></label>
                <input
                  v-model="model.tenKyThi"
                  type="text"
                  class="form-control"
                  placeholder="VD: Kỳ thi sát hạch GPLX Tháng 5/2024"
                  required
                />
                <span v-if="errors.tenKyThi" class="error-message">{{ errors.tenKyThi }}</span>
              </div>

              <div class="form-group">
                <label>Hạng giấy phép <span class="required">*</span></label>
                <select v-model="model.maHang" class="form-control" required>
                  <option value="">-- Chọn hạng --</option>
                  <option v-for="hang in danhSachHang" :key="hang.maHang" :value="hang.maHang">
                    {{ hang.maHang }} - {{ hang.tenHang }}
                  </option>
                </select>
                <span v-if="errors.maHang" class="error-message">{{ errors.maHang }}</span>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">
              <i class="bi bi-calendar-range"></i>
              Thời gian & Địa điểm
            </h3>

            <div class="form-grid">
              <div class="form-group">
                <label>Ngày bắt đầu <span class="required">*</span></label>
                <input v-model="model.ngayBatDau" type="date" class="form-control" required />
                <span v-if="errors.ngayBatDau" class="error-message">{{ errors.ngayBatDau }}</span>
              </div>

              <div class="form-group">
                <label>Ngày kết thúc <span class="required">*</span></label>
                <input v-model="model.ngayKetThuc" type="date" class="form-control" required />
                <span v-if="errors.ngayKetThuc" class="error-message">{{
                  errors.ngayKetThuc
                }}</span>
              </div>

              <div class="form-group full-width">
                <label>Địa điểm tổ chức <span class="required">*</span></label>
                <input
                  v-model="model.diaDiem"
                  type="text"
                  class="form-control"
                  placeholder="VD: Trung tâm Sát hạch GPLX Đồng Tháp"
                  required
                />
                <span v-if="errors.diaDiem" class="error-message">{{ errors.diaDiem }}</span>
              </div>

              <div class="form-group">
                <label>Số lượng thí sinh tối đa <span class="required">*</span></label>
                <input
                  v-model.number="model.soLuongToiDa"
                  type="number"
                  class="form-control"
                  min="1"
                  required
                />
                <small class="form-text">Số lượng thí sinh tối đa có thể đăng ký</small>
                <span v-if="errors.soLuongToiDa" class="error-message">{{
                  errors.soLuongToiDa
                }}</span>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="goBack">
              <i class="bi bi-x-circle"></i>
              Hủy bỏ
            </button>
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              <span
                v-if="isSubmitting"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <template v-if="isSubmitting">
                <span>Đang xử lý...</span>
              </template>
              <template v-else>
                <i class="bi bi-check-circle"></i>
                <span>Tạo kỳ thi</span>
              </template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import MainLayout from '@/components/layout/MainLayout.vue'
import { useToastStore } from '@/stores/toastStore'
import { useLoadingStore } from '@/stores/loadingStore'

const router = useRouter()
const toastStore = useToastStore()
const loadingStore = useLoadingStore()

const model = ref({
  tenKyThi: '',
  ngayBatDau: '',
  ngayKetThuc: '',
  diaDiem: '',
  maHang: '',
  soLuongToiDa: null,
  trangThai: 'Sắp diễn ra',
})

const danhSachHang = ref([])
const isSubmitting = ref(false)
const errors = ref({})

const loadHangGiayPhep = async () => {
  try {
    loadingStore.show()
    const response = await api.get('/api/HangGiayPhep')
    danhSachHang.value = response.data
  } catch (error) {
    console.error(error)
    toastStore.error('Không thể tải danh sách hạng giấy phép!')
  } finally {
    loadingStore.hide()
  }
}

const validateForm = () => {
  errors.value = {}

  if (!model.value.tenKyThi || model.value.tenKyThi.trim() === '') {
    errors.value.tenKyThi = 'Tên kỳ thi không được để trống'
  } else if (model.value.tenKyThi.length > 150) {
    errors.value.tenKyThi = 'Tên kỳ thi tối đa 150 ký tự'
  }

  if (!model.value.maHang) {
    errors.value.maHang = 'Hạng GPLX không được để trống'
  }

  if (!model.value.ngayBatDau) {
    errors.value.ngayBatDau = 'Ngày bắt đầu không được để trống'
  }

  if (!model.value.ngayKetThuc) {
    errors.value.ngayKetThuc = 'Ngày kết thúc không được để trống'
  }

  if (model.value.ngayBatDau && model.value.ngayKetThuc) {
    const startDate = new Date(model.value.ngayBatDau)
    const endDate = new Date(model.value.ngayKetThuc)

    if (endDate < startDate) {
      errors.value.ngayKetThuc = 'Ngày kết thúc phải sau ngày bắt đầu'
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (startDate < today) {
      errors.value.ngayBatDau = 'Ngày bắt đầu không hợp lệ'
    }
  }

  if (!model.value.soLuongToiDa || model.value.soLuongToiDa < 1) {
    errors.value.soLuongToiDa = 'Số lượng phải lớn hơn 0'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    toastStore.warning('Vui lòng kiểm tra lại thông tin!')
    return
  }

  try {
    loadingStore.show()
    isSubmitting.value = true

    const response = await api.post('/api/KyThi', model.value)

    if (response.status === 200 || response.status === 201) {
      toastStore.success('Tạo kỳ thi thành công!')
      router.push('/ky-thi')
    } else {
      toastStore.error('Lỗi: ' + response.data)
    }
  } catch (error) {
    console.error(error)
    toastStore.error('Đã xảy ra lỗi khi tạo kỳ thi!')
  } finally {
    loadingStore.hide()
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.push('/ky-thi')
}

onMounted(async () => {
  await loadHangGiayPhep()
})
</script>

<style scoped>
@import url('@/assets/css/kythi/them-ky-thi.css');
.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}
</style>
