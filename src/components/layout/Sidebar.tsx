import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  FileText, 
  Clock, 
  CheckSquare, 
  Users, 
  Database,
  BarChart3,
  Settings,
  Upload,
  Eye,
  Bell,
} from 'lucide-react'
import { useAppSelector } from '../../store'
import { clsx } from 'clsx'

export const Sidebar: React.FC = () => {
  const { user } = useAppSelector(state => state.auth)
  const location = useLocation()

  if (!user) return null

  const getMenuItems = () => {
    switch (user.role) {
      case 'student':
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard' },
          { icon: Upload, label: 'Submit Internship', path: '/submit' },
          { icon: Clock, label: 'Submission Status', path: '/status' },
          { icon: FileText, label: 'My Submissions', path: '/submissions' },
          { icon: Bell, label: 'Notifications', path: '/notifications' },
          { icon: Settings, label: 'Profile', path: '/profile' },
        ]
      case 'supervisor':
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard' },
          { icon: Eye, label: 'Review Submissions', path: '/review' },
          { icon: CheckSquare, label: 'Verified Records', path: '/verified' },
          { icon: Bell, label: 'Notifications', path: '/notifications' },
          { icon: Settings, label: 'Profile', path: '/profile' },
        ]
      case 'department':
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard' },
          { icon: CheckSquare, label: 'Approve Submissions', path: '/approve' },
          { icon: Users, label: 'Manage Users', path: '/users' },
          { icon: Bell, label: 'Notifications', path: '/notifications' },
          { icon: Database, label: 'Audit Trail', path: '/audit' },
          { icon: BarChart3, label: 'Analytics', path: '/analytics' },
          { icon: Settings, label: 'Profile', path: '/profile' },
        ]
      default:
        return []
    }
  }

  const menuItems = getMenuItems()

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">IV</span>
          </div>
          <span className="font-semibold">Internship Portal</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}