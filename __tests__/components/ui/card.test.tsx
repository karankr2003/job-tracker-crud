import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card component', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>Test Content</CardContent>
        </Card>
      )
      
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should render card with custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>)
      const cardContent = screen.getByText('Content')
      expect(cardContent).toBeInTheDocument()
      // Check if the card element has the custom className
      const cardElement = container.querySelector('.custom-class')
      expect(cardElement).toBeInTheDocument()
    })
  })

  describe('CardHeader', () => {
    it('should render card header', () => {
      render(<CardHeader>Header Content</CardHeader>)
      expect(screen.getByText('Header Content')).toBeInTheDocument()
    })
  })

  describe('CardTitle', () => {
    it('should render card title', () => {
      render(<CardTitle>Test Title</CardTitle>)
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })
  })

  describe('CardDescription', () => {
    it('should render card description', () => {
      render(<CardDescription>Test Description</CardDescription>)
      expect(screen.getByText('Test Description')).toBeInTheDocument()
    })
  })

  describe('CardContent', () => {
    it('should render card content', () => {
      render(<CardContent>Test Content</CardContent>)
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })
  })
})
