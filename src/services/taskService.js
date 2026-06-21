import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const taskService = {
  async getAllTasks(page = 0, size = 10, sort = 'id,asc') {
    const response = await api.get(`/api/tasks?page=${page}&size=${size}&sort=${sort}`)
    return response.data   // Page object: { content, totalPages, totalElements, ... }
  },

  async getTaskById(id) {
    const response = await api.get(`/api/tasks/${id}`)
    return response.data
  },

  async createTask(taskData) {
    const response = await api.post('/api/tasks', taskData)
    return response.data
  },

  async updateTask(id, taskData) {
    const response = await api.put(`/api/tasks/${id}`, taskData)
    return response.data
  },

  async deleteTask(id) {
    await api.delete(`/api/tasks/${id}`)
  },

  async updateStatus(id, status) {
    const response = await api.patch(`/api/tasks/${id}/status`, { status })
    return response.data
  },

  async getTasksByStatus(status, page = 0, size = 10) {
    const response = await api.get(`/api/tasks/status/${status}?page=${page}&size=${size}`)
    return response.data
  },

  async searchTasks(title, page = 0, size = 10) {
    const response = await api.get(`/api/tasks/search?title=${encodeURIComponent(title)}&page=${page}&size=${size}`)
    return response.data
  },

  async suggestTask(title) {
    const response = await api.post(`/api/tasks/suggest?title=${encodeURIComponent(title)}`)
    return response.data
  },

  async generateTask(title, userId) {
    let url = `/api/tasks/generate?title=${encodeURIComponent(title)}`
    if (userId) url += `&userId=${userId}`
    const response = await api.post(url)
    return response.data
  }
}