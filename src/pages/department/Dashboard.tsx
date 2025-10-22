

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Home, CheckSquare, Users, Database, BarChart3, FileText, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import { usersApi } from '../../api/users';
import { analyticsApi } from '../../api/analytics';
import { auditApi, AuditLog } from '../../api/audit';

const statIcons = {
  total: FileText,
  pending: Clock,
  verified: CheckCircle,
  rejected: XCircle,
  users: User,
};

const quickActions = [
  {
    label: 'Approve Submissions',
    icon: CheckSquare,
    path: '/approve',
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    desc: 'Review and approve pending submissions',
  },
  {
    label: 'Manage Users',
    icon: Users,
    path: '/users',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    desc: 'Add, update, or remove users',
  },
  {
    label: 'Audit Trail',
    icon: Database,
    path: '/audit',
    color: 'text-green-600',
    bg: 'bg-green-100',
    desc: 'View all system activity logs',
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    desc: 'See department analytics and stats',
  },
  {
    label: 'Profile',
    icon: User,
    path: '/profile',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    desc: 'View and edit your department profile',
  },
];


const DepartmentDashboard: React.FC = () => {
  const [stats, setStats] = useState([
    { title: 'Total Submissions', value: 0, icon: statIcons.total, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Pending Approvals', value: 0, icon: statIcons.pending, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { title: 'Verified', value: 0, icon: statIcons.verified, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: 'Rejected', value: 0, icon: statIcons.rejected, color: 'text-red-600', bgColor: 'bg-red-100' },
    { title: 'Total Users', value: 0, icon: statIcons.users, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ]);
    const [recentActivity, setRecentActivity] = useState<AuditLog[]>([]);
    useEffect(() => {
      const fetchStatsAndActivity = async () => {
        try {
          // Get analytics for submissions
          const analytics = await analyticsApi.getDepartmentAnalytics();
          // Get users
          const users = await usersApi.getUsers();
          setStats([
            { title: 'Total Submissions', value: analytics.total || 0, icon: statIcons.total, color: 'text-blue-600', bgColor: 'bg-blue-100' },
            { title: 'Pending Approvals', value: analytics.pending || 0, icon: statIcons.pending, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
            { title: 'Verified', value: analytics.verified || 0, icon: statIcons.verified, color: 'text-green-600', bgColor: 'bg-green-100' },
            { title: 'Rejected', value: analytics.rejected || 0, icon: statIcons.rejected, color: 'text-red-600', bgColor: 'bg-red-100' },
            { title: 'Total Users', value: users.length, icon: statIcons.users, color: 'text-purple-600', bgColor: 'bg-purple-100' },
          ]);
          // Get recent activity logs
          const logs = await auditApi.getAuditLogs();
          setRecentActivity(logs.slice(0, 5)); // Show only the 5 most recent
        } catch (err) {
          console.error('Error fetching department analytics, users, or activity:', err);
        }
      };
      fetchStatsAndActivity();
    }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-center space-x-4">
        <div className="p-3 rounded-full bg-blue-100">
          <Home className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, Department Admin!</h1>
          <p className="text-gray-600 mt-2">Monitor, approve, and manage all internship submissions and users in your department.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="py-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.bgColor}`}><Icon className={`h-6 w-6 ${stat.color}`} /></div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link to={action.path ?? '#'} key={action.label}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="text-center py-6">
                  {Icon && <Icon className={`h-12 w-12 mx-auto mb-4 ${action.color}`} />}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.label}</h3>
                  <p className="text-sm text-gray-600">{action.desc}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Department Activity</h2>
        <div className="bg-white rounded-lg shadow p-6">
          {recentActivity.length === 0 ? (
            <div className="text-gray-500 text-center">No recent activity to display.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentActivity.map((log) => (
                <li key={log._id} className="py-3 flex items-start justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{typeof log.user === 'object' ? log.user.name : log.user}</div>
                    <div className="text-gray-600 text-sm">{log.action}</div>
                    {log.details && (
                      <div className="text-xs text-gray-400 mt-1">
                        {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">{new Date(log.date).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
