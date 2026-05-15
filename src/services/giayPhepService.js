import api from './api'

const giayPhepService = {
  async getAll(params = {}) {
    try {
      const response = await api.get('/api/GiayPhep', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching giay phep:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/api/GiayPhep/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching giay phep detail:', error)
      throw error
    }
  },

  async create(data) {
    try {
      const response = await api.post('/api/GiayPhep', data)
      return response.data
    } catch (error) {
      console.error('Error creating giay phep:', error)
      throw error
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/api/GiayPhep/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating giay phep:', error)
      throw error
    }
  },

  async getLichSu(id) {
    try {
      const response = await api.get(`/api/GiayPhep/${id}/lich-su`)
      return response.data
    } catch (error) {
      console.error('Error fetching license history:', error)
      throw error
    }
  },

  async duyet(id, data) {
    try {
      const response = await api.post(`/api/GiayPhep/${id}/duyet`, data)
      return response.data
    } catch (error) {
      console.error('Error approving giay phep:', error)
      throw error
    }
  },

  async capLai(id, data) {
    try {
      const response = await api.post(`/api/GiayPhep/${id}/cap-lai`, data)
      return response.data
    } catch (error) {
      console.error('Error reissuing giay phep:', error)
      throw error
    }
  },

  async getStatistics() {
    try {
      const response = await api.get('/api/GiayPhep/statistics')
      return response.data
    } catch (error) {
      console.error('Error fetching statistics:', error)
      throw error
    }
  },
}

export default giayPhepService
