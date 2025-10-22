import React from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { useAppSelector } from '../../store'
import { NotificationToaster } from '../ui/NotificationToaster'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector(state => state.auth)

  if (!isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <NotificationToaster />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}