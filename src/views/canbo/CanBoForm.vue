<template>
  <MainLayout>
    <div class="canbo-page">
      <div class="canbo-hero">
        <div>
          <div class="canbo-eyebrow">
            {{ isEdit ? 'Cập nhật hồ sơ' : 'Tạo tài khoản mới' }}
          </div>

          <h1>{{ isEdit ? 'Cập nhật thông tin cán bộ' : 'Tạo mới cán bộ' }}</h1>

          <p>
            {{
              isEdit
                ? 'Cập nhật thông tin cá nhân, chức vụ và trạng thái tài khoản.'
                : 'Tạo tài khoản cán bộ mới để sử dụng hệ thống quản lý GPLX.'
            }}
          </p>
        </div>

        <button class="canbo-btn canbo-btn-soft" @click="goBack">
          <i class="bi bi-arrow-left"></i>
          Quay lại
        </button>
      </div>

      <form class="canbo-form-card" @submit.prevent="submitForm">
        <div class="canbo-form-section">
          <div class="canbo-section-title">
            <i class="bi bi-person-badge-fill"></i>
            <div>
              <h2>Thông tin cán bộ</h2>
              <p>Thông tin định danh và liên hệ của cán bộ.</p>
            </div>
          </div>

          <div class="canbo-grid">
            <div class="canbo-field">
              <label>Họ tên <span>*</span></label>
              <input v-model="form.hoTen" type="text" placeholder="Ví dụ: Nguyễn Văn A" />
              <small v-if="errors.hoTen">{{ errors.hoTen }}</small>
            </div>

            <div class="canbo-field">
              <label>Chức vụ <span>*</span></label>
              <select v-model="form.maChucVu">
                <option value="">-- Chọn chức vụ --</option>
                <option v-for="item in chucVus" :key="item.maChucVu" :value="item.maChucVu">
                  {{ item.tenChucVu }}
                </option>
              </select>
              <small v-if="errors.maChucVu">{{ errors.maChucVu }}</small>
            </div>

            <div class="canbo-field">
              <label>Email <span>*</span></label>
              <input v-model="form.email" type="email" placeholder="canbo@example.com" />
              <small v-if="errors.email">{{ errors.email }}</small>
            </div>

            <div class="canbo-field">
              <label>CCCD <span>*</span></label>
              <input v-model="form.cccd" type="text" maxlength="12" placeholder="12 chữ số" />
              <small v-if="errors.cccd">{{ errors.cccd }}</small>
            </div>

            <div class="canbo-field">
              <label>Số điện thoại</label>
              <input v-model="form.dienThoai" type="text" placeholder="Ví dụ: 0901234567" />
            </div>

            <div class="canbo-field">
              <label>Ảnh đại diện 3x4</label>

              <div class="canbo-upload-box">
                <div class="canbo-upload-preview">
                  <img v-if="previewAnh" :src="previewAnh" alt="Ảnh cán bộ" />
                  <i v-else class="bi bi-person-bounding-box"></i>
                </div>

                <div class="canbo-upload-content">
                  <input
                    id="anh3x4"
                    type="file"
                    accept="image/*"
                    class="canbo-file-input"
                    @change="handleAnhChange"
                  />

                  <label for="anh3x4" class="canbo-btn canbo-btn-soft">
                    <i class="bi bi-cloud-arrow-up-fill"></i>
                    Chọn ảnh
                  </label>

                  <p>Hỗ trợ JPG, PNG, WEBP. Tối đa 5MB.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="canbo-form-section">
          <div class="canbo-section-title">
            <i class="bi bi-shield-lock-fill"></i>
            <div>
              <h2>Tài khoản đăng nhập</h2>
              <p>Username là duy nhất. Mật khẩu sẽ được mã hóa ở backend.</p>
            </div>
          </div>

          <div class="canbo-grid">
            <div class="canbo-field">
              <label>Username <span>*</span></label>
              <input v-model="form.username" type="text" placeholder="Ví dụ: canbo_hoso" />
              <small v-if="errors.username">{{ errors.username }}</small>
            </div>

            <div class="canbo-field">
              <label>
                Mật khẩu
                <span v-if="!isEdit">*</span>
              </label>

              <input
                v-model="form.password"
                type="password"
                :placeholder="isEdit ? 'Bỏ trống nếu không đổi mật khẩu' : 'Tối thiểu 6 ký tự'"
              />

              <small v-if="errors.password">{{ errors.password }}</small>
            </div>

            <div v-if="isEdit" class="canbo-field canbo-switch-field">
              <label>Trạng thái tài khoản</label>

              <button
                type="button"
                class="canbo-switch"
                :class="{ active: form.trangThai }"
                @click="form.trangThai = !form.trangThai"
              >
                <span></span>
                {{ form.trangThai ? 'Đang hoạt động' : 'Đã khóa' }}
              </button>
            </div>
          </div>
        </div>

        <div class="canbo-form-actions">
          <button type="button" class="canbo-btn canbo-btn-soft" @click="goBack">Hủy</button>

          <button type="submit" class="canbo-btn canbo-btn-primary">
            <i class="bi bi-check-circle-fill"></i>
            {{ isEdit ? 'Lưu thay đổi' : 'Thêm cán bộ' }}
          </button>
        </div>
      </form>
    </div>
  </MainLayout>
</template>

