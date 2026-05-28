<template>
  <main-layout>
    <div class="giayphep-container">
      <!-- Header -->
      <div class="gp-header">
        <div class="gp-title-section">
          <div class="gp-title-icon">
            <lord-icon
              src="https://cdn.lordicon.com/wxnxiano.json"
              trigger="loop"
              colors="primary:#ffffff,secondary:#ffffff"
              style="width: 32px; height: 32px"
            >
            </lord-icon>
          </div>
          <div class="gp-title-text">
            <h1>Quản lý Giấy phép lái xe</h1>
            <p>Quản lý và theo dõi các giấy phép lái xe đã cấp</p>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="gp-stats-grid">
        <div class="gp-stat-card">
          <div class="gp-stat-header">
            <div class="gp-stat-icon">
              <lord-icon
                src="https://cdn.lordicon.com/nocovwne.json"
                trigger="loop"
                colors="primary:#2564eb"
                style="width: 36px; height: 36px"
              >
              </lord-icon>
            </div>
          </div>
          <div class="gp-stat-number">{{ statistics.total || 0 }}</div>
          <div class="gp-stat-label">Tổng giấy phép</div>
        </div>

        <div class="gp-stat-card">
          <div class="gp-stat-header">
            <div class="gp-stat-icon">
              <lord-icon
                src="https://cdn.lordicon.com/egiwmiit.json"
                trigger="loop"
                colors="primary:#10b981"
                style="width: 36px; height: 36px"
              >
              </lord-icon>
            </div>
          </div>
          <div class="gp-stat-number">{{ statistics.conHieuLuc || 0 }}</div>
          <div class="gp-stat-label">Còn hiệu lực</div>
        </div>

        <div class="gp-stat-card">
          <div class="gp-stat-header">
            <div class="gp-stat-icon">
              <lord-icon
                src="https://cdn.lordicon.com/hrqwmuhr.json"
                trigger="loop"
                colors="primary:#f59e0b"
                style="width: 36px; height: 36px"
              >
              </lord-icon>
            </div>
          </div>
          <div class="gp-stat-number">{{ statistics.sapHetHan || 0 }}</div>
          <div class="gp-stat-label">Sắp hết hạn</div>
        </div>

        <div class="gp-stat-card">
          <div class="gp-stat-header">
            <div class="gp-stat-icon">
              <lord-icon
                src="https://cdn.lordicon.com/gwvmctbb.json"
                trigger="loop"
                colors="primary:#ef4444"
                style="width: 36px; height: 36px"
              >
              </lord-icon>
            </div>
          </div>
          <div class="gp-stat-number">{{ statistics.hetHan || 0 }}</div>
          <div class="gp-stat-label">Hết hạn</div>
        </div>
      </div>

      <!-- Search & Filter Controls -->
      <div class="gp-controls">
        <div class="gp-controls-row">
          <div class="gp-control-group">
            <label class="gp-control-label">Tìm kiếm</label>
            <div class="gp-search-box">
              <lord-icon
                src="https://cdn.lordicon.com/xfftupfv.json"
                trigger="loop"
                colors="primary:#64748b"
                class="gp-search-icon"
                style="width: 20px; height: 20px"
              >
              </lord-icon>
              <input
                type="text"
                class="gp-search-input"
                placeholder="Tìm theo tên, CCCD, số GPLX..."
                v-model="searchParams.searchTerm"
                @input="debounceSearch"
              />
            </div>
          </div>

          <div class="gp-control-group" style="max-width: 200px">
            <label class="gp-control-label">Trạng thái</label>
            <select class="gp-select" v-model="searchParams.trangThai" @change="fetchData">
              <option value="">Tất cả</option>
              <option value="Chờ duyệt">Chờ duyệt</option>
              <option value="Còn hiệu lực">Còn hiệu lực</option>
              <option value="Hết hạn">Hết hạn</option>
              <option value="Bị thu hồi">Bị thu hồi</option>
            </select>
          </div>

          <div class="gp-control-group" style="max-width: 180px">
            <label class="gp-control-label">Từ ngày</label>
            <input
              type="date"
              class="gp-date-input"
              v-model="searchParams.ngayCapFrom"
              @change="fetchData"
            />
          </div>

          <div class="gp-control-group" style="max-width: 180px">
            <label class="gp-control-label">Đến ngày</label>
            <input
              type="date"
              class="gp-date-input"
              v-model="searchParams.ngayCapTo"
              @change="fetchData"
            />
          </div>

          <div class="gp-control-group" style="max-width: 120px">
            <label class="gp-control-label">Hiển thị</label>
            <select
              class="gp-select"
              v-model="searchParams.pageSize"
              @change="handlePageSizeChange"
            >
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>

          <button class="gp-btn gp-btn-secondary" @click="resetFilters" style="margin-top: 24px">
            <lord-icon
              src="https://cdn.lordicon.com/rsbokaso.json"
              trigger="hover"
              colors="primary:#64748b"
              style="width: 18px; height: 18px"
            >
            </lord-icon>
            Đặt lại
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="gp-table-container">
        <div class="gp-table-wrapper">
          <table class="gp-table">
            <thead>
              <tr>
                <th class="sortable" :class="getSortClass('hoTen')" @click="sort('hoTen')">
                  Người sở hữu
                  <lord-icon
                    src="https://cdn.lordicon.com/xhdhjbqi.json"
                    trigger="hover"
                    colors="primary:#64748b"
                    class="gp-sort-icon"
                    style="width: 16px; height: 16px"
                  >
                  </lord-icon>
                </th>
                <th
                  class="sortable"
                  :class="getSortClass('soGiayPhep')"
                  @click="sort('soGiayPhep')"
                >
                  Số GPLX
                  <lord-icon
                    src="https://cdn.lordicon.com/xhdhjbqi.json"
                    trigger="hover"
                    colors="primary:#64748b"
                    class="gp-sort-icon"
                    style="width: 16px; height: 16px"
                  >
                  </lord-icon>
                </th>
                <th>Hạng</th>
                <th class="sortable" :class="getSortClass('ngayCap')" @click="sort('ngayCap')">
                  Ngày cấp
                  <lord-icon
                    src="https://cdn.lordicon.com/xhdhjbqi.json"
                    trigger="hover"
                    colors="primary:#64748b"
                    class="gp-sort-icon"
                    style="width: 16px; height: 16px"
                  >
                  </lord-icon>
                </th>
                <th
                  class="sortable"
                  :class="getSortClass('ngayHetHan')"
                  @click="sort('ngayHetHan')"
                >
                  Ngày hết hạn
                  <lord-icon
                    src="https://cdn.lordicon.com/xhdhjbqi.json"
                    trigger="hover"
                    colors="primary:#64748b"
                    class="gp-sort-icon"
                    style="width: 16px; height: 16px"
                  >
                  </lord-icon>
                </th>
                <th>Điểm</th>
                <th class="sortable" :class="getSortClass('trangThai')" @click="sort('trangThai')">
                  Trạng thái
                  <lord-icon
                    src="https://cdn.lordicon.com/xhdhjbqi.json"
                    trigger="hover"
                    colors="primary:#64748b"
                    class="gp-sort-icon"
                    style="width: 16px; height: 16px"
                  >
                  </lord-icon>
                </th>
                <th style="text-align: right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="giayPheps.length === 0">
                <td colspan="8">
                  <div class="gp-empty-state">
                    <lord-icon
                      src="https://cdn.lordicon.com/wjyqkiew.json"
                      trigger="loop"
                      colors="primary:#64748b"
                      class="gp-empty-icon"
                      style="width: 120px; height: 120px"
                    >
                    </lord-icon>
                    <div class="gp-empty-title">Không tìm thấy giấy phép</div>
                    <div class="gp-empty-text">
                      Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-else v-for="gp in giayPheps" :key="gp.giayPhepId">
                <td>
                  <div class="gp-user-cell">
                    <div class="gp-avatar">{{ Helper.getInitials(gp.tenCongDan) }}</div>
                    <div class="gp-user-info">
                      <div class="gp-user-name">{{ gp.tenCongDan }}</div>
                      <div class="gp-user-cccd">{{ gp.cccd }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="gp-license-number">{{ gp.soGiayPhep }}</span>
                </td>
                <td>
                  <span style="font-weight: 600; color: var(--accent)">{{ gp.maHang }}</span>
                </td>
                <td>{{ formatDate(gp.ngayCap) }}</td>
                <td>{{ formatDate(gp.ngayHetHan) }}</td>
                <td>
                  <div class="gp-points" :class="{ low: gp.soDiem < 6 }">
                    <span class="gp-points-number">{{ gp.soDiem }}</span>
                    <span class="gp-points-label">/ 12</span>
                  </div>
                </td>
                <td>
                  <span class="gp-badge" :class="getStatusClass(getDisplayStatus(gp))">
                    <span class="gp-badge-icon"></span>
                    {{ getDisplayStatus(gp) }}
                  </span>
                </td>
                <td>
                  <div class="gp-actions">
                    <button
                      class="gp-action-btn view"
                      @click="viewDetail(gp.giayPhepId)"
                      title="Xem chi tiết"
                    >
                      <lord-icon
                        src="https://cdn.lordicon.com/dicvhxpz.json"
                        trigger="hover"
                        colors="primary:#2564eb"
                        style="width: 20px; height: 20px"
                      >
                      </lord-icon>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="gp-pagination" v-if="!loading && giayPheps.length > 0">
          <div class="gp-pagination-info">
            Hiển thị {{ (pagination.pageNumber - 1) * pagination.pageSize + 1 }} -
            {{ Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalRecords) }}
            trên {{ pagination.totalRecords }} kết quả
          </div>
          <div class="gp-pagination-controls">
            <button
              class="gp-page-btn"
              @click="goToPage(1)"
              :disabled="pagination.pageNumber === 1"
            >
              <lord-icon
                src="https://cdn.lordicon.com/zmkotitn.json"
                trigger="hover"
                colors="primary:#64748b"
                style="width: 16px; height: 16px"
              >
              </lord-icon>
            </button>
            <button
              class="gp-page-btn"
              @click="goToPage(pagination.pageNumber - 1)"
              :disabled="pagination.pageNumber === 1"
            >
              <lord-icon
                src="https://cdn.lordicon.com/xhdhjbqi.json"
                trigger="hover"
                colors="primary:#64748b"
                style="width: 16px; height: 16px; transform: rotate(90deg)"
              >
              </lord-icon>
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              class="gp-page-btn"
              :class="{ active: page === pagination.pageNumber }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>

            <button
              class="gp-page-btn"
              @click="goToPage(pagination.pageNumber + 1)"
              :disabled="pagination.pageNumber === pagination.totalPages"
            >
              <lord-icon
                src="https://cdn.lordicon.com/xhdhjbqi.json"
                trigger="hover"
                colors="primary:#64748b"
                style="width: 16px; height: 16px; transform: rotate(-90deg)"
              >
              </lord-icon>
            </button>
            <button
              class="gp-page-btn"
              @click="goToPage(pagination.totalPages)"
              :disabled="pagination.pageNumber === pagination.totalPages"
            >
              <lord-icon
                src="https://cdn.lordicon.com/zmkotitn.json"
                trigger="hover"
                colors="primary:#64748b"
                style="width: 16px; height: 16px; transform: rotate(180deg)"
              >
              </lord-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import MainLayout from '@/components/layout/MainLayout.vue'

