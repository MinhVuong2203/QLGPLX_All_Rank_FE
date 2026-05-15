<script setup>
import { computed, onMounted, ref } from 'vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import api from '@/services/api'
import giayPhepService from '@/services/giayPhepService'
import { useToastStore } from '@/stores/toastStore'
import { useLoadingStore } from '@/stores/loadingStore'

const toastStore = useToastStore()
const loadingStore = useLoadingStore()

const hoSoList = ref([])
const congDanList = ref([])
const kyThiList = ref([])
const giayPhepStats = ref(null)
const loading = ref(false)

const safeData = (result, fallback = []) => {
  if (result.status !== 'fulfilled') return fallback
  return result.value?.data ?? result.value ?? fallback
}

const loadDashboard = async () => {
  try {
    loading.value = true
    loadingStore.show()

    const [hoSoRes, congDanRes, kyThiRes, giayPhepRes] = await Promise.allSettled([
      api.get('/api/Hoso'),
      api.get('/api/CongDan'),
      api.get('/api/KyThi'),
      giayPhepService.getStatistics(),
    ])

    hoSoList.value = safeData(hoSoRes)
    congDanList.value = safeData(congDanRes)
    kyThiList.value = safeData(kyThiRes)
    giayPhepStats.value = safeData(giayPhepRes, null)
  } catch (error) {
    console.error(error)
    toastStore.error('Không thể tải dữ liệu tổng quan')
  } finally {
    loading.value = false
    loadingStore.hide()
  }
}

onMounted(loadDashboard)

const countByStatus = (status) => hoSoList.value.filter((item) => item.trangThai === status).length

const approvedHoSo = computed(() => countByStatus('Đã duyệt'))
const pendingHoSo = computed(() => hoSoList.value.length - approvedHoSo.value - countByStatus('Từ chối'))
const rejectedHoSo = computed(() => countByStatus('Từ chối'))

const licenseStats = computed(() => ({
  total: giayPhepStats.value?.total ?? 0,
  conHieuLuc: giayPhepStats.value?.conHieuLuc ?? 0,
  hetHan: giayPhepStats.value?.hetHan ?? 0,
  biThuHoi: giayPhepStats.value?.biThuHoi ?? 0,
  sapHetHan: giayPhepStats.value?.sapHetHan ?? 0,
}))

