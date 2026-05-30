import '@testing-library/jest-dom'

// Polyfill for Web Request API
class Request {
  constructor(url, options = {}) {
    this.url = url
    this.method = options.method || 'GET'
    this.headers = new Headers(options.headers)
    this.body = options.body
  }

  async json() {
    return JSON.parse(this.body)
  }

  async text() {
    return this.body
  }
}

globalThis.Request = Request

class Response {
  constructor(body, init = {}) {
    this.body = body
    this.status = init.status || 200
    this.statusText = init.statusText || 'OK'
    this.headers = new Headers(init.headers)
  }

  async json() {
    return typeof this.body === 'string' ? JSON.parse(this.body) : this.body
  }
}

globalThis.Response = Response

class Headers {
  constructor(init = {}) {
    this.headers = {}
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.headers[key.toLowerCase()] = value
      })
    }
  }

  get(key) {
    return this.headers[key.toLowerCase()]
  }

  set(key, value) {
    this.headers[key.toLowerCase()] = value
  }

  has(key) {
    return key.toLowerCase() in this.headers
  }
}

globalThis.Headers = Headers

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />,
}))

// Mock Next.js Response
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body, init = {}) => ({
      status: init.status || 200,
      json: async () => body,
      body: body,
    }),
  },
  Request: globalThis.Request,
}))

// Mock Prisma client
jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    jobApplication: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}))

// Global test utilities
globalThis.beforeEach(() => {
  jest.clearAllMocks()
})