import giayPhepService from '@/services/giayPhepService'

import { useToastStore } from '@/stores/toastStore'
import { useLoadingStore } from '@/stores/loadingStore'
import { Helper } from '@/utils/helper'

const router = useRouter()

const toastStore = useToastStore()
const loadingStore = useLoadingStore()

const giayPheps = ref([])

const statistics = ref({})

const searchTimeout = ref(null)

const searchParams = ref({
  searchTerm: '',
  trangThai: '',
  ngayCapFrom: '',
  ngayCapTo: '',
  sortBy: 'ngayCap',
  sortOrder: 'desc',
  pageNumber: 1,
  pageSize: 10,
})

const pagination = ref({
  totalRecords: 0,
  pageNumber: 1,
  pageSize: 10,
  totalPages: 0,
})

const visiblePages = computed(() => {
  const current = pagination.value.pageNumber
  const total = pagination.value.totalPages

  if (total <= 0) return []

  const delta = 2
  const range = []
  const rangeWithDots = []

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (current + delta < total - 1) {
    rangeWithDots.push('...', total)
  } else if (total > 1) {
    rangeWithDots.push(total)
  }

  return rangeWithDots.filter((v, i, a) => a.indexOf(v) === i)
})

onMounted(() => {
  fetchData()
  fetchStatistics()

  if (!document.querySelector('script[src*="lordicon"]')) {
    const script = document.createElement('script')
    script.src = 'https://cdn.lordicon.com/lordicon.js'
    document.head.appendChild(script)
  }
})

