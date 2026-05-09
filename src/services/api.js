import axios from 'axios'
const api = axios.create({
  baseURL: 'https://localhost:7033',
})

export default api
