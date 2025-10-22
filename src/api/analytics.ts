import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface AnalyticsStats {
  total: number;
  approved: number;
  verified: number;
  rejected: number;
  pending: number;
}

export const analyticsApi = {
  getDepartmentAnalytics: async (params: { start?: string; end?: string } = {}): Promise<AnalyticsStats> => {
    let query = '';
    if (params.start || params.end) {
      const q = [];
      if (params.start) q.push(`start=${encodeURIComponent(params.start)}`);
      if (params.end) q.push(`end=${encodeURIComponent(params.end)}`);
      query = '?' + q.join('&');
    }
    const res = await axios.get(`${API_BASE_URL}/department/analytics${query}`, { withCredentials: true });
    return res.data;
  },
};
