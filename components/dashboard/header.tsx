'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { LogOut, Plus, Briefcase, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface DashboardHeaderProps {
  readonly user: {
    id: number
    email: string
    name: string
  }
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const { logout } = useAuth()

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to logout?')) return
    await logout()
    globalThis.location.href = '/login'
  }

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Job Application Tracker
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Welcome back, {user.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">AI-Powered</span>
          </div>

          <Link href="/dashboard/new">
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Application
            </Button>
          </Link>

          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
