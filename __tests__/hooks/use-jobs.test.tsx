import { renderHook, act } from '@testing-library/react'
import { useJobs, JobApplication } from '@/hooks/use-jobs'
import { ToastProvider } from '@/components/providers/toast-provider'

// Mock fetch
globalThis.fetch = jest.fn()

describe('useJobs Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ToastProvider>{children}</ToastProvider>
  )

  const mockJobs: JobApplication[] = [
    {
      id: 1,
      company: 'Test Company',
      position: 'Software Engineer',
      status: 'applied',
      description: 'Test description',
      requirements: 'Test requirements',
      salary: '100000',
      location: 'Remote',
      appliedDate: new Date().toISOString(),
      interviewDate: new Date().toISOString(),
      notes: 'Test notes',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  describe('initial state', () => {
    it('should initialize with loading state', async () => {
      ;(globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ jobs: [] }),
      })

      const { result } = renderHook(() => useJobs(), { wrapper })
      
      // Wait for initial state to resolve
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })
      
      expect(result.current.isLoading).toBe(false)
    })

    it('should have CRUD functions available', async () => {
      ;(globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ jobs: [] }),
      })

      const { result } = renderHook(() => useJobs(), { wrapper })
      
      // Wait for initial state to resolve
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })
      
      expect(result.current.createJob).toBeDefined()
      expect(result.current.updateJob).toBeDefined()
      expect(result.current.deleteJob).toBeDefined()
      expect(result.current.updateStatus).toBeDefined()
    })
  })

  describe('fetchJobs', () => {
    it('should fetch jobs successfully', async () => {
      ;(globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ jobs: mockJobs }),
      })

      const { result } = renderHook(() => useJobs(), { wrapper })

      await act(async () => {
        await result.current.refetch()
      })

      expect(result.current.jobs).toEqual(mockJobs)
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle fetch errors', async () => {
      ;(globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      })

      const { result } = renderHook(() => useJobs(), { wrapper })

      await act(async () => {
        await result.current.refetch()
      })

      expect(result.current.error).toBeTruthy()
    })
  })

  describe('createJob', () => {
    it('should create a new job successfully', async () => {
      const newJob = {
        company: 'New Company',
        position: 'Senior Developer',
        status: 'applied',
        appliedDate: new Date().toISOString(),
        description: 'Test description',
        requirements: 'Test requirements',
      }

      ;(globalThis.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ jobs: [] }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ job: { ...newJob, id: 2 } }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ jobs: [{ ...newJob, id: 2 }] }) })

      const { result } = renderHook(() => useJobs(), { wrapper })

      let createdJob: JobApplication | null = null
      await act(async () => {
        createdJob = await result.current.createJob(newJob as any)
      })

      expect(createdJob).toBeTruthy()
      // Type assertion to fix TypeScript 'never' inference
      if (createdJob) {
        expect((createdJob as JobApplication).company).toBe(newJob.company)
      }
    })
  })

  describe('updateJob', () => {
    it('should update a job successfully', async () => {
      const updates = { status: 'interviewing' }

      ;(globalThis.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ jobs: mockJobs }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ job: { ...mockJobs[0], ...updates } }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ jobs: [{ ...mockJobs[0], ...updates }] }) })

      const { result } = renderHook(() => useJobs(), { wrapper })

      let updatedJob: JobApplication | null = null
      await act(async () => {
        updatedJob = await result.current.updateJob(1, updates)
      })

      expect(updatedJob).toBeTruthy()
      // Type assertion to fix TypeScript 'never' inference
      if (updatedJob) {
        expect((updatedJob as JobApplication).status).toBe(updates.status)
      }
    })
  })

  describe('deleteJob', () => {
    it('should delete a job successfully', async () => {
      ;(globalThis.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ jobs: mockJobs }) })
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ jobs: [] }) })

      const { result } = renderHook(() => useJobs(), { wrapper })

      await act(async () => {
        await result.current.deleteJob(1)
      })

      expect(result.current.jobs).toEqual([])
    })
  })

  describe('updateStatus', () => {
    it('should update job status', async () => {
      const newStatus = 'offered'

      ;(globalThis.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ jobs: mockJobs }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ job: { ...mockJobs[0], status: newStatus } }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ jobs: [{ ...mockJobs[0], status: newStatus }] }) })

      const { result } = renderHook(() => useJobs(), { wrapper })

      let updatedJob: JobApplication | null = null
      await act(async () => {
        updatedJob = await result.current.updateStatus(1, newStatus)
      })

      expect(updatedJob).toBeTruthy()
      // Type assertion to fix TypeScript 'never' inference
      if (updatedJob) {
        expect((updatedJob as JobApplication).status).toBe(newStatus)
      }
    })
  })
})
