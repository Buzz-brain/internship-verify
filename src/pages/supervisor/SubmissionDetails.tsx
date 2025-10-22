import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { internshipsApi } from '../../api/internships';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Calendar, Building2, User, FileText, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { InternshipSubmission } from '../../store/slices/internshipSlice';

const statusLabels: Record<string, string> = {
  pending: 'Pending Review',
  under_review: 'Under Review',
  supervisor_verified: 'Supervisor Verified',
  department_approved: 'Department Approved',
  verified: 'Blockchain Verified',
  rejected: 'Rejected',
  approved: 'Approved',
};

const statusVariants: Record<string, string> = {
  pending: 'warning',
  under_review: 'info',
  supervisor_verified: 'success',
  department_approved: 'success',
  verified: 'success',
  rejected: 'danger',
  approved: 'success',
};

export const SubmissionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<InternshipSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await internshipsApi.getSupervisorSubmissionById(id!);
        if (!data) throw new Error('Submission not found');
        setSubmission(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load submission');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading submission details...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!submission) {
    return <div className="p-8 text-center text-gray-500">Submission not found.</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link to="/review" className="inline-flex items-center text-blue-600 mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Review
      </Link>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Submission Details</h2>
            <Badge variant={statusVariants[submission.status] as any || 'default'}>
              {statusLabels[submission.status] || submission.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <User className="h-6 w-6 text-blue-600" />
            <div>
              <div className="text-lg font-semibold text-gray-900">{submission.studentName}</div>
              <div className="text-sm text-gray-600">{submission.studentEmail}</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Building2 className="h-5 w-5 text-blue-400" />
            <span className="text-gray-700">{submission.companyName} - {submission.position}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-yellow-500" />
            <span className="text-gray-700">
              {format(new Date(submission.duration.startDate), 'MMM dd, yyyy')} - {format(new Date(submission.duration.endDate), 'MMM dd, yyyy')}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Description</h4>
            <p className="text-gray-700">{submission.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700">{submission.documents?.length || 0} document(s)</span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Status History</h4>
            <ul className="text-sm text-gray-600 list-disc ml-6">
              <li>Submitted: {submission.submittedAt ? format(new Date(submission.submittedAt), 'MMM dd, yyyy') : 'N/A'}</li>
              {submission.reviewedAt && <li>Reviewed: {format(new Date(submission.reviewedAt), 'MMM dd, yyyy')}</li>}
              {submission.approvedAt && <li>Department Approved: {format(new Date(submission.approvedAt), 'MMM dd, yyyy')}</li>}
              {submission.blockchainTimestamp && <li>Blockchain Verified: {format(new Date(submission.blockchainTimestamp), 'MMM dd, yyyy')}</li>}
            </ul>
          </div>
          {submission.reviewerComments && (
            <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm font-medium text-blue-900 mb-1">Supervisor Comments:</p>
              <p className="text-sm text-blue-800">{submission.reviewerComments}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionDetails;
