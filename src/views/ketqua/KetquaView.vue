<!-- views/KetQua.vue -->
<template>
  <MainLayout>
    <div class="ketqua-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <lord-icon
              src="https://cdn.lordicon.com/fhtaantg.json"
              trigger="loop"
              delay="2000"
              colors="primary:#6366f1,secondary:#8b5cf6"
              style="width: 48px; height: 48px"
            >
            </lord-icon>
            Quản Lý Kết Quả Thi
          </h1>

          <p class="page-subtitle">Quản lý kết quả thi GPLX</p>
        </div>
      </div>

      <!-- Select kỳ thi -->
      <div class="content-card">
        <div class="card-header">
          <h3>
            <lord-icon
              src="https://cdn.lordicon.com/nocovwne.json"
              trigger="hover"
              colors="primary:#6366f1,secondary:#8b5cf6"
              style="width: 24px; height: 24px"
            >
            </lord-icon>
            Chọn Kỳ Thi
          </h3>
        </div>

        <div class="card-body">
          <select v-model="selectedKyThiId" @change="loadKetQua" class="exam-select">
            <option value="">-- Chọn kỳ thi --</option>

            <option v-for="kt in kyThiList" :key="kt.kyThiID" :value="kt.kyThiID">
              {{ kt.tenKyThi }} - {{ kt.maHang }}
            </option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div v-if="selectedKyThiId" class="content-card">
        <div class="card-header">
          <h3>
            <lord-icon
              src="https://cdn.lordicon.com/bhfjfgqz.json"
              trigger="hover"
              colors="primary:#6366f1,secondary:#8b5cf6"
              style="width: 24px; height: 24px"
            >
            </lord-icon>
            Danh Sách Thí Sinh
          </h3>

          <div class="search-box">
            <lord-icon
              src="https://cdn.lordicon.com/kkvxgpti.json"
              trigger="hover"
              colors="primary:#6366f1,secondary:#8b5cf6"
              class="search-icon-lord"
              style="width: 20px; height: 20px"
            >
            </lord-icon>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm..."
              class="search-input"
            />
          </div>
        </div>

        <div class="table-container">
          <table class="results-table">
            <thead>
              <tr>
                <th>Họ Tên</th>
                <th>CCCD</th>
                <th>Ngày Sinh</th>
                <th>Hạng</th>
                <th>Kết Quả</th>
                <th>Thao Tác</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="hs in filteredList" :key="hs.hoSoID">
                <td>{{ hs.hoTen }}</td>

                <td>{{ hs.cccd }}</td>

                <td>
                  {{ formatDate(hs.ngaySinh) }}
                </td>

                <td>{{ hs.maHang }}</td>

                <td>
                  <span
                    v-if="getLastResult(hs)"
                    :class="['badge', getLastResult(hs) === 'Đạt' ? 'success' : 'danger']"
                  >
                    {{ getLastResult(hs) }}
                  </span>

                  <span v-else> Chưa thi </span>
                </td>

                <td>
                  <button class="btn-action" @click="openKetQuaModal(hs)">
                    <lord-icon
                      src="https://cdn.lordicon.com/wuvorxbv.json"
                      trigger="hover"
                      colors="primary:#ffffff,secondary:#ffffff"
                      style="width: 18px; height: 18px"
                    >
                    </lord-icon>
                    Quản lý
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal -->
      <teleport to="body">
        <transition name="modal">
          <div v-if="showScoreModal" class="modal-overlay" @click.self="closeScoreModal">
            <div class="modal-container score-modal-vertical">
              <!-- Header -->
              <div class="modal-header">
                <h3>
                  <lord-icon
                    src="https://cdn.lordicon.com/fhtaantg.json"
                    trigger="loop"
                    delay="2000"
                    colors="primary:#6366f1,secondary:#8b5cf6"
                    style="width: 32px; height: 32px"
                  >
                  </lord-icon>
                  Quản Lý Kết Quả Thi
                </h3>

                <button class="btn-close" @click="closeScoreModal">✕</button>
              </div>

              <!-- Body -->
              <div class="modal-body">
                <!-- Info -->
                <div class="student-info-box">
                  <div class="info-row">
                    <lord-icon
                      src="https://cdn.lordicon.com/hrjifpbq.json"
                      trigger="hover"
                      colors="primary:#6366f1,secondary:#8b5cf6"
                      style="width: 20px; height: 20px"
                    >
                    </lord-icon>
                    <div>
                      <strong>Họ tên:</strong>
                      {{ selectedHoSo?.hoTen }}
                    </div>
                  </div>

                  <div class="info-row">
                    <lord-icon
                      src="https://cdn.lordicon.com/zrtfxghu.json"
                      trigger="hover"
                      colors="primary:#6366f1,secondary:#8b5cf6"
                      style="width: 20px; height: 20px"
                    >
                    </lord-icon>
                    <div>
                      <strong>CCCD:</strong>
                      {{ selectedHoSo?.cccd }}
                    </div>
                  </div>

                  <div class="info-row">
                    <lord-icon
                      src="https://cdn.lordicon.com/abfverha.json"
                      trigger="hover"
                      colors="primary:#6366f1,secondary:#8b5cf6"
                      style="width: 20px; height: 20px"
                    >
                    </lord-icon>
                    <div>
                      <strong>Ngày sinh:</strong>
                      {{ formatDate(selectedHoSo?.ngaySinh) }}
                    </div>
                  </div>

                  <div class="info-row">
                    <lord-icon
                      src="https://cdn.lordicon.com/jvihlqtw.json"
                      trigger="hover"
                      colors="primary:#6366f1,secondary:#8b5cf6"
                      style="width: 20px; height: 20px"
                    >
                    </lord-icon>
                    <div>
                      <strong>Hạng GPLX:</strong>
                      {{ selectedHoSo?.maHang }}
                    </div>
                  </div>
                </div>

                <!-- Timeline lần thi -->
                <div class="attempts-wrapper">
                  <div
                    v-for="(attempt, index) in lanThiForms"
                    :key="index"
                    :class="['attempt-card', { 'locked-attempt': !attempt.editable }]"
                  >
                    <!-- Header -->
                    <div class="attempt-header">
                      <div class="attempt-header-left">
                        <lord-icon
                          v-if="attempt.editable"
                          src="https://cdn.lordicon.com/egiwmiit.json"
                          trigger="loop"
                          delay="1500"
                          colors="primary:#10b981,secondary:#6366f1"
                          style="width: 28px; height: 28px"
                        >
                        </lord-icon>
                        <lord-icon
                          v-else
                          src="https://cdn.lordicon.com/yqzmiobz.json"
                          colors="primary:#9ca3af,secondary:#6b7280"
                          style="width: 28px; height: 28px"
                        >
                        </lord-icon>
                        <div>
                          <h3>Lần thi {{ attempt.lanThi }}</h3>

                          <span :class="['badge', attempt.allPassed ? 'success' : 'danger']">
                            {{ attempt.allPassed ? 'ĐẠT' : 'KHÔNG ĐẠT' }}
                          </span>
                        </div>
                      </div>

                      <div v-if="!attempt.editable" class="locked-badge">
                        <lord-icon
                          src="https://cdn.lordicon.com/yqzmiobz.json"
                          colors="primary:#9ca3af,secondary:#6b7280"
                          style="width: 18px; height: 18px"
                        >
                        </lord-icon>
                        Đã khóa
                      </div>
                    </div>

                    <!-- Subjects -->
                    <div class="exam-list-vertical">
                      <div
                        v-for="(mon, monIndex) in attempt.chiTiet"
                        :key="monIndex"
                        class="exam-item"
                      >
                        <!-- Left -->
                        <div class="exam-left">
                          <div class="exam-title-row">
                            <h4>
                              <lord-icon
                                src="https://cdn.lordicon.com/wxnxiano.json"
                                trigger="hover"
                                colors="primary:#6366f1,secondary:#8b5cf6"
                                style="width: 20px; height: 20px"
                              >
                              </lord-icon>
                              {{ mon.tenMon }}
                            </h4>

                            <span
                              :class="[
                                'badge',
                                mon.diem >= mon.diemDat && !mon.saiCauLiet ? 'success' : 'danger',
                              ]"
                            >
                              {{ mon.diem >= mon.diemDat && !mon.saiCauLiet ? 'Đạt' : 'Không đạt' }}
                            </span>
                          </div>

                          <div class="exam-meta">
                            <span>
                              <lord-icon
                                src="https://cdn.lordicon.com/wzrwaorf.json"
                                trigger="hover"
                                colors="primary:#6366f1,secondary:#8b5cf6"
                                style="width: 16px; height: 16px"
                              >
                              </lord-icon>
                              Điểm đạt:
                              {{ mon.diemDat }}
                            </span>

                            <span>
                              <lord-icon
                                src="https://cdn.lordicon.com/fpmskzsv.json"
                                trigger="hover"
                                colors="primary:#6366f1,secondary:#8b5cf6"
                                style="width: 16px; height: 16px"
                              >
                              </lord-icon>
                              Điểm tối đa:
                              {{ mon.diemToiDa }}
                            </span>
                          </div>

                          <!-- Sai câu liệt -->
                          <div
                            v-if="mon.tenMon?.toLowerCase().includes('lý thuyết')"
                            class="critical-checkbox"
                          >
                            <label class="checkbox-label">
                              <input
                                type="checkbox"
                                v-model="mon.saiCauLiet"
                                :disabled="!attempt.editable"
                                @change="handleSaiCauLiet(mon)"
                              />

                              <span>
                                <lord-icon
                                  src="https://cdn.lordicon.com/nqtddedc.json"
                                  trigger="hover"
                                  colors="primary:#ef4444,secondary:#dc2626"
                                  style="width: 16px; height: 16px"
                                >
                                </lord-icon>
                                Sai câu liệt
                              </span>
                            </label>
                          </div>
                        </div>

                        <!-- Right -->
                        <div class="exam-right">
                          <div class="score-control">
                            <button
                              type="button"
                              class="score-btn"
                              @click="decrementScore(mon, attempt)"
                              :disabled="!attempt.editable"
                            >
                              -
                            </button>

                            <input
                              v-model.number="mon.diem"
                              type="number"
                              class="score-input"
                              :min="0"
                              :max="mon.saiCauLiet ? mon.diemToiDa - 1 : mon.diemToiDa"
                              :disabled="!attempt.editable"
                              @input="updateResult(mon, attempt)"
                            />

                            <button
                              type="button"
                              class="score-btn"
                              @click="incrementScore(mon, attempt)"
                              :disabled="!attempt.editable"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Footer -->
                    <div class="attempt-footer">
                      <div class="result-summary">
                        <lord-icon
                          :src="
                            attempt.allPassed
                              ? 'https://cdn.lordicon.com/guqkthkk.json'
                              : 'https://cdn.lordicon.com/tdrtiskw.json'
                          "
                          trigger="loop"
                          delay="2000"
                          :colors="
                            attempt.allPassed
                              ? 'primary:#10b981,secondary:#059669'
                              : 'primary:#ef4444,secondary:#dc2626'
                          "
                          style="width: 24px; height: 24px"
                        >
                        </lord-icon>
                        <strong> Kết quả tổng hợp: </strong>

                        <span :class="['badge', attempt.allPassed ? 'success' : 'danger']">
                          {{ attempt.allPassed ? 'ĐẠT' : 'KHÔNG ĐẠT' }}
                        </span>
                      </div>

                      <!-- Failed subjects -->
                      <div v-if="attempt.failedSubjects.length" class="failed-subject-box">
                        <strong>
                          <lord-icon
                            src="https://cdn.lordicon.com/jxwksgwv.json"
                            trigger="hover"
                            colors="primary:#ef4444,secondary:#dc2626"
                            style="width: 20px; height: 20px"
                          >
                          </lord-icon>
                          Môn cần thi lại:
                        </strong>

                        <ul>
                          <li v-for="failed in attempt.failedSubjects" :key="failed.monThiID">
                            {{ failed.tenMon }}
                          </li>
                        </ul>
                      </div>

                      <!-- Create next -->
                      <button
                        v-if="!attempt.allPassed && attempt.editable"
                        class="btn btn-warning"
                        @click="handleCreateNextAttempt(attempt)"
                      >
                        <lord-icon
                          src="https://cdn.lordicon.com/jgnvfzqg.json"
                          trigger="hover"
                          colors="primary:#ffffff,secondary:#ffffff"
                          style="width: 20px; height: 20px"
                        >
                        </lord-icon>
                        Tạo Lần Thi Tiếp Theo
                      </button>

                      <!-- Save -->
                      <button
                        v-if="attempt.editable"
                        class="btn btn-primary"
                        @click="saveAttempt(attempt)"
                      >
                        <lord-icon
                          src="https://cdn.lordicon.com/hqymfzvj.json"
                          trigger="hover"
                          colors="primary:#ffffff,secondary:#ffffff"
                          style="width: 20px; height: 20px"
                        >
                        </lord-icon>
                        Lưu Kết Quả
                      </button>
                    </div>

                    <!-- Attempt Divider -->
                    <div v-if="index < lanThiForms.length - 1" class="attempt-divider">
                      <div class="divider-line"></div>
                      <div class="divider-icon">
                        <lord-icon
                          src="https://cdn.lordicon.com/whtfgdfm.json"
                          trigger="loop"
                          delay="2000"
                          colors="primary:#6366f1,secondary:#8b5cf6"
                          style="width: 32px; height: 32px"
                        >
                        </lord-icon>
                      </div>
                      <div class="divider-line"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="modal-footer">
                <button class="btn btn-secondary" @click="closeScoreModal">
                  <lord-icon
                    src="https://cdn.lordicon.com/nqtddedc.json"
                    trigger="hover"
                    colors="primary:#6366f1,secondary:#8b5cf6"
                    style="width: 18px; height: 18px"
                  >
                  </lord-icon>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </transition>
      </teleport>

      <!-- Confirm Dialog -->
      <ConfirmDialog
        ref="confirmDialog"
        :title="confirmConfig.title"
        :message="confirmConfig.message"
        :type="confirmConfig.type"
        :confirmText="confirmConfig.confirmText"
        :cancelText="confirmConfig.cancelText"
        @confirm="confirmConfig.onConfirm"
        @cancel="confirmConfig.onCancel"
      />
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import MainLayout from '@/components/layout/MainLayout.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useToastStore } from '@/stores/toastStore'
import { useLoadingStore } from '@/stores/loadingStore'

