import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface SupervisorDirectoryEntry {
  email: string;
  name: string;
}

export const supervisorDirectoryApi = {
  // Fetch all supervisor emails and names
  getSupervisors: async (): Promise<SupervisorDirectoryEntry[]> => {
    const res = await axios.get(`${API_BASE_URL}/directory/supervisors`, { withCredentials: true });
    return res.data.supervisors;
  },

  // Fetch supervisor name by email
  getSupervisorNameByEmail: async (email: string): Promise<string> => {
    const res = await axios.get(`${API_BASE_URL}/directory/supervisor-name`, {
      params: { email },
      withCredentials: true,
    });
    return res.data.name;
  },
};
