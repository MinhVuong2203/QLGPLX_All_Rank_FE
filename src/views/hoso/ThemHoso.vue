<template>
  <MainLayout>
    <link href="/css/hoso/them-ho-so.css" rel="stylesheet" />

    <div class="page-container">
      <!-- HEADER -->

      <div class="page-header">
        <div class="page-header-content">
          <div>
            <h1 class="page-title">Tạo hồ sơ đăng ký GPLX</h1>

            <p class="page-subtitle">Điền thông tin để đăng ký thi giấy phép lái xe</p>
          </div>
        </div>
      </div>

      <div class="form-layout">
        <!-- STEP 1 -->

        <div class="form-section">
          <div class="section-header">
            <div class="step-badge">Bước 1</div>

            <h2 class="section-title">Chọn công dân</h2>
          </div>

          <!-- FILTER -->

          <div class="filter-bar">
            <div class="filter-group">
              <label>
                <input type="checkbox" v-model="onlyNoHoso" @change="onFilterChanged" />

                Chưa có hồ sơ
              </label>
            </div>

            <div class="filter-group">
              <label>
                <input type="checkbox" v-model="onlyToday" @change="onFilterChanged" />

                Thêm hôm nay
              </label>
            </div>

            <div class="filter-group">
              <input
                type="text"
                placeholder="Nhập CCCD..."
                class="filter-input"
                v-model="searchCCCD"
                @input="onFilterChanged"
              />
            </div>

            <div class="filter-stats">
              <span class="stat-badge stat-primary">
                Đã chọn:
                <strong>
                  {{ selectedCongDans.length }}
                </strong>
              </span>
            </div>
          </div>

          <!-- TABLE -->

          <div v-if="loading" class="loading-box">
            <div class="spinner"></div>
            <span>Đang tải...</span>
          </div>

          <div v-else class="table-container">
            <table class="congdan-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" :checked="isAllSelected" @change="toggleAllCongDan" />
                  </th>

                  <th>Họ tên</th>
                  <th>CCCD</th>
                  <th>SĐT</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="cd in paginatedCongDan"
                  :key="cd.maCongDan"
                  @click="toggleCongDan(cd.maCongDan)"
                >
                  <td>
                    <input
                      type="checkbox"
                      :checked="selectedCongDans.includes(cd.maCongDan)"
                      :disabled="hasHosoWithSelectedHang(cd.maCongDan)"
                      @click.stop
                      @change="toggleCongDan(cd.maCongDan)"
                    />
                  </td>

                  <td>
                    {{ cd.hoTen }}
                  </td>

                  <td>
                    {{ cd.cccd }}
                  </td>

                  <td>
                    {{ cd.soDienThoai }}
                  </td>

                  <td>
                    <span
                      v-if="hasHosoWithSelectedHang(cd.maCongDan)"
                      class="status-badge status-exists"
                    >
                      Đã có hồ sơ
                    </span>

                    <span v-else class="status-badge status-available"> Chưa đăng ký </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-if="danhSachCongDan.length > pageSize" class="pagination-bar">
              <div class="pagination-info">
                Hiển thị {{ pageStart }}-{{ pageEnd }} / {{ danhSachCongDan.length }}
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
          </div>
        </div>

        <!-- STEP 2 -->

        <div class="form-section">
          <div class="section-header">
            <div class="step-badge">Bước 2</div>

            <h2 class="section-title">Chọn hạng giấy phép lái xe</h2>
          </div>

          <div class="section-content">
            <div class="hang-grid">
              <div v-for="hang in danhSachHang" :key="hang.maHang" class="hang-border">
                <div
                  class="hang-card"
                  :class="{
                    selected: selectedMaHang === hang.maHang,
                  }"
                  @click="selectHang(hang)"
                >
                  <div class="hang-badge">
                    {{ hang.maHang }}
                  </div>

                  <h5>
                    {{ hang.tenHang }}
                  </h5>

                  <p>
                    {{ hang.loaiXe }}
                  </p>

                  <div v-if="selectedMaHang === hang.maHang" class="selected-badge">✔</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 3 -->

        <div class="form-section">
          <div class="section-header">
            <div class="step-badge">Bước 3</div>

            <h2 class="section-title">Ghi chú</h2>
          </div>

          <div class="section-content">
            <textarea
              class="form-textarea"
              rows="4"
              placeholder="Nhập ghi chú..."
              v-model="ghiChu"
            ></textarea>
          </div>
        </div>

        <!-- ACTION -->

        <div class="form-actions">
          <button class="btn-secondary" @click="router.push('/ho-so')">Hủy</button>

          <button class="btn-primary" @click="submitForm" :disabled="!isFormValid">
            Tạo
            {{ selectedCongDans.length }}
            hồ sơ
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import MainLayout from '@/components/layout/MainLayout.vue'
import { useToastStore } from '@/stores/toastStore'
import { useLoadingStore } from '@/stores/loadingStore'

const router = useRouter()

const danhSachCongDan = ref([])
const danhSachHang = ref([])
const danhSachHoSo = ref([])

const loading = ref(false)

const selectedCongDans = ref([])
const selectedMaHang = ref('')
const ghiChu = ref('')

const toastStore = useToastStore()
const loadingStore = useLoadingStore()
const showLoading = () => {
  loadingStore.show()
}
const hideLoading = () => {
  loadingStore.hide()
}