const toastStore = useToastStore()
const loadingStore = useLoadingStore()

const kyThiList = ref([])
const selectedKyThiId = ref('')
const hoSoList = ref([])
const searchQuery = ref('')
const showScoreModal = ref(false)
const selectedHoSo = ref(null)
const lanThiForms = ref([])

// Confirm dialog
const confirmDialog = ref(null)

const confirmConfig = ref({
  title: '',
  message: '',
  type: 'warning',
  confirmText: 'Đồng ý',
  cancelText: 'Hủy',
  onConfirm: () => {},
  onCancel: () => {},
})

// ================= COMPUTED =================

const filteredList = computed(() => {
  let list = [...hoSoList.value]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()

    list = list.filter((x) => x.hoTen.toLowerCase().includes(q) || x.cccd.toLowerCase().includes(q))
  }

  return list
})

// ================= METHODS =================

const loadKyThi = async () => {
  try {
    const res = await api.get('/api/KyThi')
    kyThiList.value = res.data
  } catch {
    toastStore.error('Không tải được kỳ thi')
  }
}

const loadKetQua = async () => {
  if (!selectedKyThiId.value) return

  loadingStore.show()

  try {
    const res = await api.get(`/api/KetQua/kythi/${selectedKyThiId.value}`)

    hoSoList.value = res.data
  } catch {
    toastStore.error('Không tải được kết quả')
  } finally {
    loadingStore.hide()
  }
}

