import { generateToken, verifyToken } from '@/lib/auth'

describe('Authentication Utilities', () => {
  const mockSecret = 'a-very-secure-test-secret-key-that-is-long-enough'

  beforeAll(() => {
    process.env.JWT_SECRET = mockSecret
  })

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload = { userId: 1, email: 'test@example.com' }
      const token = generateToken(payload)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
    })

    it('should include the payload in the token', () => {
      const payload = { userId: 1, email: 'test@example.com' }
      const token = generateToken(payload)
      
      const decoded = verifyToken(token)
      expect(decoded?.userId).toBe(payload.userId)
      expect(decoded?.email).toBe(payload.email)
    })
  })

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload = { userId: 1, email: 'test@example.com' }
      const token = generateToken(payload)
      
      const decoded = verifyToken(token)
      expect(decoded).not.toBeNull()
      expect(decoded?.userId).toBe(payload.userId)
      expect(decoded?.email).toBe(payload.email)
    })

    it('should return null for invalid token', () => {
      const invalidToken = 'invalid.token.here'
      
      const result = verifyToken(invalidToken)
      expect(result).toBeNull()
    })

    it('should return null for expired token', () => {
      const jwt = require('jsonwebtoken')
      const expiredToken = jwt.sign(
        { userId: 1, email: 'test@example.com' }, 
        mockSecret, 
        { expiresIn: '-1h' }
      )
      
      const result = verifyToken(expiredToken)
      expect(result).toBeNull()
    })
  })
})
