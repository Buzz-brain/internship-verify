import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { UserPlus } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input, Select } from '../components/ui/Input'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { useAppDispatch, useAppSelector } from '../store'
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice'
import { authApi } from '../api/auth'

interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: string
  studentId?: string
  // supervisorId?: string
}

export const Register: React.FC = () => {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector(state => state.auth)
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>()
  const watchRole = watch('role')

  const onSubmit = async (data: RegisterForm) => {
    try {
      dispatch(loginStart())
      const response = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        studentId: data.studentId,
        // supervisorId: data.supervisorId,
      })
      dispatch(loginSuccess(response.user))
      navigate('/dashboard', { state: { registrationSuccess: true } })
    } catch (err) {
      dispatch(loginFailure(err instanceof Error ? err.message : 'Registration failed'))
    }
  }

  const roleOptions = [
    { value: '', label: 'Select your role' },
    { value: 'student', label: 'Student' },
    { value: 'supervisor', label: 'Industrial Supervisor' },
    { value: 'department', label: 'Department Staff' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Join the internship verification system</p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold text-center">Get Started</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <Input
                label="Full Name"
                {...register('name', { required: 'Name is required' })}
                error={errors.name?.message}
                placeholder="Enter your full name"
              />

              <Input
                label="Email Address"
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address'
                  }
                })}
                error={errors.email?.message}
                placeholder="Enter your email"
              />

              <Select
                label="Role"
                options={roleOptions}
                {...register('role', { required: 'Please select your role' })}
                error={errors.role?.message}
              />

              {watchRole === 'student' && (
                <Input
                  label="Student ID"
                  {...register('studentId', { required: 'Student ID is required for students' })}
                  error={errors.studentId?.message}
                  placeholder="Enter your student ID"
                />
              )}

              {/* {watchRole === 'supervisor' && (
                <Input
                  label="Supervisor ID"
                  {...register('supervisorId', { required: 'Supervisor ID is required' })}
                  error={errors.supervisorId?.message}
                  placeholder="Enter your supervisor ID"
                />
              )} */}

              <Input
                label="Password"
                type="password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                error={errors.password?.message}
                placeholder="Create a password"
              />

              <Input
                label="Confirm Password"
                type="password"
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: (value) => 
                    value === watch('password') || 'Passwords do not match'
                })}
                error={errors.confirmPassword?.message}
                placeholder="Confirm your password"
              />

              <Button
                type="submit"
                className="w-full"
                loading={loading}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}