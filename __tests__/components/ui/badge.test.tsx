import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge Component', () => {
  it('should render badge with text', () => {
    render(<Badge>Test Badge</Badge>)
    const badge = screen.getByText('Test Badge')
    expect(badge).toBeInTheDocument()
  })

  it('should render with custom className', () => {
    render(<Badge className="custom-class">Test Badge</Badge>)
    const badge = screen.getByText('Test Badge')
    expect(badge).toHaveClass('custom-class')
  })

  it('should render different badge variants', () => {
    const { rerender } = render(<Badge>Default</Badge>)
    expect(screen.getByText('Default')).toBeInTheDocument()

    rerender(<Badge className="bg-green-100 text-green-800">Success</Badge>)
    expect(screen.getByText('Success')).toBeInTheDocument()
  })
})