// Filter
const onlyNoHoso = ref(false)
const onlyToday = ref(true)
const searchCCCD = ref('')
const currentPage = ref(1)
const pageSize = 10

onMounted(() => {
  loadData()
})

const loadData = async () => {
  try {
    showLoading()

    const [hangRes, hosoRes] = await Promise.all([
      api.get('/api/HangGiayPhep'),
      api.get('/api/Hoso'),
    ])

    danhSachHang.value = hangRes.data
    danhSachHoSo.value = hosoRes.data

    await loadCongDan()
  } catch (err) {
    console.error(err)

    toastStore.show('Không thể tải dữ liệu', 'error', 'Lỗi hệ thống')
  } finally {
    hideLoading()
  }
}

const loadCongDan = async () => {
  try {
    showLoading()

    let response

    if (searchCCCD.value.trim()) {
      onlyNoHoso.value = false
      onlyToday.value = false

      response = await api.get(`/api/CongDan/search?cccd=${searchCCCD.value}`)
    } else if (onlyNoHoso.value) {
      response = await api.get('/api/CongDan/chua-co-hoso')
    } else if (onlyToday.value) {
      response = await api.get('/api/CongDan/hom-nay')
    } else {
      response = await api.get('/api/CongDan')
    }

    danhSachCongDan.value = response.data
    currentPage.value = 1
  } catch (err) {
    console.error(err)

    toastStore.show('Không thể tải danh sách công dân', 'error', 'Lỗi hệ thống')
  } finally {
    hideLoading()
  }
}

const onFilterChanged = async () => {
  await loadCongDan()
}

const totalPages = computed(() => Math.max(1, Math.ceil(danhSachCongDan.value.length / pageSize)))

const paginatedCongDan = computed(() => {
  const start = (currentPage.value - 1) * pageSize

  return danhSachCongDan.value.slice(start, start + pageSize)
})

const pageStart = computed(() => {
  if (!danhSachCongDan.value.length) return 0

  return (currentPage.value - 1) * pageSize + 1
})

const pageEnd = computed(() => Math.min(currentPage.value * pageSize, danhSachCongDan.value.length))

const goToPage = (page) => {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}

const hasHosoWithSelectedHang = (id) => {
  if (!selectedMaHang.value) return false

  return danhSachHoSo.value.some((h) => h.maCongDan === id && h.maHang === selectedMaHang.value)
}

const toggleCongDan = (id) => {
  if (hasHosoWithSelectedHang(id)) return

  const index = selectedCongDans.value.indexOf(id)

  if (index > -1) {
    selectedCongDans.value.splice(index, 1)
  } else {
    selectedCongDans.value.push(id)
  }
}

const toggleAllCongDan = (event) => {
  const isChecked = event.target.checked

  if (isChecked) {
    paginatedCongDan.value.forEach((cd) => {
      if (
        !hasHosoWithSelectedHang(cd.maCongDan) &&
        !selectedCongDans.value.includes(cd.maCongDan)
      ) {
        selectedCongDans.value.push(cd.maCongDan)
      }
    })
  } else {
    selectedCongDans.value = []
  }
}

const isAllSelected = computed(() => {
  if (!paginatedCongDan.value.length) return false

  const available = paginatedCongDan.value.filter((cd) => !hasHosoWithSelectedHang(cd.maCongDan))

  return available.every((cd) => selectedCongDans.value.includes(cd.maCongDan))
})

const selectHang = (hang) => {
  selectedMaHang.value = hang.maHang

  selectedCongDans.value = selectedCongDans.value.filter((id) => !hasHosoWithSelectedHang(id))
}

const isFormValid = computed(() => {
  return selectedCongDans.value.length > 0 && selectedMaHang.value
})

const submitForm = async () => {
  if (!selectedCongDans.value.length) {
    toastStore.show('Vui lòng chọn ít nhất 1 công dân', 'warning', 'Thiếu dữ liệu')

    return
  }

  if (!selectedMaHang.value) {
    toastStore.show('Vui lòng chọn hạng GPLX', 'warning', 'Thiếu dữ liệu')

    return
  }

  try {
    showLoading()

    let success = 0
    let fail = 0

    const errors = []

    for (const id of selectedCongDans.value) {
      const model = {
        maCongDan: id,
        maHang: selectedMaHang.value,
        ghiChu: ghiChu.value,
      }

      try {
        await api.post('/api/Hoso', model)

        success++
      } catch (err) {
        fail++

        const errorMessage =
          err?.response?.data?.message || err?.response?.data || err.message || 'Unknown error'

        errors.push(`ID ${id}: ${errorMessage}`)
      }
    }

    if (success > 0) {
      toastStore.show(`Tạo thành công ${success} hồ sơ`, 'success', 'Thành công')
    }

    if (fail > 0) {
      toastStore.show(`Thất bại ${fail} hồ sơ`, 'error', 'Có lỗi xảy ra')

      console.error(errors)
    }

    if (success > 0) {
      setTimeout(() => {
        router.push('/ho-so')
      }, 1000)
    }
  } catch (err) {
    console.error(err)

    toastStore.show('Không thể tạo hồ sơ', 'error', 'Lỗi hệ thống')
  } finally {
    hideLoading()
  }
}
</script>

<style scoped>
@import '@/assets/css/hoso/them-ho-so.css';
</style>
