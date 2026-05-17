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
          <img src="@/assets/image/logo.png" alt="Logo" class="login-logo-image" />
        </div>

        <h1>Ứng dụng Quản lý GPLX</h1>
        <p>Hệ thống quản lý giấy phép lái xe tất cả các hạng</p>

        <div class="login-feature-list">
          <div>
            <i class="bi bi-check-circle-fill"></i>
            Thủ tục hồ sơ đơn giản và nhanh chóng
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

      <form class="login-card" @submit.prevent="handleSubmit">
        <div class="login-card-header">
          <div class="login-card-icon">
            <lord-icon
              src="https://cdn.lordicon.com/bqlcwfjd.json"
              trigger="loop"
              colors="primary:#2660e5,secondary:#ee66aa"
              style="width:250px;height:250px">
            </lord-icon>
          </div>

          <h2>{{ cardTitle }}</h2>
          <p>{{ cardDescription }}</p>
        </div>

        <template v-if="mode === 'login'">
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

          <button type="button" class="login-text-action" @click="switchMode('forgot')">
            Quên mật khẩu?
          </button>

          <div class="login-note">Chỉ cán bộ được cấp tài khoản mới có thể thao tác</div>
        </template>

        <template v-else-if="mode === 'forgot'">
          <div class="login-field">
            <label>Email tài khoản</label>

            <div class="login-input">
              <i class="bi bi-envelope-fill"></i>
              <input
                v-model="forgotForm.email"
                type="email"
                placeholder="Nhập email cán bộ"
                autocomplete="email"
              />
            </div>

            <small v-if="errors.email">{{ errors.email }}</small>
          </div>

          <div class="login-field">
            <label>CCCD</label>

            <div class="login-input">
              <i class="bi bi-person-vcard-fill"></i>
              <input
                v-model="forgotForm.cccd"
                type="text"
                inputmode="numeric"
                maxlength="12"
                placeholder="Nhập CCCD cán bộ"
                autocomplete="off"
              />
            </div>

            <small v-if="errors.cccd">{{ errors.cccd }}</small>
          </div>

          <button type="submit" class="login-submit">
            <span>Gửi mã OTP</span>
            <i class="bi bi-send-fill"></i>
          </button>

          <button type="button" class="login-text-action" @click="switchMode('login')">
            Quay lại đăng nhập
          </button>
        </template>

        <template v-else>
          <div class="login-field">
            <label>Email tài khoản</label>

            <div class="login-input">
              <i class="bi bi-envelope-fill"></i>
              <input
                v-model="resetForm.email"
                type="email"
                placeholder="Nhập email đã nhận OTP"
                autocomplete="email"
              />
            </div>

            <small v-if="errors.email">{{ errors.email }}</small>
          </div>

          <div class="login-field">
            <label>Mã OTP</label>

            <div class="login-input">
              <i class="bi bi-key-fill"></i>
              <input
                v-model="resetForm.otpCode"
                type="text"
                inputmode="numeric"
                maxlength="6"
                placeholder="6 chữ số"
                autocomplete="one-time-code"
              />
            </div>

            <small v-if="errors.otpCode">{{ errors.otpCode }}</small>
          </div>

          <div class="login-field">
            <label>Mật khẩu mới</label>

            <div class="login-input">
              <i class="bi bi-lock-fill"></i>
              <input
                v-model="resetForm.newPassword"
                :type="showResetPassword ? 'text' : 'password'"
                placeholder="Nhập mật khẩu mới"
                autocomplete="new-password"
              />

              <button type="button" class="login-eye" @click="showResetPassword = !showResetPassword">
                <i :class="showResetPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
              </button>
            </div>

            <small v-if="errors.newPassword">{{ errors.newPassword }}</small>
          </div>

          <button type="submit" class="login-submit">
            <span>Đặt lại mật khẩu</span>
            <i class="bi bi-check-circle-fill"></i>
          </button>

          <button type="button" class="login-text-action" @click="switchMode('forgot')">
            Gửi lại OTP
          </button>
        </template>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/css/auth/login.css';
</style>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import authService from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { useLoadingStore } from '@/stores/loadingStore'
import { useToastStore } from '@/stores/toastStore'

