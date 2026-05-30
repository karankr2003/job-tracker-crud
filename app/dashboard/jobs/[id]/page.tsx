'use client'

import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useJobs } from '@/hooks/use-jobs'
import JobDetail from '@/components/jobs/job-detail'
import { Spinner } from '@/components/ui/spinner'
import { useEffect, useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function JobDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { loading: authLoading, isAuthenticated } = useAuth()
  const { jobs, isLoading: jobsLoading } = useJobs()

  const id = useMemo(() => {
    const paramId = params?.id
    return typeof paramId === 'string' ? Number.parseInt(paramId, 10) : null
  }, [params?.id])

  const job = useMemo(() => {
    return id ? jobs.find((j) => j.id === id) : null
  }, [id, jobs])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (!jobsLoading && !job && id) {
      router.push('/dashboard')
    }
  }, [jobsLoading, job, id, router])

  if (authLoading || jobsLoading || !job) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center">
        <Spinner />
      </main>
    )
  }

  return (
    <main className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 max-w-4xl py-8">
          <JobDetail job={job} />
        </div>
      </div>
    </main>
  )
}