<style scoped>
@import '@/assets/css/canbo/canbo.css';
</style>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import MainLayout from '@/components/layout/MainLayout.vue'
import canboService from '@/services/canboService'
import { useLoadingStore } from '@/stores/loadingStore'
import { useToastStore } from '@/stores/toastStore'

const route = useRoute()
const router = useRouter()
const loadingStore = useLoadingStore()
const toastStore = useToastStore()

const publicId = computed(() => route.params.publicId)
const isEdit = computed(() => !!publicId.value)

const chucVus = ref([])
const FORBIDDEN_ROLE_NAME = 'Quản lý'

const form = reactive({
  hoTen: '',
  maChucVu: '',
  email: '',
  cccd: '',
  dienThoai: '',
  anh3x4: '',
  username: '',
  password: '',
  trangThai: true,
})
const anh3x4File = ref(null)
const previewAnh = ref('')

const errors = reactive({})

const handleAnhChange = (event) => {
  const file = event.target.files?.[0]

  if (!file) {
    anh3x4File.value = null
    previewAnh.value = form.anh3x4 || ''
    return
  }

  if (!file.type.startsWith('image/')) {
    toastStore.show('Vui lòng chọn đúng định dạng ảnh', 'error', 'Lỗi dữ liệu')
    event.target.value = ''
    return
  }

  const maxSize = 5 * 1024 * 1024

  if (file.size > maxSize) {
    toastStore.show('Ảnh không được vượt quá 5MB', 'error', 'Lỗi dữ liệu')
    event.target.value = ''
    return
  }

  anh3x4File.value = file
  previewAnh.value = URL.createObjectURL(file)
}

const resetErrors = () => {
  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })
}

const validate = () => {
  resetErrors()

  if (!form.hoTen.trim()) {
    errors.hoTen = 'Vui lòng nhập họ tên'
  }

  if (!form.maChucVu) {
    errors.maChucVu = 'Vui lòng chọn chức vụ'
  }

  if (!form.email.trim()) {
    errors.email = 'Vui lòng nhập email'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email không hợp lệ'
  }

  if (!form.cccd.trim()) {
    errors.cccd = 'Vui lòng nhập CCCD'
  } else if (!/^\d{12}$/.test(form.cccd)) {
    errors.cccd = 'CCCD phải gồm đúng 12 chữ số'
  }

  if (!form.username.trim()) {
    errors.username = 'Vui lòng nhập username'
  }

  if (!isEdit.value && !form.password.trim()) {
    errors.password = 'Vui lòng nhập mật khẩu'
  }

  if (form.password && form.password.length < 6) {
    errors.password = 'Mật khẩu tối thiểu 6 ký tự'
  }

  return Object.keys(errors).length === 0
}

const loadChucVu = async () => {
  const res = await canboService.getChucVu()

  chucVus.value = (res.data || []).filter((item) => item.tenChucVu !== FORBIDDEN_ROLE_NAME)
}

const loadDetail = async () => {
  if (!isEdit.value) return

  loadingStore.show()

  try {
    const res = await canboService.getById(publicId.value)
    const data = res.data

    form.hoTen = data.hoTen || ''
    form.maChucVu = data.maChucVu || ''
    form.email = data.email || ''
    form.cccd = data.cccd || ''
    form.dienThoai = data.dienThoai || ''
    form.anh3x4 = data.anh3x4 || ''
    previewAnh.value = data.anh3x4 || ''
    form.username = data.username || ''
    form.password = ''
    form.trangThai = data.trangThai
  } catch (error) {
    toastStore.show(
      error.response?.data?.message || 'Không thể tải thông tin cán bộ',
      'error',
      'Lỗi hệ thống',
    )

    router.push('/can-bo')
  } finally {
    loadingStore.hide()
  }
}

const submitForm = async () => {
  if (!validate()) return

  loadingStore.show()

  try {
    const formData = new FormData()

    formData.append('hoTen', form.hoTen.trim())
    formData.append('maChucVu', Number(form.maChucVu))
    formData.append('email', form.email.trim())
    formData.append('cccd', form.cccd.trim())
    formData.append('username', form.username.trim())
    formData.append('trangThai', form.trangThai)

    if (form.dienThoai?.trim()) {
      formData.append('dienThoai', form.dienThoai.trim())
    }

    if (form.password.trim()) {
      formData.append('password', form.password.trim())
    }

    if (anh3x4File.value) {
      formData.append('anh3x4', anh3x4File.value)
    }

    if (isEdit.value) {
      await canboService.update(publicId.value, formData)
      toastStore.show('Cập nhật cán bộ thành công', 'success', 'Thành công')
    } else {
      formData.append('password', form.password.trim())
      await canboService.create(formData)
      toastStore.show('Thêm cán bộ thành công', 'success', 'Thành công')
    }

    router.push('/can-bo')
  } catch (error) {
    toastStore.show(
      error.response?.data?.message || 'Lưu thông tin cán bộ thất bại',
      'error',
      'Lỗi hệ thống',
    )
  } finally {
    loadingStore.hide()
  }
}

const goBack = () => {
  router.push('/can-bo')
}

onMounted(async () => {
  loadingStore.show()

  try {
    await loadChucVu()
    await loadDetail()
  } catch (error) {
    toastStore.show(
      error.response?.data?.message || 'Không thể tải dữ liệu cán bộ',
      'error',
      'Lỗi hệ thống',
    )
  } finally {
    loadingStore.hide()
  }
})
</script>
