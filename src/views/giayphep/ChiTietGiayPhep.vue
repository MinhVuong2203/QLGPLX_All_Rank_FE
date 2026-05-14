<template>
  <main-layout>
    <div class="gp-detail-container">
      <!-- Loading State -->
      <div v-if="loading" class="gp-detail-loading">
        <lord-icon
          src="https://cdn.lordicon.com/xjovhxra.json"
          trigger="loop"
          colors="primary:#2564eb"
          style="width: 80px; height: 80px"
        >
        </lord-icon>
        <p class="gp-detail-loading-text">Đang tải thông tin giấy phép...</p>
      </div>

      <!-- Content -->
      <div v-else-if="giayPhep">
        <!-- Header -->
        <div class="gp-detail-header">
          <div>
            <div class="gp-detail-back" @click="$router.push('/giay-phep')">
              <lord-icon
                src="https://cdn.lordicon.com/zmkotitn.json"
                trigger="hover"
                colors="primary:#64748b"
                style="width: 20px; height: 20px; transform: rotate(90deg)"
              >
              </lord-icon>
              Quay lại danh sách
            </div>
            <h1 class="gp-detail-title">Chi tiết Giấy phép lái xe</h1>
          </div>
          <div class="gp-detail-actions">
            <button class="gp-btn gp-btn-secondary" @click="printLicense">
              <lord-icon
                src="https://cdn.lordicon.com/cgzlioyf.json"
                trigger="hover"
                colors="primary:#64748b"
                style="width: 20px; height: 20px"
              >
              </lord-icon>
              In GPLX
            </button>
            <button class="gp-btn gp-btn-primary" @click="scrollToApproval">
              <lord-icon
                src="https://cdn.lordicon.com/egiwmiit.json"
                trigger="hover"
                colors="primary:#ffffff"
                style="width: 20px; height: 20px"
              >
              </lord-icon>
              Xét duyệt
            </button>
          </div>
        </div>

        <!-- License Cards -->
        <div class="gp-license-cards">
          <!-- Mặt trước -->
          <div class="gp-license-cards-item">
            <div class="gp-card-label">
              <span class="gp-card-label-text">
                <lord-icon
                  src="https://cdn.lordicon.com/nocovwne.json"
                  trigger="loop"
                  colors="primary:#2564eb"
                  style="width: 20px; height: 20px"
                >
                </lord-icon>
                MẶT TRƯỚC
              </span>
            </div>
            <div class="gplx-card">
              <div class="gplx-front-real">
                <!-- nền bảo an -->
                <div class="gplx-security"></div>

                <!-- top -->
                <div class="gplx-real-top">
                  <div class="gplx-ministry">
                    <div>BỘ GTVT</div>
                    <div>MOT</div>
                  </div>

                  <div class="gplx-country-real">
                    <div class="line-1">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div class="line-2">Độc lập - Tự do - Hạnh phúc</div>

                    <div class="gplx-main-title">GIẤY PHÉP LÁI XE/ DRIVER'S LICENSE</div>
                  </div>
                </div>

                <!-- body -->
                <div class="gplx-real-body">
                  <!-- ảnh -->

                  <img class="gplx-real-photo" :src="giayPhep.anh3x4" alt="Ảnh công dân" />

                  <!-- info -->
                  <div class="gplx-real-info">
                    <div class="gplx-number-real">
                      Số/No:
                      <span>{{ giayPhep.soGiayPhep }}</span>
                    </div>
                    <div class="real-row">
                      <span class="label">Họ tên/Full name:</span>
                      <span class="value">{{ Helper.formatUpperCase(giayPhep.tenCongDan) }}</span>
                    </div>

                    <div class="real-row">
                      <span class="label">Ngày sinh/Date of Birth:</span>
                      <span class="value">{{ formatDate(giayPhep.ngaySinh) }}</span>
                    </div>

                    <div class="real-row">
                      <span class="label">Quốc tịch/Nationality:</span>
                      <span class="value">VIỆT NAM</span>
                    </div>

                    <div class="real-row">
                      <span class="label">Nơi cư trú/Address:</span>
                      <span class="value">
                        {{ Helper.formatAddress(giayPhep.diaChi) }}
                      </span>
                    </div>
                    <div class="date-row">
                      <div class="label-date">
                        An Giang, ngày/date {{ date.getDate() }} tháng/month
                        {{ date.getMonth() + 1 }} năm/year {{ date.getFullYear() }}
                      </div>
                      <div class="role-name">PHÓ GIÁM ĐỐC</div>
                    </div>
                  </div>
                </div>
                <!-- bottom -->
                <div class="real-bottom-row">
                  <div>
                    <span class="mini-label">Hạng/Class:</span>
                    <span class="mini-value">{{ giayPhep.maHang }}</span>
                  </div>

                  <div>
                    <span class="mini-label">Có giá trị đến/Expires:</span>
                    <span class="mini-value">
                      {{ giayPhep.ngayHetHan ? formatDate(giayPhep.ngayHetHan) : 'Không thời hạn' }}
                    </span>
                  </div>
                </div>

                <div class="name-people">Đỗ Giám Đốc</div>
              </div>
            </div>
          </div>

          <!-- Mặt sau -->
          <div class="gp-license-cards-item">
            <div class="gp-card-label">
              <span class="gp-card-label-text">
                <lord-icon
                  src="https://cdn.lordicon.com/nocovwne.json"
                  trigger="loop"
                  colors="primary:#f59e0b"
                  style="width: 20px; height: 20px"
                >
                </lord-icon>
                MẶT SAU
              </span>
            </div>
            <div class="gplx-card">
              <div class="gplx-back-real">
                <div class="gplx-back-security"></div>

                <table class="simple-table">
                  <tr>
                    <td>
                      <div class="gplx-back-header">
                        CÁC LOẠI XE CƠ GIỚI ĐƯỜNG BỘ ĐƯỢC ĐIỀU KHIỂN
                      </div>
                      <div class="gplx-back-sub">CLASSIFICATION OF MOTOR VEHICLES</div>
                    </td>
                    <td>
                      <div class="back-right-title">Ngày trúng tuyển</div>
                      <div class="back-right-sub">Beginning date</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="bold start">{{ giayPhep.loaiXe }}</td>
                    <td class="bold">{{ formatDate(giayPhep.ngayCap) }}</td>
                  </tr>
                </table>

                <div class="qr-code">
                  <div class="gplx-code">Đây là qr</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="gp-info-section">
          <h3 class="gp-info-title">
            <lord-icon
              src="https://cdn.lordicon.com/zpxybbhl.json"
              trigger="loop"
              colors="primary:#2564eb"
              style="width: 24px; height: 24px"
            >
            </lord-icon>
            Thông tin chi tiết
          </h3>
          <div class="gp-info-grid">
            <div class="gp-info-item">
              <div class="gp-info-label">Mã công dân</div>
              <div class="gp-info-value">{{ giayPhep.maCongDan }}</div>
            </div>
            <div class="gp-info-item">
              <div class="gp-info-label">Số CCCD/CMND</div>
              <div class="gp-info-value highlight">{{ giayPhep.cccd }}</div>
            </div>
            <div class="gp-info-item">
              <div class="gp-info-label">Hạng giấy phép</div>
              <div class="gp-info-value">{{ giayPhep.maHang }} - {{ giayPhep.tenHang }}</div>
            </div>
            <div class="gp-info-item">
              <div class="gp-info-label">Số giấy phép</div>
              <div class="gp-info-value highlight">{{ giayPhep.soGiayPhep }}</div>
            </div>
            <div class="gp-info-item">
              <div class="gp-info-label">Ngày cấp</div>
              <div class="gp-info-value">{{ formatDateFull(giayPhep.ngayCap) }}</div>
            </div>
            <div class="gp-info-item">
              <div class="gp-info-label">Ngày hết hạn</div>
              <div class="gp-info-value">{{ formatDateFull(giayPhep.ngayHetHan) }}</div>
            </div>
            <div class="gp-info-item">
              <div class="gp-info-label">Số điểm</div>
              <div class="gp-info-value" :style="{ color: getPointsColor(giayPhep.soDiem) }">
                {{ giayPhep.soDiem }} / 12 điểm
              </div>
            </div>
            <div class="gp-info-item">
              <div class="gp-info-label">Trạng thái</div>
              <div class="gp-info-value">
                <span class="gp-badge" :class="getStatusClass(giayPhep.trangThai)">
                  <span class="gp-badge-icon"></span>
                  {{ giayPhep.trangThai }}
                </span>
              </div>
            </div>
            <div class="gp-info-item" v-if="giayPhep.ghiChu" style="grid-column: 1 / -1">
              <div class="gp-info-label">Ghi chú</div>
              <div class="gp-info-value">{{ giayPhep.ghiChu }}</div>
            </div>
          </div>
        </div>

        <!-- Status Update Form -->
        <div class="gp-status-section" ref="approvalSection">
          <h3 class="gp-status-title">
            <lord-icon
              src="https://cdn.lordicon.com/kbtmbyzy.json"
              trigger="loop"
              colors="primary:#2564eb"
              style="width: 24px; height: 24px"
            >
            </lord-icon>
            Xét duyệt và cập nhật trạng thái
          </h3>

          <form @submit.prevent="updateStatus">
            <div class="gp-form-row">
              <div class="gp-form-group">
                <label class="gp-form-label required">Trạng thái</label>
                <select class="gp-form-select" v-model="updateForm.trangThai" required>
                  <option value="">-- Chọn trạng thái --</option>
                  <option value="Chờ duyệt">Chờ duyệt</option>
                  <option value="Còn hiệu lực">Còn hiệu lực</option>
                  <option value="Hết hạn">Hết hạn</option>
                  <option value="Bị thu hồi">Bị thu hồi</option>
                </select>
              </div>

              <div class="gp-form-group">
                <label class="gp-form-label">Số điểm (0-12)</label>
                <input
                  type="number"
                  class="gp-form-input"
                  v-model.number="updateForm.soDiem"
                  min="0"
                  max="12"
                  placeholder="Nhập số điểm"
                />
              </div>
            </div>

            <div class="gp-form-group">
              <label class="gp-form-label">Ghi chú</label>
              <textarea
                class="gp-form-textarea"
                v-model="updateForm.ghiChu"
                placeholder="Nhập ghi chú (nếu có)..."
              ></textarea>
            </div>

            <div class="gp-form-actions">
              <button type="button" class="gp-btn gp-btn-secondary" @click="resetForm">
                <lord-icon
                  src="https://cdn.lordicon.com/rsbokaso.json"
                  trigger="hover"
                  colors="primary:#64748b"
                  style="width: 18px; height: 18px"
                >
                </lord-icon>
                Đặt lại
              </button>
              <button type="submit" class="gp-btn gp-btn-primary">
                <lord-icon
                  src="https://cdn.lordicon.com/lomfljuq.json"
                  trigger="hover"
                  colors="primary:#ffffff"
                  style="width: 20px; height: 20px"
                >
                </lord-icon>
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import giayPhepService from '@/services/giayPhepService'

