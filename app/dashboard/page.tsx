'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useJobs } from '@/hooks/use-jobs'
import DashboardHeader from '@/components/dashboard/header'
import JobsList from '../../components/dashboard/jobs-list'
import { Spinner } from '@/components/ui/spinner'
import { Briefcase, Calendar, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()
  const { jobs, isLoading: jobsLoading } = useJobs()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  // Calculate stats from actual data
  const stats = useMemo(() => {
    if (!jobs || jobs.length === 0) {
      return {
        totalApplications: 0,
        interviewsScheduled: 0,
        successRate: 0
      }
    }

    const totalApplications = jobs.length
    const interviewsScheduled = jobs.filter(job => 
      job.status === 'interviewing' || job.interviewDate
    ).length
    const successfulApplications = jobs.filter(job => 
      job.status === 'offered'
    ).length
    const successRate = totalApplications > 0 
      ? Math.round((successfulApplications / totalApplications) * 100)
      : 0

    return {
      totalApplications,
      interviewsScheduled,
      successRate
    }
  }, [jobs])

  if (loading || jobsLoading) {
    return (
      <main className="h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center">
        <Spinner />
      </main>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 overflow-y-auto">
      <DashboardHeader user={user} />
      
      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Applications</p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-1">{stats.totalApplications}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Interviews Scheduled</p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-1">{stats.interviewsScheduled}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Success Rate</p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-1">{stats.successRate}%</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
            Your Job Applications
          </h2>
          <JobsList />
        </div>
      </div>
    </main>
  )
}
