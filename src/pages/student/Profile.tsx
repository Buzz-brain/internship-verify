import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Bell, 
  Shield, 
  Save,
  Camera,
  Edit3
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Textarea, Select } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { useAppSelector, useAppDispatch } from '../../store'
import { addNotification, clearNotifications } from '../../store/slices/notificationSlice'
import { authApi } from '../../api/auth'
import { loginSuccess, logout } from '../../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'

interface ProfileForm {
  name: string
  email: string
  phone: string
  address: string
  bio: string
  department: string
  studentId: string
  yearOfStudy: string
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  submissionUpdates: boolean
  systemAnnouncements: boolean
}

export const Profile: React.FC = () => {
  const { user } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)

  // Show spinner if user data is not loaded yet
  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-gray-500 text-lg">Loading profile...</span>
      </div>
    )
  }

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, reset } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      bio: user?.bio || '',
      department: user?.department || '',
      studentId: user?.studentId || '',
      yearOfStudy: user?.yearOfStudy || ''
    }
  })

  // Keep form in sync with user data
  useEffect(() => {
    reset({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      bio: user?.bio || '',
      department: user?.department || '',
      studentId: user?.studentId || '',
      yearOfStudy: user?.yearOfStudy || ''
    })
  }, [user, reset])

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, watch, formState: { errors: passwordErrors } } = useForm<PasswordForm>()

  // const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
  //   emailNotifications: true,
  //   pushNotifications: true,
  //   submissionUpdates: true,
  //   systemAnnouncements: false
  // })

  const onProfileSubmit = async (data: ProfileForm) => {
    setLoading(true)
    try {
      // Connect to backend API
      const updatedUser = await authApi.updateProfile(data)
      dispatch(loginSuccess(updatedUser))
      dispatch(addNotification({
        title: 'Profile updated',
        message: 'Your profile information has been successfully updated',
        type: 'success'
      }))
    } catch (error) {
      dispatch(addNotification({
        title: 'Update failed',
        message: 'Failed to update profile. Please try again.',
        type: 'error'
      }))
    } finally {
      setLoading(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordForm) => {
    setLoading(true)
    try {
      const message = await authApi.changePassword(data.currentPassword, data.newPassword)
      dispatch(
        addNotification({
          title: "Password changed",
          message: message || "Password changed successfully. Please log in again.",
          type: "success",
        })
      );
      setTimeout(() => {
        dispatch(logout())
        dispatch(clearNotifications())
        navigate('/login')
      }, 2000)
    } catch (error: any) {
      dispatch(addNotification({
        title: 'Password change failed',
        message: error?.response?.data?.error || 'Failed to change password. Please try again.',
        type: 'error'
      }))
    } finally {
      setLoading(false)
    }
  }

  // const handleNotificationChange = (key: keyof NotificationSettings) => {
  //   setNotificationSettings(prev => ({
  //     ...prev,
  //     [key]: !prev[key]
  //   }))
  // }

  const yearOptions = [
    { value: '1st Year', label: '1st Year' },
    { value: '2nd Year', label: '2nd Year' },
    { value: '3rd Year', label: '3rd Year' },
    { value: '4th Year', label: '4th Year' },
    { value: 'Graduate', label: 'Graduate' },
  ]

  const departmentOptions = [
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Information Technology', label: 'Information Technology' },
    { value: 'Software Engineering', label: 'Software Engineering' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Cybersecurity', label: 'Cybersecurity' },
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
              <span className="text-gray-500">Profile & Settings</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="text-center py-6">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                  <Camera className="h-3 w-3" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.name || ""}
              </h3>
              <div className="flex items-center justify-center text-sm text-gray-600 mb-1">
                <Mail className="h-4 w-4 mr-1" />
                <span>{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center justify-center text-sm text-gray-600 mb-1">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{user.phone}</span>
                </div>
              )}
              <Badge variant="info" size="sm">
                {user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : "Student"}
              </Badge>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{user?.yearOfStudy || ""}</span>
                </div>
                <div className="flex items-center justify-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{user?.department || ""}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "profile", label: "Profile Information", icon: User },
                { id: "security", label: "Security", icon: Shield },
                { id: "notifications", label: "Notifications", icon: Bell },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Profile Information Tab */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Profile Information
                  </h2>
                  <Edit3 className="h-5 w-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleProfileSubmit(onProfileSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      {...registerProfile("name", {
                        required: "Name is required",
                      })}
                      error={profileErrors.name?.message}
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      {...registerProfile("email", {
                        required: "Email is required",
                      })}
                      error={profileErrors.email?.message}
                    />

                    <Input
                      label="Phone Number"
                      {...registerProfile("phone")}
                      error={profileErrors.phone?.message}
                    />

                    <Input
                      label="Student ID"
                      {...registerProfile("studentId", {
                        required: "Student ID is required",
                      })}
                      error={profileErrors.studentId?.message}
                    />

                    <Select
                      label="Department"
                      options={departmentOptions}
                      {...registerProfile("department")}
                      error={profileErrors.department?.message}
                    />

                    <Select
                      label="Year of Study"
                      options={yearOptions}
                      {...registerProfile("yearOfStudy")}
                      error={profileErrors.yearOfStudy?.message}
                    />
                  </div>

                  <Input
                    label="Address"
                    {...registerProfile("address")}
                    error={profileErrors.address?.message}
                  />

                  <Textarea
                    label="Bio"
                    {...registerProfile("bio")}
                    error={profileErrors.bio?.message}
                    rows={4}
                    helperText="Tell us about yourself and your academic interests"
                  />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      loading={loading}
                      className="flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">
                  Security Settings
                </h2>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                  className="space-y-6"
                >
                  <Input
                    label="Current Password"
                    type="password"
                    {...registerPassword("currentPassword", {
                      required: "Current password is required",
                    })}
                    error={passwordErrors.currentPassword?.message}
                  />

                  <Input
                    label="New Password"
                    type="password"
                    {...registerPassword("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    error={passwordErrors.newPassword?.message}
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    {...registerPassword("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watch("newPassword") ||
                        "Passwords do not match",
                    })}
                    error={passwordErrors.confirmPassword?.message}
                  />

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex">
                      <Shield className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800">
                          Password Requirements
                        </h3>
                        <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                          <li>At least 6 characters long</li>
                          <li>Include uppercase and lowercase letters</li>
                          <li>Include at least one number</li>
                          <li>Include at least one special character</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      loading={loading}
                      className="flex items-center"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">
                  Notification Preferences
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    {
                      key: "pushNotifications" as keyof NotificationSettings,
                      title: "Push Notifications",
                      description: "Receive browser push notifications",
                    },
                    {
                      key: "submissionUpdates" as keyof NotificationSettings,
                      title: "Submission Updates",
                      description:
                        "Get notified when your submission status changes",
                    },
                  ].map((setting) => (
                    <div
                      key={setting.key}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {setting.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {setting.description}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          // checked={notificationSettings[setting.key]}
                          checked={true}
                          // onChange={() => handleNotificationChange(setting.key)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                {/* <div className="flex justify-end">
                  <Button className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div> */}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}