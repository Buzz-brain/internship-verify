import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, User, LogOut, Settings } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../store'
import { logout } from '../../store/slices/authSlice'
import { authApi } from '../../api/auth'
import { Badge } from '../ui/Badge'

export const Navbar: React.FC = () => {
  const { user } = useAppSelector(state => state.auth)
  const { unreadCount } = useAppSelector(state => state.notifications)
  const dispatch = useAppDispatch()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (err) {
      // Optionally show a notification or log error
    }
    dispatch(logout())
    setShowDropdown(false)
  }

  if (!user) return null

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IV</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Internship Verification</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Link 
            to="/notifications" 
            className="relative p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <Badge variant="info" size="sm" className="mt-1">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Profile & Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}