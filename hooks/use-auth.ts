import { useEffect, useState, useCallback } from 'react'
import { useToast } from '@/components/providers/toast-provider'

interface User {
  id: number
  email: string
  name: string
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })
  const { success, error: toastError } = useToast()

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setState({ user: data.user, loading: false, error: null })
        } else {
          setState({ user: null, loading: false, error: null })
        }
      } catch (error) {
        setState({ user: null, loading: false, error: 'Failed to check auth' })
      }
    }

    checkAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        setState((prev) => ({
          ...prev,
          loading: false,
          error: data.error || 'Login failed',
        }))
        toastError(data.error || 'Login failed')
        return false
      }

      const data = await response.json()
      setState({ user: data.user, loading: false, error: null })
      success('Login successful!')
      return true
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'An error occurred',
      }))
      toastError('An error occurred during login')
      return false
    }
  }, [success, toastError])

  const register = useCallback(async (email: string, name: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        setState((prev) => ({
          ...prev,
          loading: false,
          error: data.error || 'Registration failed',
        }))
        toastError(data.error || 'Registration failed')
        return false
      }

      const data = await response.json()
      setState({ user: data.user, loading: false, error: null })
      success('Registration successful!')
      return true
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'An error occurred',
      }))
      toastError('An error occurred during registration')
      return false
    }
  }, [success, toastError])

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }))
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setState({ user: null, loading: false, error: null })
      success('Logged out successfully')
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Logout failed',
      }))
      toastError('Logout failed')
    }
  }, [success, toastError])

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    isAuthenticated: !!state.user,
  }
}
