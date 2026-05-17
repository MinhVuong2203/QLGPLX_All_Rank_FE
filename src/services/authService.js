import api from './api'

const authService = {
  login(data) {
    return api.post('/api/auth/login', data)
  },

  forgotPassword(data) {
    return api.post('/api/auth/forgot-password', data)
  },

  resetPassword(data) {
    return api.post('/api/auth/reset-password', data)
  },

  getMe() {
    return api.get('/api/auth/me')
  },

  logout() {
    return api.post('/api/auth/logout')
  },
}

export default authService
