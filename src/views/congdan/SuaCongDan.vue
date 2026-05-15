<template>
  <MainLayout>
    <div>
      <link href="/css/congdan/them_cong_dan.css" rel="stylesheet" />
      <h1 class="title">Cập nhật thông tin công dân</h1>

      <div class="create-container">
        <!-- LEFT: FORM -->
        <div class="form-card">
          <form @submit.prevent="handleSubmit">
            <div class="grid">
              <!-- Họ tên -->
              <div class="field">
                <label>Họ tên <span class="required">*</span></label>
                <span v-if="errors.hoTen" class="error-message">{{ errors.hoTen }}</span>
                <input v-model="model.hoTen" type="text" />
              </div>

              <!-- Ngày sinh -->
              <div class="field">
                <label>Ngày sinh <span class="required">*</span></label>
                <span v-if="errors.ngaySinh" class="error-message">{{ errors.ngaySinh }}</span>
                <input v-model="model.ngaySinh" type="date" />
              </div>

              <!-- CCCD - DISABLED -->
              <div class="field">
                <label>CCCD</label>
                <input v-model="model.cccd" type="text" disabled />
              </div>

              <!-- Giới tính -->
              <div class="field">
                <label>Giới tính</label>
                <select v-model="model.gioiTinh">
                  <option value="">-- chọn --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <!-- Tỉnh -->
              <div class="field">
                <label>Tỉnh</label>
                <select v-model="selectedTinh">
                  <option value="">-- chọn tỉnh --</option>
                  <option v-for="t in tinhList" :key="t.tentinhmoi" :value="t.tentinhmoi">
                    {{ t.tentinhmoi }}
                  </option>
                </select>
              </div>

              <!-- Phường -->
              <div class="field">
                <label>Phường/Xã</label>
                <select v-model="selectedPhuong">
                  <option value="">-- chọn phường --</option>
                  <option v-for="p in phuongList" :key="p.maphuongxa" :value="p.tenphuongxa">
                    {{ p.tenphuongxa }}
                  </option>
                </select>
              </div>

              <!-- Địa chỉ chi tiết -->
              <div class="field full">
                <label>Địa chỉ cụ thể</label>
                <input v-model="diaChiCuThe" type="text" />
              </div>

              <!-- Phone -->
              <div class="field">
                <label>SĐT</label>
                <span v-if="errors.soDienThoai" class="error-message">{{
                  errors.soDienThoai
                }}</span>
                <input v-model="model.soDienThoai" type="text" />
              </div>

              <!-- Email -->
              <div class="field">
                <label>Email</label>
                <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
                <input v-model="model.email" type="email" />
              </div>

              <!-- Upload ảnh -->
              <div class="field">
                <label>Ảnh 3x4</label>
                <input type="file" @change="onAvatarChange" accept="image/*" />
              </div>

              <!-- Tình trạng sức khỏe -->
              <div class="field">
                <label>Tình trạng sức khỏe</label>
                <input v-model="model.tinhTrangSucKhoe" type="text" />
              </div>

              <!-- Ngày khám -->
              <div class="field">
                <label>Ngày khám sức khỏe</label>
                <span v-if="errors.ngayKhamSucKhoe" class="error-message">{{
                  errors.ngayKhamSucKhoe
                }}</span>
                <input v-model="model.ngayKhamSucKhoe" type="date" />
              </div>

              <!-- Giấy khám -->
              <div class="field">
                <label>Giấy khám</label>
                <input type="file" @change="onGkskChange" accept="image/*" />
              </div>
            </div>

            <button type="submit" class="btn-submit">Cập nhật</button>
          </form>
        </div>

        <!-- RIGHT: PREVIEW (giống ThemCongDan.vue) -->
        <div class="preview-card">
          <h3>Thông tin</h3>

          <div class="preview-item">
            <i class="bi bi-person"></i>
            <span
              ><b>{{ model.hoTen || 'Chưa có' }}</b></span
            >
          </div>

          <div class="preview-item">
            <i class="bi bi-calendar"></i>
            <span>{{ model.ngaySinh || 'Chưa có' }}</span>
          </div>

          <div class="preview-item">
            <i class="bi bi-credit-card-2-front"></i>
            <span>{{ model.cccd || 'Chưa có' }}</span>
          </div>

          <div class="preview-item">
            <i class="bi bi-gender-ambiguous"></i>
            <span>{{ model.gioiTinh || 'Chưa có' }}</span>
          </div>

          <div class="preview-item">
            <i class="bi bi-geo-alt"></i>
            <span>{{ fullAddress }}</span>
          </div>

          <div class="preview-item">
            <i class="bi bi-telephone"></i>
            <span>{{ model.soDienThoai || 'Chưa có' }}</span>
          </div>

          <div class="preview-item">
            <i class="bi bi-envelope"></i>
            <span>{{ model.email || 'Chưa có' }}</span>
          </div>

          <div class="preview-item">
            <i class="bi bi-heart-pulse"></i>
            <span>{{ model.tinhTrangSucKhoe || 'Chưa có' }}</span>
          </div>

          <div class="preview-item">
            <i class="bi bi-clipboard2-pulse"></i>
            <span>{{ model.ngayKhamSucKhoe || 'Chưa có' }}</span>
          </div>

          <div v-if="avatarPreview" class="preview-avatar">
            <img :src="avatarPreview" class="preview-avatar-item" />
          </div>
          <div v-else-if="model.anh3x4" class="preview-avatar">
            <img :src="model.anh3x4" class="preview-avatar-item" />
          </div>

          <div v-if="gkskPreview" style="margin-top: 10px">
            <img :src="gkskPreview" style="width: 150px" />
          </div>
          <div v-else-if="model.giayKhamSucKhoe" style="margin-top: 10px">
            <img :src="model.giayKhamSucKhoe" style="width: 150px" />
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toastStore'
import congdanService from '@/services/congdanService'
import MainLayout from '@/components/layout/MainLayout.vue'
import tinhData from '@/assets/data/tinh_tp.json'
const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()

