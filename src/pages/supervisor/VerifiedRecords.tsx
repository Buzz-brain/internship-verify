import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  ExternalLink,
  Calendar,
  Building2,
  User,
  Shield,
  Download
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { useAppSelector, useAppDispatch } from '../../store'
import { setSubmissions, updateFilters } from '../../store/slices/internshipSlice'
import { internshipsApi } from '../../api/internships'
import { format } from 'date-fns'

export const VerifiedRecords: React.FC = () => {
  // const { user } = useAppSelector(state => state.auth)
  const { submissions, filters } = useAppSelector(state => state.internships)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadVerifiedSubmissions()
  }, [filters])

  const loadVerifiedSubmissions = async () => {
    setLoading(true)
    try {
      const data = await internshipsApi.getSupervisorSubmissions()
      // Only show approved/verified
      const verifiedSubmissions = data.filter(s => s.status === 'department_approved' || s.status === 'verified')
      dispatch(setSubmissions(verifiedSubmissions))
    } catch (error) {
      console.error('Error loading verified submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusOptions = [
    { value: 'all', label: 'All Verified' },
    { value: 'approved', label: 'Approved' },
    { value: 'verified', label: 'Blockchain Verified' },
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
              <span className="text-gray-500">Verified Records</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Verified Records</h1>
        <p className="text-gray-600 mt-2">View all approved and verified internship submissions</p>
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
              value={filters.status === 'department_approved' || filters.status === 'verified' ? filters.status : 'all'}
              onChange={(e) => dispatch(updateFilters({ status: e.target.value as any }))}
            />
            
            <Button variant="secondary" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Export Records
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Verified</p>
                <p className="text-3xl font-bold text-gray-900">{submissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Blockchain Verified</p>
                <p className="text-3xl font-bold text-gray-900">
                  {submissions.filter(s => s.status === 'verified').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-gray-900">
                  {submissions.filter(s => {
                    const submissionDate = new Date(s.submittedAt)
                    const currentDate = new Date()
                    return submissionDate.getMonth() === currentDate.getMonth() &&
                           submissionDate.getFullYear() === currentDate.getFullYear()
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Verified Submissions</h2>
            <span className="text-sm text-gray-500">{submissions.length} records</span>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading verified records...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No verified records found</h3>
              <p className="text-gray-600">No submissions match your current filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student & Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approved Date
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
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {submission.studentName}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Building2 className="h-4 w-4 text-blue-400 mr-1" />
                              {submission.companyName} - {submission.position}
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
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <Badge variant={submission.status === 'verified' ? 'success' : 'info'}>
                            {submission.status === 'verified' ? 'Blockchain Verified' : 'Approved'}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {submission.approvedAt ? 
                          format(new Date(submission.approvedAt), 'MMM dd, yyyy') : 
                          'Pending'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission.blockchainTxId ? (
                          <div className="flex items-center">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {submission.blockchainTxId.substring(0, 10)}...
                            </code>
                            <button className="ml-2 text-gray-400 hover:text-gray-600">
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link to={`/submissions/${submission.id}`}>
                            <Button variant="ghost" size="sm" className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="flex items-center">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        </div>
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