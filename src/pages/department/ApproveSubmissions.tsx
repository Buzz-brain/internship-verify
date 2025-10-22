
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { FileText, User, Building2, CheckCircle, XCircle, Clock, Filter, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setSubmissions, updateSubmission } from '../../store/slices/internshipSlice';
import { internshipsApi } from '../../api/internships';
import { format } from 'date-fns';

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'supervisor_verified', label: 'Supervisor Verified' },
  { value: 'department_approved', label: 'Department Approved' },
  { value: 'verified', label: 'Blockchain Verified' },
  { value: 'rejected', label: 'Rejected' },
];

const ApproveSubmissions: React.FC = () => {
  const dispatch = useAppDispatch();
  const { submissions } = useAppSelector(state => state.internships);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: 'all', search: '' });
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [actionModal, setActionModal] = useState<'approve' | 'verify' | 'reject' | null>(null);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadSubmissions(); }, [filters]);

  // Fetch department submissions from backend
  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const params = filters.status !== 'all' ? `?status=${filters.status}` : '';
      const submissions = await internshipsApi.getDepartmentSubmissions(params);
      dispatch(setSubmissions(submissions));
    } catch (err) {
      // TODO: handle error (show toast or error message)
    } finally {
      setLoading(false);
    }
  };

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

  const handleAction = (submission: any, action: 'approve' | 'verify' | 'reject') => {
    setSelectedSubmission(submission);
    setActionModal(action);
    setComments('');
  };

  // Approve/verify/reject submission using backend
  const submitAction = async () => {
    if (!selectedSubmission || !actionModal) return;
    setSubmitting(true);
    try {
      let status: 'department_approved' | 'verified' | 'rejected' = 'department_approved';
      if (actionModal === 'approve') status = 'department_approved';
      if (actionModal === 'verify') status = 'verified';
      if (actionModal === 'reject') status = 'rejected';
      const updated = await internshipsApi.updateDepartmentSubmissionStatus(
        selectedSubmission._id || selectedSubmission.id,
        status,
        comments
      );
      dispatch(updateSubmission(updated));
      setActionModal(null);
      setSelectedSubmission(null);
    } catch (err) {
      // TODO: handle error (show toast or error message)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Approve Submissions</h1>
        <p className="text-gray-600">Review, approve, verify, or reject internship submissions for your department.</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by student or company..."
                className="pl-10"
                value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              />
            </div>
            <Select
              options={statusOptions}
              value={filters.status}
              onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
            />
            <Button variant="secondary" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading submissions...</div>
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
                      <h3 className="text-lg font-semibold text-gray-900">{submission.studentName}</h3>
                      <p className="text-sm text-gray-600">{submission.studentEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(submission.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="h-4 w-4 mr-2" />
                  <span>{submission.companyName} - {submission.position}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Submitted {format(new Date(submission.submittedAt), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>{(submission.documents?.length || 0)} document(s)</span>
                </div>
                <div className="flex space-x-2 pt-2">
                  {submission.status === 'supervisor_verified' && (
                    <Button size="sm" className="flex items-center" onClick={() => handleAction(submission, 'approve')}>
                      <CheckCircle className="h-4 w-4 mr-2" />Approve
                    </Button>
                  )}
                  {['department_approved'].includes(submission.status) && (
                    <Button size="sm" className="flex items-center" onClick={() => handleAction(submission, 'verify')}>
                      <CheckCircle className="h-4 w-4 mr-2" />Verify
                    </Button>
                  )}
                  {['supervisor_verified', 'department_approved'].includes(submission.status) && (
                    <Button variant="danger" size="sm" className="flex items-center" onClick={() => handleAction(submission, 'reject')}>
                      <XCircle className="h-4 w-4 mr-2" />Reject
                    </Button>
                  )}
                </div>
                {submission.departmentComments && (
                  <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                    <p className="text-sm font-medium text-green-900 mb-1">Department Comments:</p>
                    <p className="text-sm text-green-800">{submission.departmentComments}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Action Modal */}
      <Modal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        title={
          actionModal === 'approve' ? 'Approve Submission' :
          actionModal === 'verify' ? 'Verify Submission (Blockchain)' :
          actionModal === 'reject' ? 'Reject Submission' : ''
        }
        size="md"
        footer={
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={() => setActionModal(null)}>Cancel</Button>
            <Button variant={actionModal === 'reject' ? 'danger' : 'primary'} onClick={submitAction} loading={submitting}>
              {actionModal === 'approve' ? 'Approve' : actionModal === 'verify' ? 'Verify' : 'Reject'} Submission
            </Button>
          </div>
        }
      >
        {selectedSubmission && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Submission Details</h4>
              <p className="text-sm text-gray-600"><strong>Student:</strong> {selectedSubmission.studentName}</p>
              <p className="text-sm text-gray-600"><strong>Company:</strong> {selectedSubmission.companyName}</p>
              <p className="text-sm text-gray-600"><strong>Position:</strong> {selectedSubmission.position}</p>
            </div>
            <Input
              label={actionModal === 'reject' ? 'Rejection Comments' : 'Comments'}
              placeholder={actionModal === 'reject' ? 'Please provide reason for rejection...' : 'Optional comments'}
              value={comments}
              onChange={e => setComments(e.target.value)}
            />
            {actionModal === 'verify' && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  By verifying, you confirm this submission is valid and will be written to the blockchain.
                </p>
              </div>
            )}
            {actionModal === 'reject' && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <p className="text-sm text-red-800">
                  Please provide clear feedback to help the student improve their submission.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApproveSubmissions;
