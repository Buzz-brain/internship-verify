import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'supervisor' | 'department';
  status?: 'active' | 'inactive';
  department?: string;
  studentId?: string;
  phone?: string;
  address?: string;
  bio?: string;
  yearOfStudy?: string;
  profilePicture?: string;
}

export const usersApi = {
  // List all users
  getUsers: async (): Promise<User[]> => {
    const res = await axios.get(`${API_BASE_URL}/department/users`, { withCredentials: true });
    return res.data.users;
  },

  // Add a new user
  addUser: async (data: Partial<User> & { password: string }): Promise<User> => {
    const res = await axios.post(`${API_BASE_URL}/department/users`, data, { withCredentials: true });
    return res.data;
  },

  // Update a user
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const res = await axios.put(`${API_BASE_URL}/department/users/${id}`, data, { withCredentials: true });
    return res.data.user;
  },

  // Delete a user
  deleteUser: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/department/users/${id}`, { withCredentials: true });
  },
};
