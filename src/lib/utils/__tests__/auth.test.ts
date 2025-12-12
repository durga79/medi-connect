import { hashPassword, verifyPassword } from '../auth'

describe('Authentication Utils', () => {
  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const password = 'SecurePassword123!'
      const hash = await hashPassword(password)
      
      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(0)
    })

    it('should create different hashes for the same password', async () => {
      const password = 'SecurePassword123!'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)
      
      expect(hash1).not.toBe(hash2)
    })

    it('should handle special characters in password', async () => {
      const password = 'P@ssw0rd!#$%^&*()'
      const hash = await hashPassword(password)
      
      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
    })
  })

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'SecurePassword123!'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword(password, hash)
      
      expect(isValid).toBe(true)
    })

    it('should reject incorrect password', async () => {
      const password = 'SecurePassword123!'
      const wrongPassword = 'WrongPassword456!'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword(wrongPassword, hash)
      
      expect(isValid).toBe(false)
    })

    it('should reject empty password', async () => {
      const password = 'SecurePassword123!'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword('', hash)
      
      expect(isValid).toBe(false)
    })

    it('should handle case sensitivity', async () => {
      const password = 'SecurePassword123!'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword('securepassword123!', hash)
      
      expect(isValid).toBe(false)
    })
  })
})