const router = useRouter()
const authStore = useAuthStore()
const loadingStore = useLoadingStore()
const toastStore = useToastStore()

const showPassword = ref(false)
const showResetPassword = ref(false)
const mode = ref('login')

const form = reactive({
  usernameOrEmail: '',
  password: '',
})

const forgotForm = reactive({
  email: '',
  cccd: '',
})

const resetForm = reactive({
  email: '',
  otpCode: '',
  newPassword: '',
})

const errors = reactive({})

const cardTitle = computed(() => {
  if (mode.value === 'forgot') return 'Quên mật khẩu'
  if (mode.value === 'reset') return 'Nhập mã OTP'
  return 'Đăng nhập'
})

const cardDescription = computed(() => {
  if (mode.value === 'forgot') return 'Nhập email và CCCD của cán bộ để nhận mã OTP 6 chữ số, hiệu lực 10 phút.'
  if (mode.value === 'reset') return 'Nhập mã OTP trong email và mật khẩu mới để khôi phục truy cập.'
  return 'Nhập tài khoản được cấp để truy cập hệ thống.'
})

const resetErrors = () => {
  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })
}

const switchMode = (nextMode) => {
  resetErrors()
  mode.value = nextMode
}

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const validateLogin = () => {
  resetErrors()

  if (!form.usernameOrEmail.trim()) {
    errors.usernameOrEmail = 'Vui lòng nhập tài khoản hoặc email'
  }

  if (!form.password.trim()) {
    errors.password = 'Vui lòng nhập mật khẩu'
  }

  return Object.keys(errors).length === 0
}

const validateForgot = () => {
  resetErrors()

  if (!forgotForm.email.trim()) {
    errors.email = 'Vui lòng nhập email'
  } else if (!isValidEmail(forgotForm.email.trim())) {
    errors.email = 'Email không hợp lệ'
  }

  if (!/^\d{12}$/.test(forgotForm.cccd.trim())) {
    errors.cccd = 'CCCD phải gồm 12 chữ số'
  }

  return Object.keys(errors).length === 0
}

const validateReset = () => {
  resetErrors()

  if (!resetForm.email.trim()) {
    errors.email = 'Vui lòng nhập email'
  } else if (!isValidEmail(resetForm.email.trim())) {
    errors.email = 'Email không hợp lệ'
  }

  if (!/^\d{6}$/.test(resetForm.otpCode.trim())) {
    errors.otpCode = 'OTP phải gồm 6 chữ số'
  }

  if (resetForm.newPassword.length < 6) {
    errors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự'
  }

  return Object.keys(errors).length === 0
}

const handleSubmit = () => {
  if (mode.value === 'forgot') return handleForgotPassword()
  if (mode.value === 'reset') return handleResetPassword()
  return handleLogin()
}

const handleLogin = async () => {
  if (!validateLogin()) return

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

const handleForgotPassword = async () => {
  if (!validateForgot()) return

  loadingStore.show()

  try {
    await authService.forgotPassword({
      email: forgotForm.email.trim(),
      cccd: forgotForm.cccd.trim(),
    })

    resetForm.email = forgotForm.email.trim()
    mode.value = 'reset'
    toastStore.show('Mã OTP đã được gửi và có hiệu lực 10 phút', 'success', 'Đã gửi OTP')
  } catch (error) {
    toastStore.show(error.response?.data?.message || 'Không gửi được OTP', 'error', 'Lỗi')
  } finally {
    loadingStore.hide()
  }
}

const handleResetPassword = async () => {
  if (!validateReset()) return

  loadingStore.show()

  try {
    await authService.resetPassword({
      email: resetForm.email.trim(),
      otpCode: resetForm.otpCode.trim(),
      newPassword: resetForm.newPassword,
    })

    form.usernameOrEmail = resetForm.email.trim()
    form.password = ''
    resetForm.otpCode = ''
    resetForm.newPassword = ''
    mode.value = 'login'
    toastStore.show('Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại', 'success', 'Thành công')
  } catch (error) {
    toastStore.show(error.response?.data?.message || 'Đặt lại mật khẩu thất bại', 'error', 'Lỗi')
  } finally {
    loadingStore.hide()
  }
}
</script>
