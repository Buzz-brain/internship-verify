import { InternshipSubmission, InternshipStatus } from '../store/slices/internshipSlice'
import { User } from '../store/slices/authSlice'

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.student@university.edu',
    name: 'John Smith',
    role: 'student',
    studentId: 'CS2021001',
    department: 'Computer Science',
  },
  {
    id: '2',
    email: 'jane.supervisor@company.com',
    name: 'Jane Wilson',
    role: 'supervisor',
    supervisorId: 'SUP001',
  },
  {
    id: '3',
    email: 'admin@university.edu',
    name: 'Dr. Robert Johnson',
    role: 'department',
    department: 'Information Technology',
  },
]

export const mockSubmissions: InternshipSubmission[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'John Smith',
    studentEmail: 'john.student@university.edu',
    companyName: 'TechCorp Solutions',
    companyAddress: '123 Innovation Drive, Tech City, TC 12345',
    supervisorName: 'Jane Wilson',
    supervisorEmail: 'jane.supervisor@techcorp.com',
    position: 'Frontend Developer Intern',
    duration: {
      startDate: '2024-06-01',
      endDate: '2024-08-31',
    },
    description: 'Worked on developing React applications and implementing user interfaces for web platforms.',
    status: 'approved' as InternshipStatus,
    submittedAt: '2024-09-01T10:00:00Z',
    reviewedAt: '2024-09-05T14:30:00Z',
    approvedAt: '2024-09-10T09:15:00Z',
    reviewerComments: 'Excellent internship report with comprehensive details and evidence of learning outcomes.',
    documents: [
      {
        id: '1',
        name: 'internship-report.pdf',
        type: 'application/pdf',
        url: '/documents/internship-report-1.pdf',
      },
      {
        id: '2',
        name: 'company-certificate.pdf',
        type: 'application/pdf',
        url: '/documents/certificate-1.pdf',
      },
    ],
    blockchainTxId: '0x1234567890abcdef...',
    blockchainTimestamp: '2024-09-10T09:15:00Z',
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Emily Chen',
    studentEmail: 'emily.chen@university.edu',
    companyName: 'DataFlow Systems',
    companyAddress: '456 Analytics Blvd, Data City, DC 67890',
    supervisorName: 'Michael Rodriguez',
    supervisorEmail: 'michael.r@dataflow.com',
    position: 'Data Science Intern',
    duration: {
      startDate: '2024-05-15',
      endDate: '2024-08-15',
    },
    description: 'Focused on machine learning projects and data analysis using Python and various ML frameworks.',
    status: 'under_review' as InternshipStatus,
    submittedAt: '2024-08-20T15:30:00Z',
    documents: [
      {
        id: '3',
        name: 'internship-portfolio.pdf',
        type: 'application/pdf',
        url: '/documents/portfolio-2.pdf',
      },
    ],
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Alex Johnson',
    studentEmail: 'alex.johnson@university.edu',
    companyName: 'CloudTech Innovations',
    companyAddress: '789 Cloud Street, Sky City, SC 11111',
    supervisorName: 'Sarah Davis',
    supervisorEmail: 'sarah.davis@cloudtech.com',
    position: 'DevOps Engineer Intern',
    duration: {
      startDate: '2024-07-01',
      endDate: '2024-09-30',
    },
    description: 'Worked on CI/CD pipelines, cloud infrastructure deployment, and monitoring systems.',
    status: 'pending' as InternshipStatus,
    submittedAt: '2024-09-25T11:20:00Z',
    documents: [
      {
        id: '4',
        name: 'technical-report.pdf',
        type: 'application/pdf',
        url: '/documents/tech-report-3.pdf',
      },
      {
        id: '5',
        name: 'project-screenshots.zip',
        type: 'application/zip',
        url: '/documents/screenshots-3.zip',
      },
    ],
  },
]

export const mockApiResponse = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}