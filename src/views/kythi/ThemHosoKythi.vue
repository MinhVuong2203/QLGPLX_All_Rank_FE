<template>
  <MainLayout>
    <div class="them-ho-so-container">
      <!-- HEADER -->

      <div class="page-header-compact">
        <button type="button" class="btn-back" @click="goBack">
          <i class="bi bi-arrow-left"></i>
          Quay lại
        </button>

        <div class="header-content">
          <div class="header-title">
            <i class="bi bi-person-plus-fill"></i>

            <div>
              <h1>Thêm thí sinh vào kỳ thi</h1>

              <p class="subtitle">
                {{ kyThiInfo?.tenKyThi }}
              </p>
            </div>
          </div>

          <div class="header-info">
            <span class="info-badge">
              <i class="bi bi-mortarboard"></i>

              {{ kyThiInfo?.tenHang }}
            </span>

            <span class="info-badge">
              <i class="bi bi-people"></i>

              {{ kyThiInfo?.soLuongDangKy }}
              /
              {{ kyThiInfo?.soLuongToiDa }}
            </span>
          </div>
        </div>
      </div>

      <div class="content-wrapper">
        <!-- LEFT -->

        <div class="left-panel">
          <div class="panel-header">
            <h3>
              <i class="bi bi-file-earmark-check"></i>

              Hồ sơ đã duyệt

              <span class="count-badge">
                {{ filteredHoSo.length }}
              </span>
            </h3>
          </div>

          <!-- FILTER -->

          <div class="filter-section">
            <div class="search-box">
              <i class="bi bi-search"></i>

              <input v-model="searchText" type="text" placeholder="Tìm theo tên, CCCD..." />
            </div>

            <div class="date-filter">
              <input v-model="fromDate" type="date" />

              <span>→</span>

              <input v-model="toDate" type="date" />
            </div>
          </div>

          <!-- LIST -->

          <div v-if="!pagedHoSo.length" class="empty-state-small">
            <i class="bi bi-inbox"></i>

            <p>Không tìm thấy hồ sơ nào</p>
          </div>

          <div v-else class="ho-so-list">
            <div
              v-for="hs in pagedHoSo"
              :key="hs.hoSoID"
              class="ho-so-item"
              :class="{
                selected: selectedHoSo.includes(hs.hoSoID),
                disabled: isHoSoDisabled(hs),
              }"
              @click="toggleSelection(hs)"
            >
              <div class="ho-so-checkbox">
                <i v-if="isKyThiEnded" class="bi bi-lock-fill text-secondary"></i>

                <i v-else-if="hs.daDangKyKyThi" class="bi bi-check-circle-fill text-success"></i>

                <i v-else-if="selectedHoSo.includes(hs.hoSoID)" class="bi bi-check-square-fill"></i>

                <i v-else class="bi bi-square"></i>
              </div>

              <div class="ho-so-info">
                <div class="ho-so-name">
                  {{ hs.hoTenCongDan }}
                </div>

                <div class="ho-so-details">
                  <span>
                    <i class="bi bi-credit-card"></i>
                    {{ hs.cccd }}
                  </span>

                  <span>
                    <i class="bi bi-calendar3"></i>

                    {{ new Date(hs.ngayNop).toLocaleDateString('vi-VN') }}
                  </span>
                </div>

                <div v-if="hs.daDangKyKyThi" class="badge-registered">Đã đăng ký</div>

                <div v-else-if="isKyThiEnded" class="badge-registered">Kỳ thi đã kết thúc</div>
              </div>
            </div>
          </div>

          <!-- PAGINATION -->

          <div class="pagination">
            <button type="button" :disabled="currentPage === 1" @click="prevPage">
              <i class="bi bi-caret-left"></i>
            </button>

            <span> Trang {{ currentPage }} </span>

            <button type="button" @click="nextPage">
              <i class="bi bi-caret-right"></i>
            </button>
          </div>
        </div>

        <!-- RIGHT -->

        <div class="right-panel">
          <div class="selected-section">
            <div class="panel-header">
              <h3>
                <i class="bi bi-check-circle"></i>

                Đã chọn

                <span class="count-badge primary">
                  {{ selectedHoSo.length }}
                </span>
              </h3>

              <button
                v-if="selectedHoSo.length"
                type="button"
                class="btn-clear-all"
                @click="clearSelection"
              >
                <i class="bi bi-x-circle"></i>

                Bỏ chọn tất cả
              </button>
            </div>

            <div v-if="!selectedHoSo.length" class="empty-state-small">
              <i class="bi bi-hand-index"></i>

              <p>Chưa chọn hồ sơ nào</p>
            </div>

            <div v-else class="selected-list">
              <div v-for="id in selectedHoSo" :key="id" class="selected-item">
                <template v-for="hs in hoSoDaDuyet" :key="hs.hoSoID">
                  <div v-if="hs.hoSoID === id" class="item-info">
                    <div class="item-name">
                      {{ hs.hoTenCongDan }}
                    </div>

                    <div class="item-detail">
                      {{ hs.cccd }}
                    </div>
                  </div>
                </template>

                <button type="button" class="btn-remove" @click="removeFromSelection(id)">
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>

              <div class="action-section">
                <button
                  type="button"
                  class="btn-add-all"
                  :disabled="isSubmitting || isKyThiEnded"
                  @click="handleAddHoSo"
                >
                  <template v-if="isSubmitting">
                    <span class="spinner-border spinner-border-sm"></span>

                    <span> Đang thêm... </span>
                  </template>

                  <template v-else>
                    <i class="bi bi-plus-circle"></i>

                    <span>
                      Thêm
                      {{ selectedHoSo.length }}
                      hồ sơ vào kỳ thi
                    </span>
                  </template>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- REGISTERED -->

      <div class="registered-section">
        <div class="panel-header">
          <h3>
            <i class="bi bi-people-fill"></i>

            Thí sinh đã đăng ký

            <span class="count-badge success">
              {{ hoSoTrongKyThi.length }}
            </span>
          </h3>
        </div>

        <div v-if="!pagedRegistered.length" class="empty-state-small">
          <i class="bi bi-person-x"></i>

          <p>Chưa có thí sinh nào</p>
        </div>

        <div v-else class="registered-list">
          <div v-for="hs in pagedRegistered" :key="hs.hoSoID" class="registered-item">
            <div class="item-info">
              <div class="item-name">
                {{ hs.hoTenCongDan }}
              </div>

              <div class="item-detail">
                {{ hs.cccd }}
              </div>
            </div>

            <button type="button" class="btn-remove-small" @click="handleRemoveHoSo(hs.hoSoID)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
