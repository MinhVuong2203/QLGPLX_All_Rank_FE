<template>
  <MainLayout>
    <div class="canbo-page">
      <div class="canbo-hero">
        <div>
          <div class="canbo-eyebrow">Phân quyền chức năng</div>
          <h1>Tick quyền cán bộ</h1>
          <p>Chọn những chức năng mà cán bộ được phép sử dụng trong hệ thống.</p>
        </div>

        <button class="canbo-btn canbo-btn-soft" @click="goBack">
          <i class="bi bi-arrow-left"></i>
          Quay lại
        </button>
      </div>

      <div v-if="canBo" class="canbo-permission-layout">
        <div class="canbo-profile-card">
          <div class="canbo-profile-avatar">
            <img v-if="canBo.anh3x4" :src="canBo.anh3x4" alt="Ảnh cán bộ" />
            <span v-else>
              {{ canBo.hoTen?.charAt(0)?.toUpperCase() || 'C' }}
            </span>
          </div>

          <h2>{{ canBo.hoTen }}</h2>
          <p>@{{ canBo.username }}</p>

          <div class="canbo-profile-info">
            <div>
              <span>Chức vụ</span>
              <strong>{{ canBo.tenChucVu || 'Chưa có' }}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{{ canBo.email }}</strong>
            </div>

            <div>
              <span>CCCD</span>
              <strong>{{ canBo.cccd }}</strong>
            </div>

            <div>
              <span>Trạng thái</span>
              <strong>{{ canBo.trangThai ? 'Hoạt động' : 'Đã khóa' }}</strong>
            </div>
          </div>
        </div>

        <div class="canbo-permission-card">
          <div class="canbo-card-header">
            <div>
              <h2>Danh sách quyền</h2>
              <p>Đã chọn {{ selected.length }}/{{ chucNangs.length }} chức năng</p>
            </div>

            <button class="canbo-btn canbo-btn-soft" @click="toggleAll">
              <i class="bi bi-check2-square"></i>
              {{ allChecked ? 'Bỏ chọn tất cả' : 'Chọn tất cả' }}
            </button>
          </div>

          <div class="canbo-permission-grid">
            <div
              v-for="item in chucNangs"
              :key="item.maChucNang"
              class="canbo-permission-item"
              :class="{ active: isSelected(item.maChucNang) }"
              @click="toggleOne(item.maChucNang)"
            >
              <div class="canbo-check">
                <i v-if="isSelected(item.maChucNang)" class="bi bi-check-lg"></i>
              </div>

              <div>
                <h3>{{ item.tenChucNang }}</h3>
                <p>{{ item.moTa }}</p>
              </div>
            </div>
          </div>

          <div class="canbo-form-actions">
            <button class="canbo-btn canbo-btn-soft" @click="goBack">Hủy</button>

            <button class="canbo-btn canbo-btn-primary" @click="savePermission">
              <i class="bi bi-shield-check"></i>
              Lưu phân quyền
            </button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
@import '@/assets/css/canbo/canbo.css';
</style>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import MainLayout from '@/components/layout/MainLayout.vue'
import canboService from '@/services/canboService'
import { useLoadingStore } from '@/stores/loadingStore'
import { useToastStore } from '@/stores/toastStore'

import '@/assets/css/canbo/canbo.css'

const route = useRoute()
const router = useRouter()
const loadingStore = useLoadingStore()
const toastStore = useToastStore()

const publicId = computed(() => route.params.publicId)

const canBo = ref(null)
const chucNangs = ref([])
const selected = ref([])

const FORBIDDEN_PERMISSION_CODE = 'QUAN_LY_CAN_BO'

const allChecked = computed(() => {
  return chucNangs.value.length > 0 && selected.value.length === chucNangs.value.length
})

const loadData = async () => {
  loadingStore.show()

  try {
    const [canBoRes, chucNangRes, quyenRes] = await Promise.all([
      canboService.getById(publicId.value),
      canboService.getChucNang(),
      canboService.getQuyen(publicId.value),
    ])

    canBo.value = canBoRes.data
    const allChucNangs = chucNangRes.data || []

    chucNangs.value = allChucNangs.filter(
      (item) => item.maChucNangCode !== FORBIDDEN_PERMISSION_CODE,
    )

    const allowedIds = chucNangs.value.map((item) => item.maChucNang)

    selected.value = (quyenRes.data || []).filter((id) => allowedIds.includes(id))
  } catch (error) {
    toastStore.show(
      error.response?.data?.message || 'Không thể tải dữ liệu phân quyền',
      'error',
      'Lỗi hệ thống',
    )
    router.push('/can-bo')
  } finally {
    loadingStore.hide()
  }
}

const toggleAll = () => {
  if (allChecked.value) {
    selected.value = []
  } else {
    selected.value = chucNangs.value.map((item) => item.maChucNang)
  }
}

const isSelected = (id) => {
  return selected.value.includes(id)
}

const toggleOne = (id) => {
  if (selected.value.includes(id)) {
    selected.value = selected.value.filter((x) => x !== id)
  } else {
    selected.value.push(id)
  }
}

const savePermission = async () => {
  loadingStore.show()

  try {
    const allowedIds = chucNangs.value.map((item) => item.maChucNang)

    const safeSelected = selected.value.filter((id) => allowedIds.includes(id))

    await canboService.updateQuyen(publicId.value, safeSelected)

    toastStore.show('Cập nhật quyền cán bộ thành công', 'success', 'Thành công')

    router.push('/can-bo')
  } catch (error) {
    toastStore.show(
      error.response?.data?.message || 'Không thể cập nhật quyền',
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
  await loadData()
})
</script>
