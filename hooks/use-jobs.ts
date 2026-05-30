import { useEffect, useState, useCallback } from 'react'
import { useToast } from '@/components/providers/toast-provider'

export interface JobApplication {
  id: number
  company: string
  position: string
  status: string
  description?: string
  requirements?: string
  salary?: string
  location?: string
  appliedDate: string
  interviewDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export function useJobs() {
  const [jobs, setJobs] = useState<JobApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { success, error: toastError } = useToast()

  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/jobs')
      if (!response.ok) throw new Error('Failed to fetch jobs')
      const data = await response.json()
      setJobs(data.jobs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toastError('Failed to load jobs')
    } finally {
      setIsLoading(false)
    }
  }, [toastError])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const createJob = useCallback(async (jobData: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      })

      if (!response.ok) {
        throw new Error('Failed to create job')
      }

      const result = await response.json()
      await fetchJobs()
      success('Job application created successfully')
      return result.job
    } catch (error) {
      toastError('Failed to create job application')
      throw error
    }
  }, [fetchJobs, success, toastError])

  const updateJob = useCallback(async (id: number, updates: Partial<JobApplication>) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update job')
      }

      const result = await response.json()
      await fetchJobs()
      success('Job application updated successfully')
      return result.job
    } catch (error) {
      toastError('Failed to update job application')
      throw error
    }
  }, [fetchJobs, success, toastError])

  const deleteJob = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete job')
      }

      await fetchJobs()
      // Toast is shown by the caller (jobs-list.tsx)
    } catch (error) {
      toastError('Failed to delete job application')
      throw error
    }
  }, [fetchJobs, toastError])

  const updateStatus = useCallback(async (id: number, status: string) => {
    return updateJob(id, { status })
  }, [updateJob])

  return {
    jobs,
    isLoading,
    error,
    createJob,
    updateJob,
    deleteJob,
    updateStatus,
    refetch: fetchJobs,
  }
}
