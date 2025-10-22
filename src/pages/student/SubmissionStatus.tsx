import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ExternalLink,
  Calendar,
  Building2
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { useAppSelector, useAppDispatch } from '../../store'
import { setSubmissions, updateFilters } from '../../store/slices/internshipSlice'
import { internshipsApi } from '../../api/internships'
import { format } from 'date-fns'

export const SubmissionStatus: React.FC = () => {
  const { user } = useAppSelector(state => state.auth)
  const { submissions, filters } = useAppSelector(state => state.internships)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSubmissions()
  }, [filters])

  const loadSubmissions = async () => {
    setLoading(true)
    try {
      const data = await internshipsApi.getSubmissions()
      // Filter to only show current user's submissions
  const userSubmissions = data.filter(s => s.studentId === user?.studentId)
      dispatch(setSubmissions(userSubmissions))
    } catch (error) {
      console.error('Error loading submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'under_review':
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "under_review":
        return <Badge className="bg-orange-500 text-white">Under Review</Badge>; // orange
      case "supervisor_verified":
        return <Badge variant="info">Supervisor Verified</Badge>;
      case "rejected":
        return <Badge variant="danger">Rejected</Badge>;
      case "department_approved":
        return (
          <Badge className="bg-purple-200 text-purple-900">
            Department Approved
          </Badge>
        ); // purple
      case "verified":
        return <Badge variant="success">Blockchain Verified</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Rejected' },
  ]

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-500">Submission Status</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Submission Status</h1>
        <p className="text-gray-600 mt-2">Track the verification progress of your internship submissions</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by company or position..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => dispatch(updateFilters({ search: e.target.value }))}
              />
            </div>
            
            <Select
              options={statusOptions}
              value={filters.status}
              onChange={(e) => dispatch(updateFilters({ status: e.target.value as any }))}
            />
            
            <Button variant="secondary" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Your Submissions</h2>
            <span className="text-sm text-gray-500">{submissions.length} total submissions</span>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
              <p className="text-gray-600 mb-4">You haven't submitted any internships yet</p>
              <Link to="/submit">
                <Button>Submit Your First Internship</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company & Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blockchain TX
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission, idx) => (
                    <tr key={submission._id || submission.id || idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {submission.companyName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {submission.position}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              <span>ID: {submission.studentId}</span><br/>
                              <span>Name: {submission.studentName}</span><br/>
                              <span>Email: {submission.studentEmail}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div>{format(new Date(submission.duration.startDate), 'MMM dd, yyyy')}</div>
                            <div className="text-gray-500">to {format(new Date(submission.duration.endDate), 'MMM dd, yyyy')}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              <span>Submitted: {submission.submittedAt ? format(new Date(submission.submittedAt), 'MMM dd, yyyy, HH:mm') : '-'}</span><br/>
                              <span>Created: {submission.createdAt ? format(new Date(submission.createdAt), 'MMM dd, yyyy, HH:mm') : '-'}</span><br/>
                              <span>Updated: {submission.updatedAt ? format(new Date(submission.updatedAt), 'MMM dd, yyyy, HH:mm') : '-'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(submission.status)}
                          <span className="ml-2">{getStatusBadge(submission.status)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(submission.submittedAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission.blockchainTxId ? (
                          <div className="flex items-center">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {submission.blockchainTxId.substring(0, 10)}...
                            </code>
                            <ExternalLink className="h-3 w-3 text-gray-400 ml-1" />
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/submissions/${submission._id}`}> 
                          <Button variant="ghost" size="sm" className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}