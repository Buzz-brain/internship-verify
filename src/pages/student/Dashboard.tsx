import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Upload, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { useAppSelector, useAppDispatch } from '../../store'
import { setSubmissions } from '../../store/slices/internshipSlice'
import { addNotification } from '../../store/slices/notificationSlice'
import { internshipsApi } from '../../api/internships'
import { format } from 'date-fns'

import { useLocation } from 'react-router-dom'

export const StudentDashboard: React.FC = () => {
  const { user } = useAppSelector(state => state.auth)
  const { submissions } = useAppSelector(state => state.internships)
  const dispatch = useAppDispatch()
  const location = useLocation()

  useEffect(() => {
    loadSubmissions()
    // Only show registration or login success notification, not welcome, if redirected from those actions
    if (location.state && (location.state.registrationSuccess || location.state.loginSuccess)) {
      if (location.state.registrationSuccess) {
        dispatch(addNotification({
          title: 'Registration Successful',
          message: 'Your account has been created. Welcome!',
          type: 'success'
        }))
      }
      // Remove state so it doesn't show again on refresh
      window.history.replaceState({}, document.title)
    }
  }, [])

  const loadSubmissions = async () => {
    try {
      const data = await internshipsApi.getSubmissions()
  // Filter to only show current user's submissions (studentId is matric number)
  const userSubmissions = data.filter(s => s.studentId === user?.studentId)
  dispatch(setSubmissions(userSubmissions))
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
      title: 'Approved',
      value: submissions.filter(s => s.status === 'department_approved').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Under Review',
      value: submissions.filter(s => s.status === 'under_review').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Pending',
      value: submissions.filter(s => s.status === 'pending').length,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Track your internship submissions and verification status
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
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
        <Link to="/submit">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="text-center py-6">
              <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Submit Internship
              </h3>
              <p className="text-sm text-gray-600">
                Start new verification process
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/status">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="text-center py-6">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Track Status
              </h3>
              <p className="text-sm text-gray-600">
                Monitor verification progress
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/submissions">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="text-center py-6">
              <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                My Submissions
              </h3>
              <p className="text-sm text-gray-600">View all submissions</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/profile">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="text-center py-6">
              <Calendar className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Profile
              </h3>
              <p className="text-sm text-gray-600">Update your information</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Submissions
            </h2>
            <Link to="/submissions">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-8">
              <Upload className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No submissions yet
              </h3>
              <p className="text-gray-600 mb-4">
                Get started by submitting your first internship for verification
              </p>
              <Link to="/submit">
                <Button>Submit Internship</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.slice(0, 3).map((submission) => (
                <div
                  key={submission._id || submission.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">
                      {submission.companyName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {submission.position}
                    </p>
                    <p className="text-sm text-gray-500">
                      Submitted on{" "}
                      {format(new Date(submission.submittedAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(submission.status)}
                    <Link to={`/submissions/${submission._id}`}>
                      <Button variant="ghost" size="sm">
                        View Details
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