const hoSoByHang = computed(() => {
  const groups = hoSoList.value.reduce((acc, item) => {
    const key = item.maHang || 'Khác'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const max = Math.max(...Object.values(groups), 1)

  return Object.entries(groups)
    .map(([label, value]) => ({
      label,
      value,
      percent: Math.round((value / max) * 100),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
})

const recentHoSo = computed(() =>
  [...hoSoList.value]
    .sort((a, b) => new Date(b.ngayNop) - new Date(a.ngayNop))
    .slice(0, 6),
)

const completionPercent = computed(() => {
  if (!hoSoList.value.length) return 0
  return Math.round((approvedHoSo.value / hoSoList.value.length) * 100)
})

const donutStyle = computed(() => ({
  background: `conic-gradient(#10b981 0 ${completionPercent.value}%, #e2e8f0 ${completionPercent.value}% 100%)`,
}))

const formatDate = (value) => {
  if (!value) return 'Chưa cập nhật'
  return new Date(value).toLocaleDateString('vi-VN')
}
</script>

<template>
  <MainLayout>
    <section class="overview-page">
      <div class="overview-hero">
        <div>
          <span class="overview-eyebrow">Bảng điều khiển</span>
          <h1>Tổng quan hệ thống GPLX</h1>
          <p>Theo dõi hồ sơ, kỳ thi, giấy phép và các chỉ số vận hành chính trong một màn hình.</p>
        </div>

        <div class="overview-health">
          <span>Tiến độ duyệt hồ sơ</span>
          <strong>{{ completionPercent }}%</strong>
        </div>
      </div>

      <div class="overview-stats">
        <article class="overview-stat is-blue">
          <i class="bi bi-folder2-open"></i>
          <div>
            <span>Tổng hồ sơ</span>
            <strong>{{ hoSoList.length }}</strong>
          </div>
        </article>

        <article class="overview-stat is-green">
          <i class="bi bi-people"></i>
          <div>
            <span>Công dân</span>
            <strong>{{ congDanList.length }}</strong>
          </div>
        </article>

        <article class="overview-stat is-amber">
          <i class="bi bi-calendar-event"></i>
          <div>
            <span>Kỳ thi</span>
            <strong>{{ kyThiList.length }}</strong>
          </div>
        </article>

        <article class="overview-stat is-red">
          <i class="bi bi-credit-card-2-front"></i>
          <div>
            <span>Giấy phép</span>
            <strong>{{ licenseStats.total }}</strong>
          </div>
        </article>
      </div>

      <div class="overview-grid">
        <section class="overview-panel overview-donut-panel">
          <div class="overview-panel-head">
            <div>
              <h2>Tình trạng hồ sơ</h2>
              <span>Phân bổ xử lý hiện tại</span>
            </div>
          </div>

          <div class="overview-donut-wrap">
            <div class="overview-donut" :style="donutStyle">
              <div>
                <strong>{{ completionPercent }}%</strong>
                <span>đã duyệt</span>
              </div>
            </div>

            <div class="overview-legend">
              <div><span class="dot green"></span>Đã duyệt <strong>{{ approvedHoSo }}</strong></div>
              <div><span class="dot amber"></span>Đang xử lý <strong>{{ pendingHoSo }}</strong></div>
              <div><span class="dot red"></span>Từ chối <strong>{{ rejectedHoSo }}</strong></div>
            </div>
          </div>
        </section>

        <section class="overview-panel">
          <div class="overview-panel-head">
            <div>
              <h2>Hồ sơ theo hạng GPLX</h2>
              <span>Top hạng có hồ sơ đăng ký nhiều nhất</span>
            </div>
          </div>

          <div class="overview-bars">
            <div v-for="item in hoSoByHang" :key="item.label" class="overview-bar-row">
              <div class="bar-label">
                <strong>{{ item.label }}</strong>
                <span>{{ item.value }} hồ sơ</span>
              </div>
              <div class="bar-track">
                <span :style="{ width: `${item.percent}%` }"></span>
              </div>
            </div>
          </div>
        </section>

        <section class="overview-panel">
          <div class="overview-panel-head">
            <div>
              <h2>Giấy phép</h2>
              <span>Chất lượng hiệu lực GPLX</span>
            </div>
          </div>

          <div class="license-chart">
            <div class="license-metric">
              <span>Còn hiệu lực</span>
              <strong>{{ licenseStats.conHieuLuc }}</strong>
            </div>
            <div class="license-metric">
              <span>Sắp hết hạn</span>
              <strong>{{ licenseStats.sapHetHan }}</strong>
            </div>
            <div class="license-metric">
              <span>Hết hạn</span>
              <strong>{{ licenseStats.hetHan }}</strong>
            </div>
            <div class="license-metric">
              <span>Bị thu hồi</span>
              <strong>{{ licenseStats.biThuHoi }}</strong>
            </div>
          </div>
        </section>

        <section class="overview-panel overview-recent">
          <div class="overview-panel-head">
            <div>
              <h2>Hồ sơ mới</h2>
              <span>Các hồ sơ vừa được tiếp nhận</span>
            </div>
          </div>

          <div v-if="loading" class="overview-empty">Đang tải dữ liệu...</div>
          <div v-else-if="recentHoSo.length === 0" class="overview-empty">Chưa có hồ sơ</div>

          <div v-else class="recent-list">
            <div v-for="hoso in recentHoSo" :key="hoso.hoSoId" class="recent-item">
              <div>
                <strong>{{ hoso.tenCongDan || 'Chưa có tên' }}</strong>
                <span>#{{ hoso.hoSoId }} · {{ hoso.maHang }} · {{ formatDate(hoso.ngayNop) }}</span>
              </div>
              <span class="recent-status">{{ hoso.trangThai || 'Chưa cập nhật' }}</span>
            </div>
          </div>
        </section>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.overview-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.overview-hero {
  min-height: 190px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 30px;
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(15, 118, 110, 0.92), rgba(37, 99, 235, 0.86)),
    url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80');
  background-size: cover;
  background-position: center;
  color: #fff;
  overflow: hidden;
}

.overview-eyebrow {
  display: inline-flex;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.78);
}

.overview-hero h1 {
  margin: 0;
  max-width: 760px;
  font-size: 34px;
  line-height: 1.15;
}

.overview-hero p {
  max-width: 650px;
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.86);
}

.overview-health {
  min-width: 170px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
}

.overview-health span,
.overview-health strong {
  display: block;
}

.overview-health span {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.78);
}

.overview-health strong {
  margin-top: 8px;
  font-size: 38px;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.overview-stat,
.overview-panel {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-surface);
  box-shadow: var(--shadow-sm);
}

.overview-stat {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
}

.overview-stat i {
  width: 46px;
  height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 22px;
}

.overview-stat span {
  display: block;
  color: var(--text-secondary);
  font-size: 13px;
}

.overview-stat strong {
  display: block;
  margin-top: 4px;
  font-size: 28px;
  color: var(--text-primary);
}

.is-blue i {
  color: #2563eb;
  background: rgba(37, 99, 235, 0.12);
}

.is-green i {
  color: #059669;
  background: rgba(5, 150, 105, 0.12);
}

.is-amber i {
  color: #d97706;
  background: rgba(217, 119, 6, 0.12);
}

.is-red i {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.12);
}

