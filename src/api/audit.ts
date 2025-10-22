import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface AuditLog {
  _id: string;
  date: string;
  user?: { name: string; email: string; role: string } | string;
  action: string;
  details?: string;
  status?: string;
}

export const auditApi = {
  getAuditLogs: async (): Promise<AuditLog[]> => {
    const res = await axios.get(`${API_BASE_URL}/department/audit`, { withCredentials: true });
    // Backend returns array of logs, each with user, action, etc.
    // Normalize date and user fields for frontend
    return (Array.isArray(res.data) ? res.data : []).map((log: any) => ({
      _id: log._id,
      date: log.createdAt || log.date || '',
      user: log.user || 'Unknown',
      action: log.action || log.event || '',
      details: log.details || log.message || '',
      status: log.status || 'info',
    }));
  },
};
