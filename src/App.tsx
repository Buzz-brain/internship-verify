import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store, useAppDispatch, useAppSelector } from './store'
import { Layout } from './components/layout/Layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { loginSuccess, logout } from './store/slices/authSlice'
import { authApi } from './api/auth'

// Pages
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { NotFound } from './pages/NotFound'
// Student Pages
import { StudentDashboard } from './pages/student/Dashboard'
import { Submit } from './pages/student/Submit'
import { SubmissionStatus } from './pages/student/SubmissionStatus'
import { MySubmissions } from './pages/student/MySubmissions'
import { Profile } from './pages/student/Profile'
import { SubmissionDetails as StudentSubmissionDetails } from './pages/student/SubmissionDetails'
import { SubmissionDetails as SupervisorSubmissionDetails } from './pages/supervisor/SubmissionDetails'
import DepartmentDashboard from './pages/department/Dashboard'
import ApproveSubmissions from './pages/department/ApproveSubmissions'
import ManageUsers from './pages/department/ManageUsers'
import AuditTrail from './pages/department/AuditTrail'
import Analytics from './pages/department/Analytics'
import Notifications from './pages/Notifications'
// import DepartmentSettings from './pages/department/Settings'

// Supervisor Pages
import { SupervisorDashboard } from './pages/supervisor/SupervisorDashboard'
import { ReviewSubmissions } from './pages/supervisor/ReviewSubmissions'
import { VerifiedRecords } from './pages/supervisor/VerifiedRecords'

// AuthInitializer with loading state
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    (async () => {
      try {
        const user = await authApi.getProfile()
        dispatch(loginSuccess(user))
      } catch {
        dispatch(logout())
      } finally {
        setLoading(false)
      }
    })()
  }, [dispatch])
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }
  return <>{children}</>
}



function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthInitializer>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Protected Routes (wrapped in Layout) */}
            <Route path="/dashboard" element={
              <Layout>
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/submit" element={
              <Layout>
                <ProtectedRoute allowedRoles={['student']}>
                  <Submit />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/status" element={
              <Layout>
                <ProtectedRoute allowedRoles={['student']}>
                  <SubmissionStatus />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/submissions" element={
              <Layout>
                <ProtectedRoute allowedRoles={['student']}>
                  <MySubmissions />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/submissions/:id" element={
              <Layout>
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentSubmissionDetails />
                </ProtectedRoute>
              </Layout>
            } />

            <Route path="/profile" element={
              <Layout>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </Layout>
            } />

             {/* Supervisor Routes */}
            <Route path="/review" element={
              <Layout>
                <ProtectedRoute allowedRoles={['supervisor']}>
                  <ReviewSubmissions />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/review/:id" element={
              <Layout>
                <ProtectedRoute allowedRoles={['supervisor']}>
                  <SupervisorSubmissionDetails />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/verified" element={
              <Layout>
                <ProtectedRoute allowedRoles={['supervisor']}>
                  <VerifiedRecords />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/notifications" element={
              <Layout>
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              </Layout>
            } />

             {/* Department Routes */}
<Route path="/approve" element={
              <Layout>
                <ProtectedRoute allowedRoles={['department']}>
                  <ApproveSubmissions />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/users" element={
              <Layout>
                <ProtectedRoute allowedRoles={['department']}>
                  <ManageUsers />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/audit" element={
              <Layout>
                <ProtectedRoute allowedRoles={['department']}>
                  <AuditTrail />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/analytics" element={
              <Layout>
                <ProtectedRoute allowedRoles={['department']}>
                  <Analytics />
                </ProtectedRoute>
              </Layout>
            } />
            {/* 404 */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AuthInitializer>
      </Router>
    </Provider>
  )
}

// Dashboard Router based on user role
const DashboardRouter: React.FC = () => {
  const user = useAppSelector(state => state.auth.user)
  switch (user?.role) {
    case 'student':
      return <StudentDashboard />
    case 'supervisor':
      return <SupervisorDashboard />
    case 'department':
      return <DepartmentDashboard />
    default:
      return <Navigate to="/login" replace />
  }
}

export default App