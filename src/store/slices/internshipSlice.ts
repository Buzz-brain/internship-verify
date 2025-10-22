import { createSlice, PayloadAction } from '@reduxjs/toolkit'


// Status roadmap (keep in sync with backend):
// Student: 'pending'
// Supervisor: 'under_review', 'supervisor_verified', 'rejected'
// Department: 'department_approved', 'rejected', 'verified' (blockchain)
export type InternshipStatus =
  | 'pending'                // student
  | 'under_review'           // supervisor
  | 'supervisor_verified'    // supervisor
  | 'rejected'               // supervisor/department
  | 'department_approved'    // department
  | 'verified'               // department (blockchain)
// Add more as backend evolves

export interface InternshipSubmission {
  id: string
  _id: string
  studentId?: string
  studentName?: string
  studentEmail?: string
  companyName: string
  companyAddress: string
  supervisorName: string
  supervisorEmail: string
  position: string
  duration: {
    startDate: string
    endDate: string
  }
  description: string
  status: InternshipStatus
  submittedAt: string
  reviewedAt?: string
  approvedAt?: string
  reviewerComments?: string
  departmentComments?: string
  documents: string[]
  blockchainTxId?: string
  blockchainTimestamp?: string
  createdAt: string
  updatedAt: string
}

interface InternshipState {
  submissions: InternshipSubmission[]
  currentSubmission: InternshipSubmission | null
  loading: boolean
  error: string | null
  filters: {
    status: InternshipStatus | 'all'
    search: string
    dateRange: {
      start: string | null
      end: string | null
    }
  }
}

const initialState: InternshipState = {
  submissions: [],
  currentSubmission: null,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    search: '',
    dateRange: {
      start: null,
      end: null,
    },
  },
}

const internshipSlice = createSlice({
  name: 'internships',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setSubmissions: (state, action: PayloadAction<InternshipSubmission[]>) => {
      state.submissions = action.payload
    },
    addSubmission: (state, action: PayloadAction<InternshipSubmission>) => {
      state.submissions.unshift(action.payload)
    },
    updateSubmission: (state, action: PayloadAction<InternshipSubmission>) => {
      const index = state.submissions.findIndex(s => s.id === action.payload.id)
      if (index !== -1) {
        state.submissions[index] = action.payload
      }
    },
    setCurrentSubmission: (state, action: PayloadAction<InternshipSubmission | null>) => {
      state.currentSubmission = action.payload
    },
    updateFilters: (state, action: PayloadAction<Partial<InternshipState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
  },
})

export const {
  setLoading,
  setError,
  setSubmissions,
  addSubmission,
  updateSubmission,
  setCurrentSubmission,
  updateFilters,
} = internshipSlice.actions

export default internshipSlice.reducer