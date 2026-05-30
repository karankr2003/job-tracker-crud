import '@testing-library/jest-dom'

// Add type declarations for Jest matchers
declare namespace jest {
  interface Matchers<R> {
    toBeInTheDocument(): R
    toBeDisabled(): R
    toHaveClass(...classNames: string[]): R
    toHaveAttribute(attr: string, value?: string): R
    toHaveTextContent(text: string | RegExp): R
    toBeVisible(): R
    toBeEmpty(): R
    toContainElement(element: HTMLElement): R
    toContainHTML(html: string): R
  }
}

declare global {
  namespace NodeJS {
    interface Global {
      fetch: jest.MockedFunction<typeof fetch>
    }
  }
}
