'use client'

import Link from 'next/link'
import { useJobs } from '@/hooks/use-jobs'
import { useToast } from '@/components/providers/toast-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Empty } from '@/components/ui/empty'
import { Calendar, MapPin, DollarSign, Trash2, Edit2, Briefcase } from 'lucide-react'
import { useState } from 'react'

const STATUS_COLORS: Record<string, string> = {
  applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  interviewing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  offered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  closed: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
}

export default function JobsList() {
  const { jobs, isLoading, deleteJob } = useJobs()
  const { info } = useToast()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this job application?')) {
      setDeletingId(id)
      try {
        await deleteJob(id)
        info('Job application deleted')
      } catch (error) {
        console.error('Delete error:', error)
      } finally {
        setDeletingId(null)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-12 border border-zinc-200 dark:border-zinc-800 shadow-lg">
        <Empty
          title="No job applications yet"
          description="Start tracking your job search by adding your first application."
          action={
            <Link href="/dashboard/new">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Add Application
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.id} className="flex flex-col border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold truncate text-zinc-900 dark:text-white">
                      {job.position}
                    </CardTitle>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">{job.company}</p>
                  </div>
                </div>
                <Badge className={`${STATUS_COLORS[job.status] || STATUS_COLORS.applied} text-sm font-medium px-3 py-1`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              {job.location && (
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
              )}

              {job.salary && (
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <DollarSign className="w-4 h-4" />
                  {job.salary}
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Calendar className="w-4 h-4" />
                Applied: {new Date(job.appliedDate).toLocaleDateString()}
              </div>

              {job.notes && (
                <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  {job.notes}
                </p>
              )}

              <div className="flex gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <Link href={`/dashboard/jobs/${job.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800 gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(job.id)}
                  disabled={deletingId === job.id}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
