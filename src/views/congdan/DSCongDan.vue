<template>
  <main-layout>
    <div class="congdan-page">
      <div class="page-header">
        <h1>Quản lý công dân</h1>
        <p class="subtitle">Danh sách công dân và thông tin chi tiết</p>
      </div>

      <div class="toolbar">
        <div class="toolbar-left">
          <div class="search-box">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <input
              v-model="searchCCCD"
              @input="filterData"
              placeholder="Tìm theo CCCD..."
              class="search-input-cd"
            />
          </div>

          <div class="date-picker">
            <svg class="calendar-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect
                x="3"
                y="4"
                width="14"
                height="14"
                rx="2"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M3 8h14M7 2v4M13 2v4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <input type="date" v-model="selectedDate" class="date-input" />
          </div>
        </div>

        <div class="toolbar-right">
          <button class="btn-filter" @click="filterData">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 6h12M6 10h8M8 14h4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            Lọc
          </button>
          <button class="btn-primary" @click="resetFilter">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 4l12 12M16 4L4 16"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            Xóa lọc
          </button>
          <router-link to="/cong-dan/them-moi" class="btn-success">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 4v12M4 10h12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            Bổ sung công dân
          </router-link>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="header-left">
            <h2>Danh sách công dân</h2>
            <span class="count-badge">{{ filteredCongdan.length }} người</span>
          </div>
          <div class="header-right">
            <span class="text-muted">Trang {{ currentPage }}/{{ totalPages }}</span>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ và tên</th>
                <th>Ngày sinh</th>
                <th>Tuổi</th>
                <th>Giới tính</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paginatedCongdan.length === 0">
                <td colspan="8" class="empty-cell">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="1.5"
                      opacity="0.3"
                    />
                    <path
                      d="M12 8v4M12 16h.01"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                  <p>Không tìm thấy dữ liệu</p>
                </td>
              </tr>
              <tr
                v-else
                v-for="(cd, index) in paginatedCongdan"
                :key="cd.publicId"
                class="data-row"
              >
                <td class="text-center">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td class="name-cell">
                  <div class="avatar">{{ getInitials(cd.hoTen) }}</div>
                  <span>{{ cd.hoTen }}</span>
                </td>
                <td>{{ formatDate(cd.ngaySinh) }}</td>
                <td class="text-center">{{ calculateAge(cd.ngaySinh) }}</td>
                <td>
                  <span
                    :class="[
                      'gender-badge',
                      cd.gioiTinh?.toLowerCase() === 'nam' ? 'male' : 'female',
                    ]"
                  >
                    {{ cd.gioiTinh }}
                  </span>
                </td>
                <td>{{ cd.soDienThoai || '—' }}</td>
                <td class="email-cell">{{ cd.email || '—' }}</td>
                <td class="action-cell">
                  <router-link
                    :to="`/cong-dan/chinh-sua/${cd.publicId}`"
                    class="btn-icon btn-edit"
                    title="Chỉnh sửa"
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M14.5 2.5a2.121 2.121 0 0 1 3 3L6 17H3v-3L14.5 2.5z"
                        stroke="currentColor"
                        stroke-width="2"
                      />
                    </svg>
                  </router-link>
                  <button
                    class="btn-icon btn-delete"
                    @click="deleteCongdan(cd.publicId)"
                    title="Xóa"
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M3 5h14M8 5V3h4v2M16 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5"
                        stroke="currentColor"
                        stroke-width="2"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="totalPages > 1" class="pagination">
          <button class="pagination-btn" @click="firstPage" :disabled="currentPage === 1">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M15 18L7 10l8-8M11 18L3 10l8-8" stroke="currentColor" stroke-width="2" />
            </svg>
          </button>
          <button class="pagination-btn" @click="previousPage" :disabled="currentPage === 1">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M12 18L4 10l8-8" stroke="currentColor" stroke-width="2" />
            </svg>
          </button>

          <button
            v-for="page in getPageNumbers()"
            :key="page"
            :class="['pagination-btn', { active: page === currentPage }]"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>

          <button class="pagination-btn" @click="nextPage" :disabled="currentPage === totalPages">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M8 2l8 8-8 8" stroke="currentColor" stroke-width="2" />
            </svg>
          </button>
          <button class="pagination-btn" @click="lastPage" :disabled="currentPage === totalPages">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M5 2l8 8-8 8M9 2l8 8-8 8" stroke="currentColor" stroke-width="2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </main-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToastStore } from '@/stores/toastStore'
import congdanService from '@/services/congdanService'
import { Helper } from '@/utils/helper'
import MainLayout from '@/components/layout/MainLayout.vue'

const toastStore = useToastStore()

const congdan = ref([])
const filteredCongdan = ref([])
const searchCCCD = ref('')
const selectedDate = ref(new Date().toISOString().split('T')[0])

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)

const totalPages = computed(() => Math.ceil(filteredCongdan.value.length / pageSize.value))

const paginatedCongdan = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCongdan.value.slice(start, end)
})

onMounted(async () => {
  await loadData()
})

async function loadData() {
  try {
    congdan.value = await congdanService.getAll()
    filterData()
  } catch (error) {
    console.error('Lỗi tải dữ liệu:', error)
    toastStore.error('Không thể tải dữ liệu!', 'Lỗi')
  }
}

function filterData() {
  if (searchCCCD.value.trim()) {
    filteredCongdan.value = congdan.value.filter((cd) =>
      cd.cccd?.toLowerCase().includes(searchCCCD.value.toLowerCase()),
    )
  } else {
    filteredCongdan.value = congdan.value.filter((cd) => {
      if (!cd.ngayTao) return true
      const ngayTaoDate = new Date(cd.ngayTao).toISOString().split('T')[0]
      return ngayTaoDate === selectedDate.value
    })
  }
  currentPage.value = 1
}

function resetFilter() {
  searchCCCD.value = ''
  selectedDate.value = new Date().toISOString().split('T')[0]
  filteredCongdan.value = congdan.value
  currentPage.value = 1
}

async function deleteCongdan(id) {
  if (!confirm('Bạn có chắc chắn muốn xóa công dân này?')) return

  try {
    await congdanService.delete(id)
    toastStore.success('Xóa công dân thành công!')
    await loadData()
  } catch (error) {
    console.error('Lỗi xóa:', error)
    toastStore.error('Không thể xóa công dân!', 'Lỗi')
  }
}

// Pagination methods
function firstPage() {
  currentPage.value = 1
}

function previousPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function lastPage() {
  currentPage.value = totalPages.value
}

function goToPage(page) {
  currentPage.value = page
}

function getPageNumbers() {
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

// Helper methods
function getInitials(name) {
  return Helper.getInitials(name)
}

function calculateAge(dateOfBirth) {
  return Helper.calculateAge(dateOfBirth)
}

function formatDate(date) {
  return Helper.formatDate(date)
}
</script>

<style scoped>
@import '@/assets/css/congdan/ds_congdan.css';
</style>
