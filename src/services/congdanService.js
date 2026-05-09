import api from '@/services/api'

const congdanService = {
  async getAll() {
    const response = await api.get('/api/CongDan')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/api/CongDan/${id}`)
    return response.data
  },

  async create(formData) {
    const response = await api.post('/api/CongDan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async update(id, formData) {
    const response = await api.put(`/api/CongDan/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/api/CongDan/${id}`)
    return response.data
  },
}

export default congdanService