async function fetchData() {
  loadingStore.show()
  try {
    const result = await giayPhepService.getAll(searchParams.value)

    giayPheps.value = result.data

    pagination.value = {
      totalRecords: result.totalRecords,
      pageNumber: result.pageNumber,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    }
  } catch (error) {
    toastStore.error('Lỗi khi tải danh sách giấy phép')
  } finally {
    loadingStore.hide()
  }
}

async function fetchStatistics() {
  try {
    statistics.value = await giayPhepService.getStatistics()
  } catch (error) {
    console.error('Error fetching statistics:', error)
  }
}

function debounceSearch() {
  clearTimeout(searchTimeout.value)

  searchTimeout.value = setTimeout(() => {
    searchParams.value.pageNumber = 1
    fetchData()
  }, 500)
}

function handleFilterChange() {
  searchParams.value.pageNumber = 1
  fetchData()
}

function sort(field) {
  if (searchParams.value.sortBy === field) {
    searchParams.value.sortOrder = searchParams.value.sortOrder === 'asc' ? 'desc' : 'asc'
  } else {
    searchParams.value.sortBy = field
    searchParams.value.sortOrder = 'asc'
  }

  fetchData()
}

function getSortClass(field) {
  if (searchParams.value.sortBy === field) {
    return {
      active: true,
      desc: searchParams.value.sortOrder === 'desc',
    }
  }

  return {}
}

