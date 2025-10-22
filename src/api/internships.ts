

  import { InternshipSubmission } from '../store/slices/internshipSlice'
  import axios from 'axios'


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const internshipsApi = {

  // Department: Get submissions (with optional status filter)
  getDepartmentSubmissions: async (params: string = ''): Promise<InternshipSubmission[]> => {
    const res = await axios.get(`${API_BASE_URL}/department/submissions${params}`, { withCredentials: true });
    return res.data.submissions;
  },

  // Department: Update submission status (approve, verify, reject)
  updateDepartmentSubmissionStatus: async (
    id: string,
    status: 'department_approved' | 'verified' | 'rejected',
    departmentComments?: string
  ): Promise<InternshipSubmission> => {
    const res = await axios.put(
      `${API_BASE_URL}/department/submissions/${id}/approve`,
      { status, departmentComments },
      { withCredentials: true }
    );
    return res.data.submission;
  },
  getSubmissions: async (): Promise<InternshipSubmission[]> => {
    const res = await axios.get(`${API_BASE_URL}/student/submissions`, { withCredentials: true })
    // Backend returns { submissions: [...] }
    // console.log('GET SUBMISSIONS RESPONSE:', res.data);
    return res.data.submissions
  },

  getSubmissionById: async (id: string): Promise<InternshipSubmission | null> => {
    const res = await axios.get(`${API_BASE_URL}/student/submissions/${id}`, { withCredentials: true })
    // Backend returns { submission }
    // console.log('GET SUBMISSION BY ID RESPONSE:', res.data);
    return res.data.submission || null
  },

  createSubmission: async (data: {
    companyName: string;
    companyAddress: string;
    supervisorName: string;
    supervisorEmail: string;
    position: string;
    duration: { startDate: string; endDate: string };
    description: string;
    documents: string[];
  }): Promise<InternshipSubmission> => {
    // Ensure documents is string[]
    const payload = { ...data, documents: data.documents as string[] };
    // console.log(payload)
    const res = await axios.post(`${API_BASE_URL}/student/submissions`, payload, { withCredentials: true })
    // Backend returns { submission }
    return res.data.submission
  },

  updateSubmission: async (id: string, data: Partial<InternshipSubmission>): Promise<InternshipSubmission> => {
    const res = await axios.put(`${API_BASE_URL}/student/submissions/${id}`, data, { withCredentials: true })
    // Backend returns { submission }
    return res.data.submission
  },

  // Placeholder for document upload (to be implemented with real backend/cloud storage)
  uploadDocument: async (file: File): Promise<{ id: string; name: string; type: string; url: string }> => {
    // TODO: Implement real file upload
    return {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      url: `/documents/${file.name}`,
    }
  },

  getSupervisorSubmissions: async (): Promise<InternshipSubmission[]> => {
    const res = await axios.get(`${API_BASE_URL}/supervisor/submissions`, { withCredentials: true })
    // Backend returns { submissions: [...] }
    return res.data.submissions
  },
  getSupervisorSubmissionById: async (id: string): Promise<InternshipSubmission | null> => {
    const res = await axios.get(`${API_BASE_URL}/supervisor/submissions/${id}`, { withCredentials: true })
    // Backend returns { submission }
    return res.data.submission || null
  },
  updateSubmissionStatus: async (id: string, status: string, reviewerComments?: string): Promise<InternshipSubmission> => {
    const res = await axios.put(`${API_BASE_URL}/supervisor/submissions/${id}/verify`, {
      status,
      reviewerComments,
    }, { withCredentials: true })
    // Backend returns { submission }
    return res.data.submission
  },
}