const getLastResult = (hoSo) => {
  if (!hoSo.ketQuaThiList?.length) {
    return null
  }

  return hoSo.ketQuaThiList[hoSo.ketQuaThiList.length - 1].ketQuaTongHop
}

// ================= buildAttemptState =================

const buildAttemptState = (ketQua, editable = false) => {
  const chiTiet =
    ketQua.chiTiet?.map((ct) => ({
      chiTietID: ct.chiTietID,
      monThiID: ct.monThiID,
      tenMon: ct.tenMon,
      diem: ct.diem,
      diemDat: ct.diemDat,
      diemToiDa: ct.diemToiDa,
      ghiChu: ct.ghiChu || '',
      ketQua: ct.ketQua,
      saiCauLiet: ct.ghiChu?.includes('[SAI_CAU_LIET]') || false,
    })) || []

  return {
    ketQuaID: ketQua.ketQuaID,
    lanThi: ketQua.lanThi,
    editable,
    ghiChu: ketQua.ghiChu || '',
    chiTiet,

    get allPassed() {
      return this.chiTiet.every((x) => x.diem >= x.diemDat && !x.saiCauLiet)
    },

    get failedSubjects() {
      return this.chiTiet.filter((x) => x.diem < x.diemDat || x.saiCauLiet)
    },
  }
}

