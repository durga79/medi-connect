import { generateToken, verifyToken } from '../auth'

describe('Session Management', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    role: 'PATIENT' as const,
    profileId: 'profile-123',
  }

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-key-for-testing-only'
  })

  describe('generateToken', () => {
    it('should create a valid JWT token', () => {
      const token = generateToken(mockUser)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.').length).toBe(3)
    })

    it('should create different tokens for different users', () => {
      const user1Token = generateToken(mockUser)
      const user2Token = generateToken({
        ...mockUser,
        id: '456',
        email: 'user2@example.com',
      })
      
      expect(user1Token).not.toBe(user2Token)
    })

    it('should handle DOCTOR role', () => {
      const doctorUser = { ...mockUser, role: 'DOCTOR' as const }
      const token = generateToken(doctorUser)
      
      expect(token).toBeDefined()
    })
  })

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const token = generateToken(mockUser)
      const decoded = verifyToken(token)
      
      expect(decoded).toBeDefined()
      expect(decoded?.id).toBe(mockUser.id)
      expect(decoded?.email).toBe(mockUser.email)
      expect(decoded?.role).toBe(mockUser.role)
      expect(decoded?.profileId).toBe(mockUser.profileId)
    })

    it('should reject invalid token', () => {
      const result = verifyToken('invalid.token.here')
      
      expect(result).toBeNull()
    })

    it('should reject empty token', () => {
      const result = verifyToken('')
      
      expect(result).toBeNull()
    })

    it('should reject tampered token', () => {
      const token = generateToken(mockUser)
      const tamperedToken = token.slice(0, -5) + 'xxxxx'
      const result = verifyToken(tamperedToken)
      
      expect(result).toBeNull()
    })
  })

  describe('Token expiration', () => {
    it('should create token with expiration', () => {
      const token = generateToken(mockUser)
      const decoded = verifyToken(token)
      
      expect(decoded).toBeDefined()
      expect(decoded?.id).toBe(mockUser.id)
    })
  })
})

