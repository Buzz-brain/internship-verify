import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Modal } from '../../components/ui/Modal'
import { EditSubmission } from './EditSubmission'
import { 
  ArrowLeft, 
  Building2, 
  User, 
  Calendar, 
  MapPin, 
  FileText, 
  Download, 
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Eye
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { useAppSelector, useAppDispatch } from '../../store'
import { setCurrentSubmission } from '../../store/slices/internshipSlice'
import { internshipsApi } from '../../api/internships'
import { format } from 'date-fns'

export const SubmissionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { currentSubmission } = useAppSelector(state => state.internships)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (id) {
      loadSubmission(id)
    }
  }, [id, refreshKey])

  const loadSubmission = async (submissionId: string) => {
    setLoading(true)
    try {
      const submission = await internshipsApi.getSubmissionById(submissionId)
      dispatch(setCurrentSubmission(submission))
    } catch (error) {
      console.error('Error loading submission:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-600" />
      case 'under_review':
        return <AlertCircle className="h-6 w-6 text-blue-600" />
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case 'verified':
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-600" />
      default:
        return <AlertCircle className="h-6 w-6 text-gray-600" />
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

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your submission is waiting for supervisor review.'
      case 'under_review':
        return 'Your submission is currently being reviewed by the supervisor.'
      case 'approved':
        return 'Your submission has been approved by the supervisor and is awaiting department verification.'
      case 'verified':
        return 'Your submission has been fully verified and recorded on the blockchain.'
      case 'rejected':
        return 'Your submission was rejected. Please review the comments and resubmit if necessary.'
      default:
        return 'Status unknown.'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading submission details...</p>
        </div>
      </div>
    )
  }

  if (!currentSubmission) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Submission not found</h3>
          <p className="text-gray-600 mb-4">The submission you're looking for doesn't exist or has been removed.</p>
          <Link to="/submissions">
            <Button>Back to Submissions</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Edit Modal */}
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Submission"
        size="lg"
      >
        <EditSubmission
          id={currentSubmission?._id}
          initialData={currentSubmission}
          onSuccess={() => {
            setEditOpen(false)
            setRefreshKey(k => k + 1)
          }}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>
      
      {/* Breadcrumb */}
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link to="/submissions" className="text-gray-700 hover:text-blue-600">
                My Submissions
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-500">Submission Details</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header Card */}
      <Card className="mb-8 shadow-sm">
        <CardContent className="py-6 px-4 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link to="/submissions" aria-label="Back to Submissions">
              <Button variant="ghost" size="sm" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            <Building2 className="h-8 w-8 text-blue-500 hidden md:block" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{currentSubmission.companyName}</h1>
              <p className="text-base md:text-lg text-gray-600 font-medium">{currentSubmission.position}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full md:w-auto md:justify-end">
            <div className="flex items-center gap-2">
              {getStatusIcon(currentSubmission.status)}
              {getStatusBadge(currentSubmission.status)}
            </div>
            {["pending", "under_review", "rejected"].includes(currentSubmission.status) && (
              <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
                Edit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                {getStatusIcon(currentSubmission.status)}
                <h2 className="text-xl font-semibold text-gray-900">Verification Status</h2>
                {getStatusBadge(currentSubmission.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-blue-900 capitalize">
                    {currentSubmission.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-sm text-blue-900 mt-2 md:mt-0">
                  {getStatusDescription(currentSubmission.status)}
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      Submission Created
                    </h4>
                    <p className="text-sm text-gray-600">
                      {format(
                        new Date(currentSubmission.submittedAt),
                        "MMM dd, yyyy HH:mm"
                      )}
                    </p>
                  </div>
                </div>

                {currentSubmission.reviewedAt && (
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Eye className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        Supervisor Review
                      </h4>
                      <p className="text-sm text-gray-600">
                        {format(
                          new Date(currentSubmission.reviewedAt),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {currentSubmission.approvedAt && (
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        Department Approval
                      </h4>
                      <p className="text-sm text-gray-600">
                        {format(
                          new Date(currentSubmission.approvedAt),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {currentSubmission.blockchainTimestamp && (
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Shield className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        Blockchain Verification
                      </h4>
                      <p className="text-sm text-gray-600">
                        {format(
                          new Date(currentSubmission.blockchainTimestamp),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Internship Description */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">
                Internship Description
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {currentSubmission.description}
              </p>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">
                Supporting Documents
              </h2>
            </CardHeader>
            <CardContent>
              {currentSubmission.documents.length === 0 ? (
                <p className="text-gray-500">No documents uploaded</p>
              ) : (
                <div className="space-y-3">
                  {currentSubmission.documents.map((doc) => (
                    <div
                      key={doc}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <a
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-700 underline break-all"
                          >
                            {doc}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a href={doc} target="_blank" rel="noopener noreferrer">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </a>
                        <a href={doc} download>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments */}
          {currentSubmission.reviewerComments && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">
                  Reviewer Comments
                </h2>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <p className="text-gray-800">
                    {currentSubmission.reviewerComments}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                Company Information
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {currentSubmission.companyName}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-pink-500 mr-1" />
                    <span>{currentSubmission.companyAddress}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    <span>ID: {currentSubmission.studentId}</span>
                    <br />
                    <span>Name: {currentSubmission.studentName}</span>
                    <br />
                    <span>Email: {currentSubmission.studentEmail}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {currentSubmission.supervisorName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {currentSubmission.supervisorEmail}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Duration</p>
                  <p className="text-sm text-gray-600">
                    {format(
                      new Date(currentSubmission.duration.startDate),
                      "MMM dd, yyyy"
                    )}{" "}
                    -{" "}
                    {format(
                      new Date(currentSubmission.duration.endDate),
                      "MMM dd, yyyy"
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blockchain Information */}
          {currentSubmission.blockchainTxId && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Blockchain Record
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Transaction ID
                  </p>
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 break-all">
                      {currentSubmission.blockchainTxId}
                    </code>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {currentSubmission.blockchainTimestamp && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Verified On
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(
                        new Date(currentSubmission.blockchainTimestamp),
                        "MMM dd, yyyy HH:mm:ss"
                      )}
                    </p>
                  </div>
                )}

                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Immutable Record
                    </span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    This record is permanently stored on the blockchain and
                    cannot be altered.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="secondary"
                className="w-full flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>

              {currentSubmission.status === "rejected" && (
                <Link to="/submit" className="block">
                  <Button className="w-full">Resubmit Internship</Button>
                </Link>
              )}

              <Button
                variant="ghost"
                className="w-full flex items-center justify-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Share Record
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}