const id = route.params.id

const model = ref({
  hoTen: '',
  ngaySinh: '',
  cccd: '',
  gioiTinh: '',
  diaChi: '',
  soDienThoai: '',
  email: '',
  tinhTrangSucKhoe: '',
  ngayKhamSucKhoe: null,
  anh3x4: '',
  giayKhamSucKhoe: '',
})

const errors = ref({})
const diaChiCuThe = ref('')
const selectedTinh = ref('')
const selectedPhuong = ref('')
const tinhList = ref([])
const phuongList = ref([])
const avatar = ref(null)
const gksk = ref(null)
const avatarPreview = ref(null)
const gkskPreview = ref(null)
const isLoadingData = ref(true)

const fullAddress = computed(() => {
  return `${diaChiCuThe.value} # ${selectedPhuong.value} # ${selectedTinh.value}`
})

function normalizeAddressPart(value) {
  return (value || '').trim().replace(/\s+/g, ' ')
}

watch(selectedTinh, (newVal) => {
  const tinh = tinhList.value.find((t) => t.tentinhmoi === newVal)
  phuongList.value = tinh?.phuongxa || []

  if (!isLoadingData.value) {
    selectedPhuong.value = ''
  }
}, { flush: 'sync' })

onMounted(async () => {
  try {
    // Load danh sách tỉnh
    tinhList.value = tinhData

    // Load dữ liệu công dân
    const data = await congdanService.getById(id)

    if (data) {
      // Convert date format từ C# sang HTML input date
      const ngaySinhDate = new Date(data.ngaySinh)
      const ngaySinhFormatted = ngaySinhDate.toISOString().split('T')[0]

      let ngayKhamFormatted = null
      if (data.ngayKhamSucKhoe) {
        const ngayKhamDate = new Date(data.ngayKhamSucKhoe)
        ngayKhamFormatted = ngayKhamDate.toISOString().split('T')[0]
      }

      model.value = {
        hoTen: data.hoTen,
        ngaySinh: ngaySinhFormatted,
        cccd: data.cccd,
        gioiTinh: data.gioiTinh,
        diaChi: data.diaChi,
        soDienThoai: data.soDienThoai,
        email: data.email,
        tinhTrangSucKhoe: data.tinhTrangSucKhoe,
        ngayKhamSucKhoe: ngayKhamFormatted,
        anh3x4: data.anh3x4,
        giayKhamSucKhoe: data.giayKhamSucKhoe,
      }

      // Parse địa chỉ
      if (data.diaChi) {
        const parts = data.diaChi.split('#').map(normalizeAddressPart)
        if (parts.length === 3) {
          diaChiCuThe.value = parts[0]
          const tempPhuong = parts[1]
          const tempTinh = parts[2]

          // Set tỉnh TRƯỚC để load phuongList
          selectedTinh.value = tempTinh
          const tinh = tinhList.value.find((t) => t.tentinhmoi === tempTinh)
          if (tinh) {
            phuongList.value = tinh.phuongxa
            // SAU ĐÓ mới set phường
            const phuong = phuongList.value.find(
              (p) => normalizeAddressPart(p.tenphuongxa) === tempPhuong,
            )
            selectedPhuong.value = phuong?.tenphuongxa || tempPhuong
          }
        }
      }
    }
  } catch (error) {
    console.error('Lỗi load dữ liệu:', error)
    toastStore.error('Không thể tải dữ liệu công dân!', 'Lỗi')
  } finally {
    isLoadingData.value = false
  }
})

