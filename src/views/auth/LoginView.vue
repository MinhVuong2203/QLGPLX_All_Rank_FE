<template>
  <div class="login-page">
    <div class="login-background">
      <div class="login-orb login-orb-1"></div>
      <div class="login-orb login-orb-2"></div>
      <div class="login-orb login-orb-3"></div>
    </div>

    <div class="login-shell">
      <div class="login-brand-panel">
        <div class="login-logo">
          <!-- <i class="bi bi-shield-lock-fill"></i> -->
          <img src="@/assets/image/logo.png" alt="Logo" class="login-logo-image" />
        </div>

        <h1>Ứng dụng Quản lý GPLX</h1>
        <p>Hệ thống quản lý giấy phép lái xe tất cả các hạng</p>

        <div class="login-feature-list">
          <div>
            <i class="bi bi-check-circle-fill"></i>
            Thủ tục hồ sơ đơn giản & nhanh chóng
          </div>

          <div>
            <i class="bi bi-check-circle-fill"></i>
            Kỳ thi sát hạch linh hoạt, đa dạng
          </div>

          <div>
            <i class="bi bi-check-circle-fill"></i>
            Cấp giấy phép lái xe điện tử tiện lợi
          </div>

          <div>
            <i class="bi bi-check-circle-fill"></i>
            Hỗ trợ tra cứu thông tin nhanh chóng
          </div>
        </div>
      </div>

      <form class="login-card" @submit.prevent="handleLogin">
        <div class="login-card-header">
          <div class="login-card-icon">
            <lord-icon
              src="https://cdn.lordicon.com/bqlcwfjd.json"
              trigger="loop"
              colors="primary:#2660e5,secondary:#ee66aa"
              style="width:250px;height:250px">
          </lord-icon>
          </div>
          
          <h2>Đăng nhập</h2>
          <p>Nhập tài khoản được cấp để truy cập hệ thống.</p>
        </div>

        <div class="login-field">
          <label>Tài khoản hoặc email</label>

          <div class="login-input">
            <i class="bi bi-person-fill"></i>
            <input
              v-model="form.usernameOrEmail"
              type="text"
              placeholder="Username hoặc email"
              autocomplete="username"
            />
          </div>

          <small v-if="errors.usernameOrEmail">{{ errors.usernameOrEmail }}</small>
        </div>

        <div class="login-field">
          <label>Mật khẩu</label>

          <div class="login-input">
            <i class="bi bi-lock-fill"></i>

            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Nhập mật khẩu"
              autocomplete="current-password"
            />

            <button type="button" class="login-eye" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
            </button>
          </div>

          <small v-if="errors.password">{{ errors.password }}</small>
        </div>

        <button type="submit" class="login-submit">
          <span>Đăng nhập</span>
          <lord-icon
            src="https://cdn.lordicon.com/usydzudq.json"
            trigger="loop"
            colors="primary:#d4d1fa,secondary:#fad1e6"
            style="width:26px;height:26px">
          </lord-icon>
        </button>

        <div class="login-note">Chỉ cán bộ được cấp tài khoản mới có thể thao tác</div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/css/auth/login.css';
</style>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/authStore'
import { useLoadingStore } from '@/stores/loadingStore'
import { useToastStore } from '@/stores/toastStore'

const router = useRouter()
const authStore = useAuthStore()
const loadingStore = useLoadingStore()
const toastStore = useToastStore()

const showPassword = ref(false)

const form = reactive({
  usernameOrEmail: '',
  password: '',
})

const errors = reactive({})

const resetErrors = () => {
  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })
}

const validate = () => {
  resetErrors()

  if (!form.usernameOrEmail.trim()) {
    errors.usernameOrEmail = 'Vui lòng nhập tài khoản hoặc email'
  }

  if (!form.password.trim()) {
    errors.password = 'Vui lòng nhập mật khẩu'
  }

  return Object.keys(errors).length === 0
}

const handleLogin = async () => {
  if (!validate()) return

  loadingStore.show()

  try {
    await authStore.login({
      usernameOrEmail: form.usernameOrEmail.trim(),
      password: form.password,
    })

    toastStore.show('Đăng nhập thành công', 'success', 'Thành công')

    router.push('/')
  } catch (error) {
    toastStore.show(error.response?.data?.message || 'Đăng nhập thất bại', 'error', 'Lỗi đăng nhập')
  } finally {
    loadingStore.hide()
  }
}
</script>
