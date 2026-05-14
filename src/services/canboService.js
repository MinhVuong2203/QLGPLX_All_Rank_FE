import api from './api'

const canboService = {
  getAll(params = {}) {
    return api.get('/api/canbo', { params })
  },

  getById(publicId) {
    return api.get(`/api/canbo/${publicId}`)
  },

  create(data) {
    return api.post('/api/canbo', data)
  },

  update(publicId, data) {
    return api.put(`/api/canbo/${publicId}`, data)
  },

  delete(publicId) {
    return api.delete(`/api/canbo/${publicId}`)
  },

  changeStatus(publicId, trangThai) {
    return api.patch(`/api/canbo/${publicId}/trang-thai`, {
      trangThai,
    })
  },

  getChucVu() {
    return api.get('/api/canbo/chuc-vu')
  },

  getChucNang() {
    return api.get('/api/chucnang')
  },

  getQuyen(publicId) {
    return api.get(`/api/canbo/${publicId}/quyen`)
  },

  updateQuyen(publicId, maChucNangs) {
    return api.put(`/api/canbo/${publicId}/quyen`, {
      maChucNangs,
    })
  },
}

export default canboService
