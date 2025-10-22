import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const notificationApi = {
  async getNotifications(): Promise<Notification[]> {
    const res = await axios.get(`${API_BASE_URL}/notifications`, { withCredentials: true });
    return res.data;
  },
  async markAsRead(id: string): Promise<void> {
    await axios.put(`${API_BASE_URL}/notifications/${id}/read`, {}, { withCredentials: true });
  },
  // No deleteNotification endpoint in backend
};
