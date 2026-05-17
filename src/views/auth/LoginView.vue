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

        <h1>Ung dung Quan ly GPLX</h1>
        <p>He thong quan ly giay phep lai xe tat ca cac hang</p>

        <div class="login-feature-list">
          <div>
            <i class="bi bi-check-circle-fill"></i>
            Thu tuc ho so don gian va nhanh chong
          </div>

          <div>
            <i class="bi bi-check-circle-fill"></i>
            Ky thi sat hach linh hoat, da dang
          </div>

          <div>
            <i class="bi bi-check-circle-fill"></i>
            Cap giay phep lai xe dien tu tien loi
          </div>

          <div>
            <i class="bi bi-check-circle-fill"></i>
            Ho tro tra cuu thong tin nhanh chong
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
            <label>Tai khoan hoac email</label>

            <div class="login-input">
              <i class="bi bi-person-fill"></i>
              <input
                v-model="form.usernameOrEmail"
                type="text"
                placeholder="Username hoac email"
                autocomplete="username"
              />
            </div>

            <small v-if="errors.usernameOrEmail">{{ errors.usernameOrEmail }}</small>
          </div>

          <div class="login-field">
            <label>Mat khau</label>

            <div class="login-input">
              <i class="bi bi-lock-fill"></i>

              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Nhap mat khau"
                autocomplete="current-password"
              />

              <button type="button" class="login-eye" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
              </button>
            </div>

            <small v-if="errors.password">{{ errors.password }}</small>
          </div>

          <button type="submit" class="login-submit">
            <span>Dang nhap</span>
            <lord-icon
              src="https://cdn.lordicon.com/usydzudq.json"
              trigger="loop"
              colors="primary:#d4d1fa,secondary:#fad1e6"
              style="width:26px;height:26px">
            </lord-icon>
          </button>

          <button type="button" class="login-text-action" @click="switchMode('forgot')">
            Quen mat khau?
          </button>

          <div class="login-note">Chi can bo duoc cap tai khoan moi co the thao tac</div>
        </template>

        <template v-else-if="mode === 'forgot'">
          <div class="login-field">
            <label>Email tai khoan</label>

            <div class="login-input">
              <i class="bi bi-envelope-fill"></i>
              <input
                v-model="forgotForm.email"
                type="email"
                placeholder="Nhap email can bo"
                autocomplete="email"
              />
            </div>

            <small v-if="errors.email">{{ errors.email }}</small>
          </div>

          <button type="submit" class="login-submit">
            <span>Gui ma OTP</span>
            <i class="bi bi-send-fill"></i>
          </button>

          <button type="button" class="login-text-action" @click="switchMode('login')">
            Quay lai dang nhap
          </button>
        </template>

        <template v-else>
          <div class="login-field">
            <label>Email tai khoan</label>

            <div class="login-input">
              <i class="bi bi-envelope-fill"></i>
              <input
                v-model="resetForm.email"
                type="email"
                placeholder="Nhap email da nhan OTP"
                autocomplete="email"
              />
            </div>

            <small v-if="errors.email">{{ errors.email }}</small>
          </div>

          <div class="login-field">
            <label>Ma OTP</label>

            <div class="login-input">
              <i class="bi bi-key-fill"></i>
              <input
                v-model="resetForm.otpCode"
                type="text"
                inputmode="numeric"
                maxlength="6"
                placeholder="6 chu so"
                autocomplete="one-time-code"
              />
            </div>

            <small v-if="errors.otpCode">{{ errors.otpCode }}</small>
          </div>

          <div class="login-field">
            <label>Mat khau moi</label>

            <div class="login-input">
              <i class="bi bi-lock-fill"></i>
              <input
                v-model="resetForm.newPassword"
                :type="showResetPassword ? 'text' : 'password'"
                placeholder="Nhap mat khau moi"
                autocomplete="new-password"
              />

              <button type="button" class="login-eye" @click="showResetPassword = !showResetPassword">
                <i :class="showResetPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
              </button>
            </div>

            <small v-if="errors.newPassword">{{ errors.newPassword }}</small>
          </div>

          <button type="submit" class="login-submit">
            <span>Dat lai mat khau</span>
            <i class="bi bi-check-circle-fill"></i>
          </button>

          <button type="button" class="login-text-action" @click="switchMode('forgot')">
            Gui lai OTP
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
})

const resetForm = reactive({
  email: '',
  otpCode: '',
  newPassword: '',
})

const errors = reactive({})

const cardTitle = computed(() => {
  if (mode.value === 'forgot') return 'Quen mat khau'
  if (mode.value === 'reset') return 'Nhap ma OTP'
  return 'Dang nhap'
})

const cardDescription = computed(() => {
  if (mode.value === 'forgot') return 'Nhap email tai khoan de nhan ma OTP 6 chu so, hieu luc 10 phut.'
  if (mode.value === 'reset') return 'Nhap ma OTP trong email va mat khau moi de khoi phuc truy cap.'
  return 'Nhap tai khoan duoc cap de truy cap he thong.'
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
    errors.usernameOrEmail = 'Vui long nhap tai khoan hoac email'
  }

  if (!form.password.trim()) {
    errors.password = 'Vui long nhap mat khau'
  }

  return Object.keys(errors).length === 0
}

const validateForgot = () => {
  resetErrors()

  if (!forgotForm.email.trim()) {
    errors.email = 'Vui long nhap email'
  } else if (!isValidEmail(forgotForm.email.trim())) {
    errors.email = 'Email khong hop le'
  }

  return Object.keys(errors).length === 0
}

const validateReset = () => {
  resetErrors()

  if (!resetForm.email.trim()) {
    errors.email = 'Vui long nhap email'
  } else if (!isValidEmail(resetForm.email.trim())) {
    errors.email = 'Email khong hop le'
  }

  if (!/^\d{6}$/.test(resetForm.otpCode.trim())) {
    errors.otpCode = 'OTP phai gom 6 chu so'
  }

  if (resetForm.newPassword.length < 6) {
    errors.newPassword = 'Mat khau moi phai co it nhat 6 ky tu'
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

    toastStore.show('Dang nhap thanh cong', 'success', 'Thanh cong')

    router.push('/')
  } catch (error) {
    toastStore.show(error.response?.data?.message || 'Dang nhap that bai', 'error', 'Loi dang nhap')
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
    })

    resetForm.email = forgotForm.email.trim()
    mode.value = 'reset'
    toastStore.show('Neu email ton tai, ma OTP da duoc gui va co hieu luc 10 phut', 'success', 'Da gui OTP')
  } catch (error) {
    toastStore.show(error.response?.data?.message || 'Khong gui duoc OTP', 'error', 'Loi')
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
    toastStore.show('Dat lai mat khau thanh cong. Vui long dang nhap lai', 'success', 'Thanh cong')
  } catch (error) {
    toastStore.show(error.response?.data?.message || 'Dat lai mat khau that bai', 'error', 'Loi')
  } finally {
    loadingStore.hide()
  }
}
</script>
