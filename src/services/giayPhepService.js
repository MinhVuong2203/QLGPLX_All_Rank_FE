import api from './api'

const giayPhepService = {
  // Lấy danh sách giấy phép với phân trang
  async getAll(params = {}) {
    try {
      const response = await api.get('/api/GiayPhep', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching giay phep:', error)
      throw error
    }
  },

  // Lấy chi tiết giấy phép
  async getById(id) {
    try {
      const response = await api.get(`/api/GiayPhep/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching giay phep detail:', error)
      throw error
    }
  },

  // Tạo giấy phép mới
  async create(data) {
    try {
      const response = await api.post('/api/GiayPhep', data)
      return response.data
    } catch (error) {
      console.error('Error creating giay phep:', error)
      throw error
    }
  },

  // Cập nhật giấy phép
  async update(id, data) {
    try {
      const response = await api.put(`/api/GiayPhep/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating giay phep:', error)
      throw error
    }
  },

  // Lấy thống kê
  async getStatistics() {
    try {
      const response = await api.get('/api/GiayPhep/statistics')
      return response.data
    } catch (error) {
      console.error('Error fetching statistics:', error)
      throw error
    }
  }
}

export default giayPhepService