@import '@/assets/css/kythi/them-ho-so-vao-ky-thi.css';
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import api from '@/services/api'

import MainLayout from '@/components/layout/MainLayout.vue'

import { useToastStore } from '@/stores/toastStore'
import { useLoadingStore } from '@/stores/loadingStore'

const route = useRoute()
const router = useRouter()

const toastStore = useToastStore()
const loadingStore = useLoadingStore()

const kyThiId = route.params.id

const kyThiInfo = ref(null)

const hoSoDaDuyet = ref([])
const hoSoTrongKyThi = ref([])

const selectedHoSo = ref([])

const searchText = ref('')

const fromDate = ref('')
const toDate = ref('')

const isSubmitting = ref(false)

const currentPage = ref(1)
const pageSize = ref(5)

const currentPageRegistered = ref(1)
const pageSizeRegistered = ref(5)

const isKyThiEnded = computed(() => {
  if (!kyThiInfo.value?.ngayKetThuc) return false

  return normalizeDate(kyThiInfo.value.ngayKetThuc) < normalizeDate(new Date())
})

const showLoading = () => {
  loadingStore.show()
}

const hideLoading = () => {
  loadingStore.hide()
}

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  try {
    showLoading()

    await loadKyThiInfo()
    await loadHoSoTrongKyThi()
    await loadHoSoDaDuyet()
  } finally {
    hideLoading()
  }
}

const loadKyThiInfo = async () => {
  try {
    const res = await api.get(`/api/KyThi/${kyThiId}`)

    kyThiInfo.value = res.data
  } catch (err) {
    console.error(err)

    toastStore.show('Không thể tải thông tin kỳ thi', 'error', 'Lỗi hệ thống')
  }
}

