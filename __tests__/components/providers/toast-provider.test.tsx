import { render, screen, act } from '@testing-library/react'
import { useToast } from '@/components/providers/toast-provider'
import { ToastProvider } from '@/components/providers/toast-provider'

describe('Toast Provider and useToast Hook', () => {
  it('should render ToastProvider with children', () => {
    render(
      <ToastProvider>
        <div>Test Content</div>
      </ToastProvider>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should provide toast functions', () => {
    const TestComponent = () => {
      const toast = useToast()
      return (
        <button onClick={() => toast.success('Test success')}>Show Success Toast</button>
      )
    }

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    const button = screen.getByText('Show Success Toast')
    expect(button).toBeInTheDocument()
  })

  it('should show success toast when called', async () => {
    const TestComponent = () => {
      const toast = useToast()
      return (
        <button onClick={() => toast.success('Success message')}>Show Success</button>
      )
    }

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    const button = screen.getByText('Show Success')
    
    await act(async () => {
      button.click()
    })

    // Wait for toast to appear
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(screen.getByText('Success message')).toBeInTheDocument()
  })

  it('should show error toast when called', async () => {
    const TestComponent = () => {
      const toast = useToast()
      return (
        <button onClick={() => toast.error('Error message')}>Show Error</button>
      )
    }

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    const button = screen.getByText('Show Error')
    
    await act(async () => {
      button.click()
    })

    // Wait for toast to appear
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('should show info toast when called', async () => {
    const TestComponent = () => {
      const toast = useToast()
      return (
        <button onClick={() => toast.info('Info message')}>Show Info</button>
      )
    }

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    const button = screen.getByText('Show Info')
    
    await act(async () => {
      button.click()
    })

    // Wait for toast to appear
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(screen.getByText('Info message')).toBeInTheDocument()
  })

  it('should auto-dismiss toast after duration', async () => {
    const TestComponent = () => {
      const toast = useToast()
      return (
        <button onClick={() => toast.success('Auto dismiss', 100)}>Show Toast</button>
      )
    }

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    const button = screen.getByText('Show Toast')
    
    await act(async () => {
      button.click()
    })

    // Wait for toast to appear
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    expect(screen.getByText('Auto dismiss')).toBeInTheDocument()

    // Wait for toast to disappear
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200))
    })

    expect(screen.queryByText('Auto dismiss')).not.toBeInTheDocument()
  })

  it('should throw error when useToast is used outside ToastProvider', () => {
    const TestComponent = () => {
      const toast = useToast()
      return <div>{toast.success('Test')}</div>
    }

    // Suppress the expected error in console
    const consoleError = console.error
    console.error = jest.fn()

    expect(() => render(<TestComponent />)).toThrow('useToast must be used within ToastProvider')

    console.error = consoleError
  })
})
