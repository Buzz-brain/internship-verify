import axios from 'axios'
import { User } from '../store/slices/authSlice'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const authApi = {
  register: async (userData: {
    email: string
    password: string
    name: string
    role: string
    studentId?: string
    supervisorId?: string
  }): Promise<{ user: User }> => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/register`,
        userData,
        { withCredentials: true }
      )
      return res.data
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        throw new Error(err.response.data.error)
      }
      throw new Error('Registration failed')
    }
  },

  login: async (email: string, password: string): Promise<{ user: User }> => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      )
      return res.data
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        throw new Error(err.response.data.error)
      }
      throw new Error('Login failed')
    }
  },
  logout: async (): Promise<void> => {
    await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      { withCredentials: true }
    )
  },
  getProfile: async (): Promise<User> => {
    const res = await axios.get(
      `${API_BASE_URL}/auth/profile`,
      { withCredentials: true }
    )
    return res.data
  },
  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const res = await axios.put(
      `${API_BASE_URL}/auth/profile`,
      profileData,
      { withCredentials: true }
    )
    return res.data
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<string> => {
    const res = await axios.put(
      `${API_BASE_URL}/auth/change-password`,
      { oldPassword, newPassword },
      { withCredentials: true }
    )
    return res.data.message
  },
}