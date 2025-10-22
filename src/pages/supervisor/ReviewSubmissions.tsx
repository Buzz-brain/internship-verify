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
  Calendar,
  Building2,
  User,
  FileText
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Textarea } from '../../components/ui/Input'
import { useAppSelector, useAppDispatch } from '../../store'
import { setSubmissions, updateFilters } from '../../store/slices/internshipSlice'
import { addNotification } from '../../store/slices/notificationSlice'
import { internshipsApi } from '../../api/internships'
import { format } from 'date-fns'

export const ReviewSubmissions: React.FC = () => {
  // const { user } = useAppSelector(state => state.auth)
  const { submissions, filters } = useAppSelector(state => state.internships)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [reviewModal, setReviewModal] = useState(false)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve')
  const [reviewComments, setReviewComments] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadSubmissions()
  }, [filters])

  const loadSubmissions = async () => {
    setLoading(true)
    try {
      const data = await internshipsApi.getSupervisorSubmissions()
      dispatch(setSubmissions(data))
    } catch (error) {
      console.error('Error loading submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = (submission: any, action: 'approve' | 'reject') => {
    setSelectedSubmission(submission)
    setReviewAction(action)
    setReviewComments('')
    setReviewModal(true)
  }

  const submitReview = async () => {
    if (!selectedSubmission) return

    setSubmitting(true)
    try {
      // Supervisor: send 'supervisor_verified' to backend for approve
      const newStatus = reviewAction === 'approve' ? 'supervisor_verified' : 'rejected'
      await internshipsApi.updateSubmissionStatus(
        selectedSubmission._id || selectedSubmission.id,
        newStatus,
        reviewComments
      )
      dispatch(addNotification({
        title: `Submission ${reviewAction}d`,
        message: `${selectedSubmission.studentName}'s submission has been ${reviewAction}d`,
        type: reviewAction === 'approve' ? 'success' : 'info'
      }))

      setReviewModal(false)
      setSelectedSubmission(null)
      // Reload submissions so UI updates immediately
      loadSubmissions();
    } catch (error) {
      dispatch(addNotification({
        title: 'Review failed',
        message: 'Failed to submit review. Please try again.',
        type: 'error'
      }))
    } finally {
      setSubmitting(false)
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
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
     { value: 'under_review', label: 'Under Review' },
     { value: 'supervisor_verified', label: 'Supervisor Verified' },
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
              <span className="text-gray-500">Review Submissions</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Review Submissions</h1>
        <p className="text-gray-600 mt-2">Evaluate and approve student internship submissions</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by student name or company..."
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

      {/* Submissions Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading submissions...</p>
        </div>
      ) : submissions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
            <p className="text-gray-600">No submissions match your current filters</p>
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
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {submission.studentName}
                      </h3>
                      <p className="text-sm text-gray-600">{submission.studentEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(submission.status)}
                    {getStatusBadge(submission.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Company Info */}
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="h-4 w-4 mr-2" />
                  <span>{submission.companyName} - {submission.position}</span>
                </div>

                {/* Duration */}
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {format(new Date(submission.duration.startDate), 'MMM dd, yyyy')} - {' '}
                    {format(new Date(submission.duration.endDate), 'MMM dd, yyyy')}
                  </span>
                </div>

                {/* Description Preview */}
                <p className="text-sm text-gray-700 line-clamp-2">
                  {submission.description}
                </p>

                {/* Documents */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>{(submission.documents?.length || 0)} document(s)</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Submitted {format(new Date(submission.submittedAt), 'MMM dd, yyyy')}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Link to={`/review/${submission._id || submission.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full flex items-center justify-center">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  
                  {(submission.status === 'pending' || submission.status === 'under_review') && (
                    <>
                      <Button 
                        size="sm" 
                        className="flex items-center"
                        onClick={() => handleReview(submission, 'approve')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="flex items-center"
                        onClick={() => handleReview(submission, 'reject')}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>

                {/* Previous Comments */}
                {submission.reviewerComments && (
                  <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm font-medium text-blue-900 mb-1">Previous Comments:</p>
                    <p className="text-sm text-blue-800">{submission.reviewerComments}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={reviewModal}
        onClose={() => setReviewModal(false)}
        title={`${reviewAction === 'approve' ? 'Approve' : 'Reject'} Submission`}
        size="md"
        footer={
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setReviewModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant={reviewAction === 'approve' ? 'primary' : 'danger'}
              onClick={submitReview}
              loading={submitting}
            >
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} Submission
            </Button>
          </div>
        }
      >
        {selectedSubmission && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Submission Details</h4>
              <p className="text-sm text-gray-600">
                <strong>Student:</strong> {selectedSubmission.studentName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Company:</strong> {selectedSubmission.companyName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Position:</strong> {selectedSubmission.position}
              </p>
            </div>

            <Textarea
              label={`${reviewAction === 'approve' ? 'Approval' : 'Rejection'} Comments`}
              placeholder={`Add your ${reviewAction === 'approve' ? 'approval' : 'rejection'} comments here...`}
              value={reviewComments}
              onChange={(e) => setReviewComments(e.target.value)}
              rows={4}
              helperText={reviewAction === 'reject' ? 'Please provide specific feedback for improvement' : 'Optional: Add any additional comments'}
            />

            {reviewAction === 'approve' && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  By approving this submission, you confirm that the internship details are accurate 
                  and the student has completed their internship satisfactorily.
                </p>
              </div>
            )}

            {reviewAction === 'reject' && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <p className="text-sm text-red-800">
                  Please provide clear feedback to help the student improve their submission. 
                  They will be able to resubmit after addressing your concerns.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}