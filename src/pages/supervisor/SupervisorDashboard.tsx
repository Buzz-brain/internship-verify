import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Building2
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { useAppSelector, useAppDispatch } from '../../store'
import { setSubmissions } from '../../store/slices/internshipSlice'
import { addNotification } from '../../store/slices/notificationSlice'
import { internshipsApi } from '../../api/internships'
import { format } from 'date-fns'

export const SupervisorDashboard: React.FC = () => {
  // const { user } = useAppSelector(state => state.auth)
  const { submissions } = useAppSelector(state => state.internships)
  const dispatch = useAppDispatch()

  useEffect(() => {
    loadSubmissions()
    // Add welcome notification
    dispatch(addNotification({
      title: 'Welcome to Supervisor Portal',
      message: 'You have pending submissions to review.',
      type: 'info'
    }))
  }, [])

  const loadSubmissions = async () => {
    try {
      const data = await internshipsApi.getSupervisorSubmissions()
      dispatch(setSubmissions(data))
    } catch (error) {
      console.error('Error loading submissions:', error)
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

  const stats = [
    {
      title: 'Total Submissions',
      value: submissions.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Pending Review',
      value: submissions.filter(s => s.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Approved',
      value: submissions.filter(s => s.status === 'department_approved').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Under Review',
      value: submissions.filter(s => s.status === 'under_review').length,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  const pendingSubmissions = submissions.filter(s => s.status === 'pending' || s.status === 'under_review')

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Supervisor Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Review and verify student internship submissions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="py-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/review">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="text-center py-6">
              <Eye className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Review Submissions
              </h3>
              <p className="text-sm text-gray-600">
                Evaluate pending submissions
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/verified">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="text-center py-6">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Verified Records
              </h3>
              <p className="text-sm text-gray-600">View approved submissions</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/profile">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="text-center py-6">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Profile
              </h3>
              <p className="text-sm text-gray-600">Manage your account</p>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="text-center py-6">
            <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Analytics
            </h3>
            <p className="text-sm text-gray-600">Review statistics</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reviews */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Pending Reviews
            </h2>
            <Link to="/review">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {pendingSubmissions.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                All caught up!
              </h3>
              <p className="text-gray-600 mb-4">
                No pending submissions to review at the moment
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSubmissions.slice(0, 5).map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">
                        {submission.studentName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {submission.companyName} - {submission.position}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 text-yellow-500 mr-1" />
                        Submitted on{" "}
                        {format(
                          new Date(submission.submittedAt),
                          "MMM dd, yyyy"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(submission.status)}
                    <Link to={`/review/${submission.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}