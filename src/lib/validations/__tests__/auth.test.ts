import { loginSchema, registerPatientSchema, registerDoctorSchema } from '../auth'

describe('Authentication Validation', () => {
  describe('loginSchema', () => {
    it('should validate correct login credentials', () => {
      const validData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
      }
      
      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'notanemail',
        password: 'SecurePass123!',
      }
      
      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      }
      
      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject missing fields', () => {
      const result = loginSchema.safeParse({})
      expect(result.success).toBe(false)
    })
  })

  describe('registerPatientSchema', () => {
    it('should validate correct patient registration', () => {
      const validData = {
        email: 'patient@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        phone: '+1234567890',
        address: '123 Main St',
      }
      
      const result = registerPatientSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid date of birth', () => {
      const invalidData = {
        email: 'patient@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '',
        phone: '+1234567890',
        address: '123 Main St',
      }
      
      const result = registerPatientSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject missing required fields', () => {
      const invalidData = {
        email: 'patient@example.com',
        password: 'SecurePass123!',
      }
      
      const result = registerPatientSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('registerDoctorSchema', () => {
    it('should validate correct doctor registration', () => {
      const validData = {
        email: 'doctor@example.com',
        password: 'SecurePass123!',
        firstName: 'Jane',
        lastName: 'Smith',
        specialization: 'Cardiology',
        licenseNumber: 'MED12345',
        phone: '+1234567890',
        department: 'Cardiology Department',
      }
      
      const result = registerDoctorSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty specialization', () => {
      const invalidData = {
        email: 'doctor@example.com',
        password: 'SecurePass123!',
        firstName: 'Jane',
        lastName: 'Smith',
        specialization: '',
        licenseNumber: 'MED12345',
        phone: '+1234567890',
        department: 'Cardiology Department',
      }
      
      const result = registerDoctorSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject missing license number', () => {
      const invalidData = {
        email: 'doctor@example.com',
        password: 'SecurePass123!',
        firstName: 'Jane',
        lastName: 'Smith',
        specialization: 'Cardiology',
        phone: '+1234567890',
        department: 'Cardiology Department',
      }
      
      const result = registerDoctorSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('SQL Injection Prevention', () => {
    it('should handle SQL injection attempts in email', () => {
      const sqlInjection = {
        email: "admin'--",
        password: 'password',
      }
      
      const result = loginSchema.safeParse(sqlInjection)
      expect(result.success).toBe(false)
    })

    it('should handle malicious input in name field', () => {
      const maliciousData = {
        email: 'patient@example.com',
        password: 'SecurePass123!',
        firstName: "'; DROP TABLE users; --",
        lastName: "OR 1=1; --",
        dateOfBirth: '1990-01-01',
        phone: '+1234567890',
        address: '123 Main St',
      }
      
      const result = registerPatientSchema.safeParse(maliciousData)
      expect(result.success).toBe(true)
    })
  })
})

