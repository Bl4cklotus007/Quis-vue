import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Enable sending cookies in cross-origin requests
})

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout')
}

// Materi API
export const materiAPI = {
  getAll: () => api.get('/materi'),
  getById: (id) => api.get(`/materi/${id}`),
  create: (materi) => api.post('/materi', materi),
  update: (id, materi) => api.put(`/materi/${id}`, materi),
  delete: (id) => api.delete(`/materi/${id}`),
  getBySubject: (subjectId) => api.get(`/materi/subject/${subjectId}`)
}

// Soal API
export const soalAPI = {
  getAll: () => api.get('/soal'),
  getById: (id) => api.get(`/soal/${id}`),
  create: (soal) => api.post('/soal', soal),
  update: (id, soal) => api.put(`/soal/${id}`, soal),
  delete: (id) => api.delete(`/soal/${id}`),
  getByMateri: (materiId) => api.get(`/soal/materi/${materiId}`)
}

// Skor API
export const skorAPI = {
  getAll: () => api.get('/skor'),
  getByUser: (userId) => api.get(`/skor/user/${userId}`),
  create: (skor) => api.post('/skor', skor),
  getStats: (userId) => api.get(`/skor/stats/${userId}`)
}

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (userData) => api.put('/user/profile', userData),
  changePassword: (passwordData) => api.put('/user/password', passwordData)
}

export default api 