const openKetQuaModal = async (hoSo) => {
  selectedHoSo.value = hoSo
  showScoreModal.value = true
  lanThiForms.value = []

  // Có lịch sử thi
  if (hoSo.ketQuaThiList?.length) {
    hoSo.ketQuaThiList.forEach((kq, index) => {
      const editable = index === hoSo.ketQuaThiList.length - 1

      lanThiForms.value.push(buildAttemptState(kq, editable))
    })
  }
  // Chưa có
  else {
    await createFirstAttempt(hoSo.maHang)
  }
}

// ================= createFirstAttempt =================

const createFirstAttempt = async (maHang) => {
  const res = await api.get(`/api/KetQua/${maHang}/monthi`)

  lanThiForms.value.push({
    ketQuaID: null,
    lanThi: 1,
    editable: true,
    ghiChu: '',

    chiTiet: res.data.map((mt) => ({
      monThiID: mt.monThiid,
      tenMon: mt.tenMon,

      diem: 0,

      diemDat: mt.diemDat,
      diemToiDa: mt.diemToiDa,

      ketQua: 'Không đạt',

      ghiChu: '',
      saiCauLiet: false,
    })),

    get allPassed() {
      return this.chiTiet.every((x) => x.diem >= x.diemDat && !x.saiCauLiet)
    },

    get failedSubjects() {
      return this.chiTiet.filter((x) => x.diem < x.diemDat || x.saiCauLiet)
    },
  })
}