import { useToastStore } from '@/stores/toastStore'
import { useLoadingStore } from '@/stores/loadingStore'
import MainLayout from '@/components/layout/MainLayout.vue'
import { Helper } from '@/utils/helper'

const route = useRoute()
const router = useRouter()

const toastStore = useToastStore()
const loadingStore = useLoadingStore()

const approvalSection = ref(null)

const giayPhep = ref(null)

const loading = ref(false)

const date = new Date()

const updateForm = ref({
  trangThai: '',
  soDiem: null,
  ghiChu: '',
})

const allCategories = ref(['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'C', 'D', 'E', 'F', 'FB2', 'FC'])

onMounted(() => {
  fetchData()

  // Load Lordicon script
  if (!document.querySelector('script[src*="lordicon"]')) {
    const script = document.createElement('script')

    script.src = 'https://cdn.lordicon.com/lordicon.js'

    document.head.appendChild(script)
  }
})

async function fetchData() {
  const id = route.params.id

  loading.value = true

  try {
    giayPhep.value = await giayPhepService.getById(id)

    updateForm.value.trangThai = giayPhep.value.trangThai
    updateForm.value.soDiem = giayPhep.value.soDiem
    updateForm.value.ghiChu = giayPhep.value.ghiChu || ''
  } catch (error) {
    toastStore.addToast('Lỗi khi tải thông tin giấy phép', 'error')

    router.push('/giay-phep')
  } finally {
    loading.value = false
  }
}

async function updateStatus() {
  loadingStore.show()

  try {
    await giayPhepService.update(giayPhep.value.giayPhepId, updateForm.value)

    toastStore.addToast('Cập nhật trạng thái thành công', 'success')

    fetchData()
  } catch (error) {
    toastStore.addToast('Lỗi khi cập nhật trạng thái', 'error')
  } finally {
    loadingStore.hide()
  }
}

function resetForm() {
  updateForm.value.trangThai = giayPhep.value.trangThai

  updateForm.value.soDiem = giayPhep.value.soDiem

  updateForm.value.ghiChu = giayPhep.value.ghiChu || ''
}

function scrollToApproval() {
  approvalSection.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

function printLicense() {
  window.print()
}

function formatDate(dateString) {
  if (!dateString) return '-'

  const [year, month, day] = dateString.split('-')

  return `${day}/${month}/${year}`
}

function formatDateShort(dateString) {
  if (!dateString) return '-'

  const [year, month, day] = dateString.split('-')

  return `${day}/${month}/${year.slice(-2)}`
}

function formatDateFull(dateString) {
  if (!dateString) return '-'

  const date = new Date(dateString)

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    weekday: 'long',
  })
}

function getStatusClass(status) {
  const map = {
    'Còn hiệu lực': 'active',
    'Hết hạn': 'expired',
    'Bị thu hồi': 'revoked',
  }

  return map[status] || ''
}

function getPointsColor(points) {
  if (points <= 3) return '#ef4444'

  if (points <= 6) return '#f59e0b'

  return '#10b981'
}
</script>

<style scoped>
@import '@/assets/css/giayphep/chi-tiet-giay-phep.css';
</style>