function goToPage(page) {
  if (page !== '...' && page >= 1 && page <= pagination.value.totalPages) {
    searchParams.value.pageNumber = page
    fetchData()
  }
}

function handlePageSizeChange() {
  searchParams.value.pageNumber = 1
  fetchData()
}

function resetFilters() {
  searchParams.value = {
    searchTerm: '',
    trangThai: '',
    ngayCapFrom: '',
    ngayCapTo: '',
    sortBy: 'ngayCap',
    sortOrder: 'desc',
    pageNumber: 1,
    pageSize: 10,
  }

  fetchData()
}

function viewDetail(id) {
  router.push(`/giay-phep/chi-tiet/${id}`)
}

function formatDate(dateString) {
  if (!dateString) return '-'

  const [year, month, day] = dateString.split('-')

  return `${day}/${month}/${year}`
}

function getDisplayStatus(license) {
  if (license.trangThai === 'Chờ duyệt' || license.trangThai === 'Chá» duyá»‡t') {
    return 'Chờ duyệt'
  }

  if ((license.soDiem ?? 0) === 0) return 'Bị thu hồi'

  if (isExpired(license.ngayHetHan)) return 'Hết hạn'

  return 'Còn hiệu lực'
}

function isExpired(dateString) {
  if (!dateString) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const expiredDate = new Date(dateString)
  expiredDate.setHours(0, 0, 0, 0)

  return expiredDate < today
}

function getStatusClass(status) {
  const map = {
    'Chờ duyệt': 'pending',
    'Còn hiệu lực': 'active',
    'Hết hạn': 'expired',
    'Bị thu hồi': 'revoked',
  }

  return map[status] || ''
}
</script>

<style scoped>
@import '@/assets/css/giayphep/ds-giay-phep.css';
</style>