function validate() {
  errors.value = {}

  if (!model.value.hoTen) {
    errors.value.hoTen = 'Họ tên không được để trống'
  }

  if (!model.value.ngaySinh) {
    errors.value.ngaySinh = 'Ngày sinh không được để trống'
  } else {
    const ngaySinh = new Date(model.value.ngaySinh)
    const today = new Date()

    if (ngaySinh.getFullYear() < 1900) {
      errors.value.ngaySinh = 'Ngày sinh phải sau năm 1900'
    }
    if (ngaySinh > today) {
      errors.value.ngaySinh = 'Ngày sinh không hợp lệ'
    }
  }

  if (model.value.soDienThoai && !/^0\d{9}$/.test(model.value.soDienThoai)) {
    errors.value.soDienThoai = 'SĐT phải 10 số và bắt đầu bằng 0'
  }

  if (model.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(model.value.email)) {
    errors.value.email = 'Email không hợp lệ'
  }

  if (model.value.ngayKhamSucKhoe) {
    const ngayKham = new Date(model.value.ngayKhamSucKhoe)
    const ngaySinh = new Date(model.value.ngaySinh)
    const today = new Date()

    if (ngayKham <= ngaySinh) {
      errors.value.ngayKhamSucKhoe = 'Ngày khám phải lớn hơn ngày sinh'
    }
    if (ngayKham > today) {
      errors.value.ngayKhamSucKhoe = 'Ngày khám không hợp lệ'
    }
  }

  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) {
    toastStore.error('Vui lòng kiểm tra lại thông tin!', 'Lỗi xác thực')
    return
  }

  try {
    const formData = new FormData()
    model.value.diaChi = fullAddress.value

    formData.append('HoTen', model.value.hoTen)
    formData.append('NgaySinh', model.value.ngaySinh)
    formData.append('GioiTinh', model.value.gioiTinh || '')
    formData.append('DiaChi', model.value.diaChi || '')
    formData.append('SoDienThoai', model.value.soDienThoai || '')
    formData.append('Email', model.value.email || '')
    formData.append('TinhTrangSucKhoe', model.value.tinhTrangSucKhoe || '')

    if (model.value.ngayKhamSucKhoe) {
      formData.append('NgayKhamSucKhoe', model.value.ngayKhamSucKhoe)
    }

    // Gửi ảnh mới hoặc URL cũ
    if (avatar.value) {
      formData.append('anh3x4', avatar.value)
    } else if (model.value.anh3x4) {
      formData.append('Anh3x4', model.value.anh3x4)
    }

    if (gksk.value) {
      formData.append('giayKham', gksk.value)
    } else if (model.value.giayKhamSucKhoe) {
      formData.append('GiayKhamSucKhoe', model.value.giayKhamSucKhoe)
    }

    await congdanService.update(id, formData)
    toastStore.success('Cập nhật thông tin thành công!')
    router.push('/cong-dan')
  } catch (error) {
    console.error('Error:', error)

    if (error.response) {
      const status = error.response.status
      const message = error.response.data

      switch (status) {
        case 400:
          toastStore.error(`Dữ liệu không hợp lệ: ${message}`, 'Lỗi xác thực')
          break
        case 409:
          toastStore.error(message, 'Trùng lặp dữ liệu')
          break
        case 401:
          toastStore.error('Bạn không có quyền thực hiện thao tác này!', 'Không có quyền')
          break
        case 500:
          toastStore.error('Lỗi máy chủ. Vui lòng thử lại sau!', 'Lỗi hệ thống')
          break
        default:
          toastStore.error(`Có lỗi xảy ra (${status}): ${message}`)
      }
    } else {
      toastStore.error('Không thể kết nối đến máy chủ!', 'Lỗi kết nối')
    }
  }
}

async function onAvatarChange(event) {
  const file = event.target.files[0]
  if (!file) return

  avatar.value = file

  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

async function onGkskChange(event) {
  const file = event.target.files[0]
  if (!file) return

  gksk.value = file

  const reader = new FileReader()
  reader.onload = (e) => {
    gkskPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}
</script>

<style scoped>
@import '@/assets/css/congdan/them_cong_dan.css';

.error-message {
  color: #dc2626;
  font-size: 12px;
  display: block;
  margin-top: 4px;
}
</style>