// ================= SAVE =================

const saveAttempt = async (attempt) => {
  loadingStore.show()

  try {
    // ================= BUILD PAYLOAD =================

    const payload = {
      chiTiet: attempt.chiTiet.map((ct) => ({
        chiTietID: ct.chiTietID || null,

        monThiID: ct.monThiID,

        diem: ct.diem,

        thoiGianBatDau: new Date().toISOString(),

        // GỬI KẾT QUẢ XUỐNG BACKEND
        ketQua: ct.diem >= ct.diemDat && !ct.saiCauLiet ? 'Đạt' : 'Không đạt',

        ghiChu: ct.saiCauLiet ? '[SAI_CAU_LIET]' : ct.ghiChu,
      })),

      ghiChu: attempt.ghiChu,
    }

    // ================= UPDATE =================

    if (attempt.ketQuaID) {
      const res = await api.put(`/api/KetQua/${attempt.ketQuaID}`, payload)

      // ================= SYNC LẠI DATA =================

      attempt.ketQuaID = res.data.ketQuaID

      attempt.chiTiet = res.data.chiTiet.map((ct) => ({
        chiTietID: ct.chiTietID,

        monThiID: ct.monThiID,

        tenMon: ct.tenMon,

        diem: ct.diem,

        diemDat: ct.diemDat,

        diemToiDa: ct.diemToiDa,

        ghiChu: ct.ghiChu || '',

        // RESTORE CHECKBOX
        saiCauLiet: ct.ghiChu?.includes('[SAI_CAU_LIET]') || false,
      }))

      toastStore.success('Cập nhật thành công')

      await loadKetQua()

      return res.data
    }

    // ================= CREATE =================

    const createPayload = {
      hoSoID: selectedHoSo.value.hoSoID,

      kyThiID: parseInt(selectedKyThiId.value),

      lanThi: attempt.lanThi,

      chiTiet: payload.chiTiet,

      ghiChu: payload.ghiChu,
    }

    const res = await api.post('/api/KetQua', createPayload)

    // ================= SYNC FULL OBJECT =================

    attempt.ketQuaID = res.data.ketQuaID

    attempt.chiTiet = res.data.chiTiet.map((ct) => ({
      chiTietID: ct.chiTietID,

      monThiID: ct.monThiID,

      tenMon: ct.tenMon,

      diem: ct.diem,

      diemDat: ct.diemDat,

      diemToiDa: ct.diemToiDa,

      ghiChu: ct.ghiChu || '',

      saiCauLiet: ct.ghiChu?.includes('[SAI_CAU_LIET]') || false,
    }))

    toastStore.success('Lưu kết quả thành công')

    await loadKetQua()

    return res.data
  } catch (err) {
    toastStore.error(err.response?.data?.message || 'Có lỗi xảy ra')

    throw err
  } finally {
    loadingStore.hide()
  }
}

