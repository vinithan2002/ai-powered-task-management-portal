import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/login', credentials)
      if (response.data.token) {
        return response.data
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      const msg = error.response?.data || error.message || 'Login failed'
      throw new Error(msg)
    }
  },

  async register(userData) {
    try {
      await api.post('/register', userData)
    } catch (error) {
      const msg = error.response?.data || error.message || 'Registration failed'
      throw new Error(msg)
    }
  },

  logout() {
    localStorage.removeItem('token')
  }
}