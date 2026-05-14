import { defineStore } from 'pinia'

import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('accessToken') || '',
    canBo: JSON.parse(localStorage.getItem('canBoLogin') || 'null'),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    permissions: (state) => state.canBo?.quyen || [],
    hoTen: (state) => state.canBo?.hoTen || '',
    username: (state) => state.canBo?.username || '',
    avatar: (state) => state.canBo?.anh3x4 || '',
  },

  actions: {
    async login(payload) {
      const res = await authService.login(payload)

      const data = res.data?.data

      this.token = data.token
      this.canBo = data.canBo

      localStorage.setItem('accessToken', data.token)
      localStorage.setItem('canBoLogin', JSON.stringify(data.canBo))

      return data
    },

    async fetchMe() {
      const res = await authService.getMe()

      this.canBo = res.data
      localStorage.setItem('canBoLogin', JSON.stringify(res.data))

      return res.data
    },

    async logout() {
      try {
        if (this.token) {
          await authService.logout()
        }
      } catch {
        // Token có thể hết hạn, vẫn cho logout phía client
      } finally {
        this.token = ''
        this.canBo = null

        localStorage.removeItem('accessToken')
        localStorage.removeItem('canBoLogin')
      }
    },

    hasPermission(permissionCode) {
      return this.permissions.includes(permissionCode)
    },
  },
})