.overview-grid {
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  gap: 16px;
}

.overview-panel {
  padding: 20px;
}

.overview-panel-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.overview-panel h2 {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary);
}

.overview-panel-head span {
  display: block;
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 13px;
}

.overview-donut-wrap {
  display: flex;
  align-items: center;
  gap: 24px;
}

.overview-donut {
  width: 168px;
  height: 168px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}

.overview-donut > div {
  width: 108px;
  height: 108px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--bg-surface);
  text-align: center;
}

.overview-donut strong,
.overview-donut span {
  display: block;
}

.overview-donut strong {
  font-size: 28px;
}

.overview-donut span {
  font-size: 12px;
  color: var(--text-secondary);
}

.overview-legend {
  display: grid;
  gap: 12px;
  width: 100%;
}

.overview-legend div {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
}

.overview-legend strong {
  margin-left: auto;
  color: var(--text-primary);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.green {
  background: #10b981;
}

.dot.amber {
  background: #f59e0b;
}

.dot.red {
  background: #ef4444;
}

.overview-bars {
  display: grid;
  gap: 14px;
}

.overview-bar-row {
  display: grid;
  grid-template-columns: 130px 1fr;
  align-items: center;
  gap: 14px;
}

.bar-label strong,
.bar-label span {
  display: block;
}

.bar-label span {
  margin-top: 3px;
  font-size: 12px;
  color: var(--text-secondary);
}

.bar-track {
  height: 12px;
  border-radius: 99px;
  background: var(--bg-surface-2);
  overflow: hidden;
}

.bar-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #0f766e, #2563eb);
}

.license-chart {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.license-metric {
  padding: 16px;
  border-radius: 8px;
  background: var(--bg-surface-2);
}

.license-metric span,
.license-metric strong {
  display: block;
}

.license-metric span {
  color: var(--text-secondary);
  font-size: 13px;
}

.license-metric strong {
  margin-top: 8px;
  font-size: 26px;
}

.overview-recent {
  min-height: 310px;
}

.recent-list {
  display: grid;
  gap: 10px;
}

.recent-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: var(--bg-surface-2);
}

.recent-item strong,
.recent-item span {
  display: block;
}

.recent-item span {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 12px;
}

.recent-status {
  padding: 5px 10px;
  border-radius: 99px;
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb !important;
  white-space: nowrap;
}

.overview-empty {
  padding: 32px;
  text-align: center;
  color: var(--text-secondary);
}

@media (max-width: 1100px) {
  .overview-stats,
  .overview-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .overview-hero,
  .overview-donut-wrap,
  .recent-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .overview-stats,
  .overview-grid,
  .license-chart {
    grid-template-columns: 1fr;
  }
}
</style>