// ================= CREATE NEXT ATTEMPT =================

const handleCreateNextAttempt = async (currentAttempt) => {
  const hasNonZeroScore = currentAttempt.chiTiet.some((mon) => mon.diem > 0)

  if (hasNonZeroScore) {
    confirmConfig.value = {
      title: 'Xác nhận điểm hiện tại',

      message: 'Bạn có chắc chắn muốn tạo lần thi tiếp theo với điểm hiện tại không?',

      type: 'warning',

      confirmText: 'Xác nhận',
      cancelText: 'Hủy',

      onConfirm: async () => {
        await createNextAttempt(currentAttempt)
      },

      onCancel: () => {},
    }
  } else {
    confirmConfig.value = {
      title: 'Điểm hiện tại là 0',

      message:
        'Tất cả điểm hiện tại đang là 0. Bạn có đồng ý tạo lần thi tiếp theo và lưu xuống hệ thống không?',

      type: 'danger',

      confirmText: 'Đồng ý',
      cancelText: 'Hủy',

      onConfirm: async () => {
        await createNextAttempt(currentAttempt)
      },

      onCancel: () => {},
    }
  }

  confirmDialog.value?.open()
}

const createNextAttempt = async (currentAttempt) => {
  try {
    // Lưu lần hiện tại trước
    await saveAttempt(currentAttempt)

    // Khóa lần cũ
    currentAttempt.editable = false

    const failed = currentAttempt.failedSubjects

    const nextAttempt = {
      ketQuaID: null,

      lanThi: currentAttempt.lanThi + 1,

      editable: true,
      ghiChu: '',

      chiTiet: failed.map((x) => ({
        monThiID: x.monThiID,
        tenMon: x.tenMon,

        diem: 0,

        diemDat: x.diemDat,
        diemToiDa: x.diemToiDa,

        ghiChu: '',
        saiCauLiet: false,
      })),

      get allPassed() {
        return this.chiTiet.every((x) => x.diem >= x.diemDat && !x.saiCauLiet)
      },

      get failedSubjects() {
        return this.chiTiet.filter((x) => x.diem < x.diemDat || x.saiCauLiet)
      },
    }

    // Auto lưu lần thi tiếp theo
    const savedAttempt = await saveAttempt(nextAttempt)

    // Thêm UI đã sync với backend
    lanThiForms.value.push(buildAttemptState(savedAttempt, true))
  } catch (err) {
    // Mở lại editable nếu lỗi
    currentAttempt.editable = true

    console.error(err)
  }
}

// ================= SCORE =================

const incrementScore = (mon, attempt) => {
  const maxScore = mon.saiCauLiet ? mon.diemToiDa - 1 : mon.diemToiDa
  if (!attempt.editable) return

  if (mon.diem < maxScore) {
    mon.diem++
  }
}

const decrementScore = (mon, attempt) => {
  if (!attempt.editable) return

  if (mon.diem > 0) {
    mon.diem--
  }
}

const updateResult = (mon, attempt) => {
  if (!attempt.editable) return

  const maxScore = mon.saiCauLiet ? mon.diemToiDa - 1 : mon.diemToiDa

  if (mon.diem > maxScore) {
    mon.diem = maxScore
  }

  if (mon.diem < 0) {
    mon.diem = 0
  }
}

const closeScoreModal = () => {
  showScoreModal.value = false
  selectedHoSo.value = null
  lanThiForms.value = []
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''

  return new Date(dateStr).toLocaleDateString('vi-VN')
}

const handleSaiCauLiet = (mon) => {
  if (mon.saiCauLiet) {
    if (mon.diem == mon.diemToiDa) {
      mon.diem = mon.diemToiDa - 1
    }
  }
}

onMounted(() => {
  loadKyThi()
})
</script>

<style scoped>
@import '@/assets/css/ketqua/ketqua.css';
</style>
