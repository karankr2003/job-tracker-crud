import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@/hooks/use-auth'
import { ToastProvider } from '@/components/providers/toast-provider'

// Mock fetch
globalThis.fetch = jest.fn()

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ToastProvider>{children}</ToastProvider>
  )

  describe('initial state', () => {
    it('should initialize with loading state', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })
      
      // Wait for initial state to resolve
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })
      
      expect(result.current.loading).toBe(false)
      expect(result.current.user).toBeNull()
    })

    it('should have authentication functions available', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })
      
      // Wait for initial state to resolve
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })
      
      expect(result.current.login).toBeDefined()
      expect(result.current.register).toBeDefined()
      expect(result.current.logout).toBeDefined()
    })
  })

  describe('login function', () => {
    it('should successfully login with valid credentials', async () => {
      const mockUser = { id: 1, email: 'kk@gmail.com', name: 'Karan Singh' }
      
      // Mock the initial auth check
      ;(globalThis.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: false, json: () => Promise.resolve({}) }) // Auth check - not authenticated
        .mockResolvedValueOnce({ // Login call
          ok: true,
          status: 200,
          json: () => Promise.resolve({ user: mockUser }),
        })

      const { result } = renderHook(() => useAuth(), { wrapper })

      let loginSuccess = false
      await act(async () => {
        loginSuccess = await result.current.login('kk@gmail.com', 'Karan@123')
      })

      expect(loginSuccess).toBe(true)
      expect(result.current.user).toEqual(mockUser)
    })

    it('should handle login failure', async () => {
      // Mock the initial auth check
      ;(globalThis.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: false, json: () => Promise.resolve({}) }) // Auth check - not authenticated
        .mockResolvedValueOnce({ // Login call - fail
          ok: false,
          status: 401,
          json: () => Promise.resolve({ error: 'Invalid credentials' }),
        })

      const { result } = renderHook(() => useAuth(), { wrapper })

      let loginSuccess = false
      await act(async () => {
        loginSuccess = await result.current.login('kk@gmail.com', 'wrongpassword')
      })

      expect(loginSuccess).toBe(false)
    })
  })

  describe('register function', () => {
    it('should successfully register new user', async () => {
      const mockUser = { id: 1, email: 'kk@gmail.com', name: 'Karan Singh' }
      
      // Mock the initial auth check
      ;(globalThis.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: false, json: () => Promise.resolve({}) }) // Auth check - not authenticated
        .mockResolvedValueOnce({ // Register call
          ok: true,
          status: 200,
          json: () => Promise.resolve({ user: mockUser }),
        })

      const { result } = renderHook(() => useAuth(), { wrapper })

      let registerSuccess = false
      await act(async () => {
        registerSuccess = await result.current.register('kk@gmail.com', 'Karan Singh', 'Karan@123')
      })

      expect(registerSuccess).toBe(true)
      expect(result.current.user).toEqual(mockUser)
    })
  })

  describe('logout function', () => {
    it('should successfully logout', async () => {
      ;(globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.logout()
      })

      expect(globalThis.fetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST',
      })
    })
  })
})
