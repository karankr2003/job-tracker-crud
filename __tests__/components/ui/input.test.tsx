import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

describe('Input Component', () => {
  it('should render input element', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
  })

  it('should handle user input', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Test value' } })
    expect(input.value).toBe('Test value')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeDisabled()
  })

  it('should render with custom className', () => {
    render(<Input className="custom-class" placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toHaveClass('custom-class')
  })

  it('should work with label', () => {
    render(
      <>
        <Label htmlFor="test-input">Test Label</Label>
        <Input id="test-input" placeholder="Enter text" />
      </>
    )
    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('should handle different input types', () => {
    render(<Input type="email" placeholder="Email" />)
    const input = screen.getByPlaceholderText('Email')
    expect(input).toHaveAttribute('type', 'email')
  })
})
