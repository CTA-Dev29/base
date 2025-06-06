// utils/axiosInstance.js
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // Ganti sesuai backend kamu
})

// Tambahkan Authorization token secara otomatis
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Intercept response error
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token invalid / expired
      localStorage.removeItem('token')
      localStorage.removeItem('id')
      window.location.href = '/#/login'
    }
    return Promise.reject(error)
  }
)

export default instance