const loadHoSoDaDuyet = async () => {
  try {
    const maHang = kyThiInfo.value?.maHang || ''

    const res = await api.get(`/api/KyThi/hoso-da-duyet?maHang=${maHang}`)

    const idsInKyThi = hoSoTrongKyThi.value.map((x) => x.hoSoID)

    hoSoDaDuyet.value = (res.data || []).filter(
      (hs) => !idsInKyThi.includes(hs.hoSoID) && !hs.daDangKyKyThi,
    )
  } catch (err) {
    console.error(err)

    toastStore.show('Không thể tải danh sách hồ sơ', 'error', 'Lỗi hệ thống')
  }
}

const loadHoSoTrongKyThi = async () => {
  try {
    const res = await api.get(`/api/KyThi/${kyThiId}/hoso`)

    hoSoTrongKyThi.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const filteredHoSo = computed(() => {
  return hoSoDaDuyet.value.filter((h) => {
    const matchSearch =
      !searchText.value ||
      h.hoTenCongDan?.toLowerCase().includes(searchText.value.toLowerCase()) ||
      h.cccd?.toLowerCase().includes(searchText.value.toLowerCase())

    const matchFrom = !fromDate.value || new Date(h.ngayNop) >= new Date(fromDate.value)

    const matchTo = !toDate.value || new Date(h.ngayNop) <= new Date(toDate.value)

    return matchSearch && matchFrom && matchTo
  })
})

const pagedHoSo = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value

  return filteredHoSo.value.slice(start, start + pageSize.value)
})

const pagedRegistered = computed(() => {
  const start = (currentPageRegistered.value - 1) * pageSizeRegistered.value

  return hoSoTrongKyThi.value.slice(start, start + pageSizeRegistered.value)
})

const toggleSelection = (hs) => {
  if (isHoSoDisabled(hs)) return

  const index = selectedHoSo.value.indexOf(hs.hoSoID)

  if (index > -1) {
    selectedHoSo.value.splice(index, 1)
  } else {
    selectedHoSo.value.push(hs.hoSoID)
  }
}

const removeFromSelection = (id) => {
  selectedHoSo.value = selectedHoSo.value.filter((x) => x !== id)
}

const clearSelection = () => {
  selectedHoSo.value = []
}

const handleAddHoSo = async () => {
  if (isKyThiEnded.value) {
    toastStore.show(
      'Kỳ thi đã kết thúc, không thể thêm thí sinh',
      'warning',
      'Không thể thực hiện',
    )

    return
  }

  if (!selectedHoSo.value.length) {
    toastStore.show('Vui lòng chọn ít nhất một hồ sơ', 'warning', 'Thiếu dữ liệu')

    return
  }

  try {
    isSubmitting.value = true

    showLoading()

    const dto = {
      kyThiID: Number(kyThiId),
      danhSachHoSoID: selectedHoSo.value,
    }

    await api.post('/api/KyThi/them-hoso', dto)

    toastStore.show(
      `Đã thêm ${selectedHoSo.value.length} hồ sơ vào kỳ thi`,
      'success',
      'Thành công',
    )

    selectedHoSo.value = []

    await loadData()
  } catch (err) {
    console.error(err)

    toastStore.show(
      err.response?.data?.message || 'Đã xảy ra lỗi khi thêm hồ sơ',
      'error',
      'Lỗi hệ thống',
    )
  } finally {
    isSubmitting.value = false

    hideLoading()
  }
}

const handleRemoveHoSo = async (hoSoId) => {
  try {
    showLoading()

    await api.delete(`/api/KyThi/${kyThiId}/hoso/${hoSoId}`)

    toastStore.show('Đã xóa hồ sơ khỏi kỳ thi', 'success', 'Thành công')

    await loadData()
  } catch (err) {
    console.error(err)

    toastStore.show('Không thể xóa hồ sơ', 'error', 'Lỗi hệ thống')
  } finally {
    hideLoading()
  }
}

const nextPage = () => {
  if (currentPage.value * pageSize.value < filteredHoSo.value.length) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPageRegistered = () => {
  if (currentPageRegistered.value * pageSizeRegistered.value < hoSoTrongKyThi.value.length) {
    currentPageRegistered.value++
  }
}

const prevPageRegistered = () => {
  if (currentPageRegistered.value > 1) {
    currentPageRegistered.value--
  }
}

const goBack = () => {
  router.push('/ky-thi')
}

const isHoSoDisabled = (hs) => {
  return isKyThiEnded.value || hs.daDangKyKyThi
}

const normalizeDate = (value) => {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}
</script>
