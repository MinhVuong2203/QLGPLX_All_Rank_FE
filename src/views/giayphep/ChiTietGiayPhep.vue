<template>
  <main-layout>
    <div class="gp-detail-container">
      <div v-if="loading" class="gp-detail-loading">
        <lord-icon
          src="https://cdn.lordicon.com/xjovhxra.json"
          trigger="loop"
          colors="primary:#2564eb"
          style="width: 80px; height: 80px"
        />
        <p class="gp-detail-loading-text">Đang tải thông tin giấy phép...</p>
      </div>

      <div v-else-if="giayPhep">
        <div class="gp-detail-header">
          <div>
            <div class="gp-detail-back" @click="$router.push('/giay-phep')">
              <lord-icon
                src="https://cdn.lordicon.com/zmkotitn.json"
                trigger="hover"
                colors="primary:#64748b"
                style="width: 20px; height: 20px; transform: rotate(90deg)"
              />
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
              />
              In GPLX
            </button>
            <button v-if="canApprove" class="gp-btn gp-btn-primary" @click="scrollToAction">
              Duyệt
            </button>
            <button v-else-if="canReissue" class="gp-btn gp-btn-primary" @click="scrollToAction">
              {{ reissueLabel }}
            </button>
          </div>
        </div>

        <div class="gp-license-cards">
          <div class="gp-license-cards-item">
            <div class="gp-card-label">
              <span class="gp-card-label-text">MẶT TRƯỚC</span>
            </div>
            <div class="gplx-card">
              <div class="gplx-front-real">
                <div class="gplx-security"></div>
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

                <div class="gplx-real-body">
                  <img class="gplx-real-photo" :src="giayPhep.anh3x4" alt="Ảnh công dân" />
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
                      <span class="value">{{ Helper.formatAddress(giayPhep.diaChi) }}</span>
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

          <div class="gp-license-cards-item">
            <div class="gp-card-label">
              <span class="gp-card-label-text">MẶT SAU</span>
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
                  <img
                    v-if="giayPhep.qrCodeDataUrl"
                    class="gplx-code"
                    :src="giayPhep.qrCodeDataUrl"
                    alt="Mã QR giấy phép lái xe"
                  />
                  <div v-else class="gplx-code-placeholder">QR</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="gp-info-section">
          <h3 class="gp-info-title">Thông tin chi tiết</h3>
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
                <span class="gp-badge" :class="getStatusClass(displayStatus)">
                  <span class="gp-badge-icon"></span>
                  {{ displayStatus }}
                </span>
              </div>
            </div>
            <div class="gp-info-item" v-if="giayPhep.ghiChu" style="grid-column: 1 / -1">
              <div class="gp-info-label">Ghi chú</div>
              <div class="gp-info-value">{{ giayPhep.ghiChu }}</div>
            </div>
          </div>
        </div>

        <div class="gp-history-section">
          <h3 class="gp-info-title">Lịch sử giấy phép</h3>
          <div v-if="historyLoading" class="gp-history-empty">Đang tải lịch sử...</div>
          <div v-else-if="lichSu.length === 0" class="gp-history-empty">
            Chưa có lịch sử thao tác cho giấy phép này.
          </div>
          <div v-else class="gp-timeline">
            <div v-for="item in lichSu" :key="item.lichSuId" class="gp-timeline-item">
              <div class="gp-timeline-dot"></div>
              <div class="gp-timeline-content">
                <div class="gp-timeline-head">
                  <span class="gp-timeline-action">{{ formatAction(item.loaiThaoTac) }}</span>
                  <span class="gp-timeline-date">{{ formatDateTime(item.ngayThucHien) }}</span>
                </div>
                <div class="gp-timeline-license">{{ item.soGiayPhep }}</div>
                <div class="gp-timeline-dates">
                  <span>Ngày cấp: {{ formatDate(item.ngayCapCu) }} -> {{ formatDate(item.ngayCapMoi) }}</span>
                  <span>Hết hạn: {{ formatDate(item.ngayHetHanCu) }} -> {{ formatDate(item.ngayHetHanMoi) }}</span>
                </div>
                <div v-if="item.lyDo" class="gp-timeline-note">{{ item.lyDo }}</div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="canApprove" class="gp-status-section" ref="actionSection">
          <h3 class="gp-status-title">Duyệt giấy phép</h3>
          <form @submit.prevent="approveLicense">
            <div class="gp-form-group">
              <label class="gp-form-label">Ghi chú</label>
              <textarea
                class="gp-form-textarea"
                v-model="actionForm.ghiChu"
                placeholder="Nhập ghi chú khi duyệt..."
              ></textarea>
            </div>
            <div class="gp-form-actions">
              <button type="button" class="gp-btn gp-btn-secondary" @click="resetActionForm">
                Đặt lại
              </button>
              <button type="submit" class="gp-btn gp-btn-primary">Duyệt</button>
            </div>
          </form>
        </div>

        <div v-else-if="canReissue" class="gp-status-section" ref="actionSection">
          <h3 class="gp-status-title">{{ reissueLabel }}</h3>
          <form @submit.prevent="reissueLicense">
            <div class="gp-action-note">
              Thao tác này sẽ đặt lại số điểm về 12, ngày cấp là hôm nay và ngày hết hạn theo
              thời hạn của hạng giấy phép.
            </div>
            <div class="gp-form-group">
              <label class="gp-form-label">Lý do / ghi chú</label>
              <textarea
                class="gp-form-textarea"
                v-model="actionForm.ghiChu"
                placeholder="Nhập lý do cấp mới/cấp lại..."
              ></textarea>
            </div>
            <div class="gp-form-actions">
              <button type="button" class="gp-btn gp-btn-secondary" @click="resetActionForm">
                Đặt lại
              </button>
              <button type="submit" class="gp-btn gp-btn-primary">{{ reissueLabel }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main-layout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import MainLayout from '@/components/layout/MainLayout.vue'
import giayPhepService from '@/services/giayPhepService'
import { useLoadingStore } from '@/stores/loadingStore'
import { useToastStore } from '@/stores/toastStore'
import { Helper } from '@/utils/helper'

const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()
const loadingStore = useLoadingStore()

const actionSection = ref(null)
const giayPhep = ref(null)
const lichSu = ref([])
const loading = ref(false)
const historyLoading = ref(false)
const date = new Date()

const actionForm = ref({
  ghiChu: '',
})

const displayStatus = computed(() => getDisplayStatus(giayPhep.value))
const canApprove = computed(() => displayStatus.value === 'Chờ duyệt')
const canReissue = computed(() => displayStatus.value === 'Bị thu hồi' || displayStatus.value === 'Hết hạn')
const reissueLabel = computed(() => (displayStatus.value === 'Bị thu hồi' ? 'Cấp mới GPLX' : 'Cấp lại GPLX'))

onMounted(() => {
  fetchData()

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
    actionForm.value.ghiChu = giayPhep.value.ghiChu || ''

    await fetchHistory()
  } catch (error) {
    toastStore.error('Lỗi khi tải thông tin giấy phép')
    router.push('/giay-phep')
  } finally {
    loading.value = false
  }
}

async function fetchHistory() {
  historyLoading.value = true

  try {
    lichSu.value = await giayPhepService.getLichSu(route.params.id)
  } catch (error) {
    toastStore.error('Lỗi khi tải lịch sử giấy phép')
  } finally {
    historyLoading.value = false
  }
}

async function approveLicense() {
  loadingStore.show()

  try {
    await giayPhepService.duyet(giayPhep.value.giayPhepId, actionForm.value)
    toastStore.success('Duyệt giấy phép thành công')
    await fetchData()
  } catch (error) {
    toastStore.error('Lỗi khi duyệt giấy phép')
  } finally {
    loadingStore.hide()
  }
}

async function reissueLicense() {
  loadingStore.show()

  try {
    await giayPhepService.capLai(giayPhep.value.giayPhepId, actionForm.value)
    toastStore.success(`${reissueLabel.value} thành công`)
    await fetchData()
  } catch (error) {
    toastStore.error('Lỗi khi cấp lại giấy phép')
  } finally {
    loadingStore.hide()
  }
}

function resetActionForm() {
  actionForm.value.ghiChu = giayPhep.value?.ghiChu || ''
}

function scrollToAction() {
  actionSection.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

async function printLicense() {
  const cards = Array.from(document.querySelectorAll('.gplx-card'))

  if (cards.length === 0) {
    toastStore.error('Khong tim thay GPLX de in')
    return
  }

  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  iframe.setAttribute('aria-hidden', 'true')
  document.body.appendChild(iframe)

  const printDocument = iframe.contentDocument
  const styleNodes = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((node) => node.outerHTML)
    .join('')

  const cardHtml = cards
    .map((card) => `<section class="print-card-item">${card.outerHTML}</section>`)
    .join('')

  printDocument.open()
  printDocument.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>In GPLX</title>
        ${styleNodes}
        <style>
          @page {
            size: A4 landscape;
            margin: 12mm;
          }

          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            margin: 0;
            background: #ffffff;
          }

          .print-license-page {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 14mm;
            width: 100%;
          }

          .print-card-item {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .print-card-item .gplx-card {
            width: 520px !important;
            box-shadow: none !important;
            transform: none !important;
          }
        </style>
      </head>
      <body>
        <main class="print-license-page">
          ${cardHtml}
        </main>
      </body>
    </html>
  `)
  printDocument.close()

  await waitForPrintAssets(printDocument)

  iframe.contentWindow.focus()
  iframe.contentWindow.print()

  setTimeout(() => {
    iframe.remove()
  }, 1000)
}

function waitForPrintAssets(printDocument) {
  const images = Array.from(printDocument.images)

  if (images.length === 0) {
    return Promise.resolve()
  }

  return Promise.all(
    images.map((image) => {
      if (image.complete) return Promise.resolve()

      return new Promise((resolve) => {
        image.onload = resolve
        image.onerror = resolve
      })
    }),
  )
}

function getDisplayStatus(license) {
  if (!license) return ''
  if (license.trangThai === 'Chờ duyệt') return 'Chờ duyệt'
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

function formatDate(dateString) {
  if (!dateString) return '-'

  const [year, month, day] = dateString.split('-')

  return `${day}/${month}/${year}`
}

function formatDateTime(dateString) {
  if (!dateString) return '-'

  return new Date(dateString).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDateFull(dateString) {
  if (!dateString) return '-'

  const dateValue = new Date(dateString)

  return dateValue.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    weekday: 'long',
  })
}

function formatAction(action) {
  const map = {
    DUYET: 'Duyệt giấy phép',
    CAP_MOI: 'Cấp mới GPLX',
    CAP_LAI: 'Cấp lại GPLX',
    GIA_HAN: 'Gia hạn GPLX',
    THU_HOI: 'Thu hồi GPLX',
  }

  return map[action] || action
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

function getPointsColor(points) {
  if (points <= 3) return '#ef4444'
  if (points <= 6) return '#f59e0b'
  return '#10b981'
}
</script>

<style scoped>
@import '@/assets/css/giayphep/chi-tiet-giay-phep.css';
</style>
