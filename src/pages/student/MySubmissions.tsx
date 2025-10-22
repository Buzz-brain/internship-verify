import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FileText, 
  Calendar, 
  Building2, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Eye
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { useAppSelector, useAppDispatch } from '../../store'
import { setSubmissions } from '../../store/slices/internshipSlice'
import { internshipsApi } from '../../api/internships'
import { format } from 'date-fns'

export const MySubmissions: React.FC = () => {
  const { user } = useAppSelector(state => state.auth)
  const { submissions } = useAppSelector(state => state.internships)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    setLoading(true)
    try {
      const data = await internshipsApi.getSubmissions()
      // Filter to only show current user's submissions
  const userSubmissions = data.filter(s => s.studentId === user?.studentId)
      // console.log('FILTERED USER SUBMISSIONS:', userSubmissions)
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
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'under_review':
        return <AlertCircle className="h-5 w-5 text-blue-600" />
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
      switch (status) {
        case 'pending':
          return <Badge variant="warning">Pending</Badge>;
        case 'under_review':
          return <Badge className="bg-orange-500 text-white">Under Review</Badge>; // orange
        case 'supervisor_verified':
          return <Badge variant="info">Supervisor Verified</Badge>;
        case 'rejected':
          return <Badge variant="danger">Rejected</Badge>;
        case 'department_approved':
          return (
            <Badge className="bg-purple-200 text-purple-900">
              Department Approved
            </Badge>
          ); // purple
        case 'verified':
          return <Badge variant="success">Blockchain Verified</Badge>;
        default:
          return <Badge>Unknown</Badge>;
      }
    }

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
              <span className="text-gray-500">My Submissions</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Submissions</h1>
          <p className="text-gray-600 mt-2">Complete history of your internship submissions</p>
        </div>
        <Link to="/submit">
          <Button className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            New Submission
          </Button>
        </Link>
      </div>

      {/* Submissions Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading your submissions...</p>
        </div>
      ) : submissions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
            <p className="text-gray-600 mb-6">Start by submitting your first internship for verification</p>
            <Link to="/submit">
              <Button>Submit Internship</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {submissions.map((submission) => (
            <Card key={submission._id || submission.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {submission.companyName}
                      </h3>
                      <p className="text-sm text-gray-600">{submission.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(submission.status)}
                    {getStatusBadge(submission.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Duration */}
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {format(new Date(submission.duration.startDate), 'MMM dd, yyyy')} - {' '}
                    {format(new Date(submission.duration.endDate), 'MMM dd, yyyy')}
                  </span>
                </div>

                {/* Supervisor */}
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <span>{submission.supervisorName}</span>
                </div>

                {/* Description Preview */}
                <p className="text-sm text-gray-700 line-clamp-2">
                  {submission.description}
                </p>

                {/* Documents */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>{submission.documents.length} document(s)</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Submitted {format(new Date(submission.submittedAt), 'MMM dd, yyyy')}
                  </div>
                </div>

                {/* Blockchain Info */}
                {submission.blockchainTxId && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">Blockchain TX:</span>
                      <code className="text-xs bg-white px-2 py-1 rounded border">
                        {submission.blockchainTxId.substring(0, 16)}...
                      </code>
                    </div>
                    {submission.blockchainTimestamp && (
                      <div className="text-xs text-gray-500 mt-1">
                        Verified: {format(new Date(submission.blockchainTimestamp), 'MMM dd, yyyy HH:mm')}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Link to={`/submissions/${submission._id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full flex items-center justify-center">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  {submission.documents.length > 0 && (
                    <Button variant="ghost" size="sm" className="flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>

                {/* Comments */}
                {submission.reviewerComments && (
                  <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm font-medium text-blue-900 mb-1">Reviewer Comments:</p>
                    <p className="text-sm text-blue-800">{submission.reviewerComments}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}