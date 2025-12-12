import { POST as loginPost } from '../auth/login/route'
import { POST as registerPatientPost } from '../auth/register/patient/route'
import { POST as registerDoctorPost } from '../auth/register/doctor/route'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/utils/auth'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    patient: {
      create: jest.fn(),
    },
    doctor: {
      create: jest.fn(),
    },
  },
}))

jest.mock('@/lib/utils/auth')
jest.mock('@/lib/utils/session')

describe('Authentication API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/auth/login', () => {
    it('should reject login with invalid email format', async () => {
      const request = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'password123',
        }),
      })

      const response = await loginPost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
    })

    it('should reject login with missing password', async () => {
      const request = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      })

      const response = await loginPost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
    })

    it('should prevent SQL injection in email field', async () => {
      const request = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: "admin'--",
          password: 'password',
        }),
      })

      const response = await loginPost(request)
      expect(response.status).toBe(400)
    })
  })

  describe('POST /api/auth/register/patient', () => {
    it('should validate required patient fields', async () => {
      const request = new Request('http://localhost:3000/api/auth/register/patient', {
        method: 'POST',
        body: JSON.stringify({
          email: 'patient@example.com',
          password: 'SecurePass123!',
        }),
      })

      const response = await registerPatientPost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
    })

    it('should reject invalid date of birth', async () => {
      const request = new Request('http://localhost:3000/api/auth/register/patient', {
        method: 'POST',
        body: JSON.stringify({
          email: 'patient@example.com',
          password: 'SecurePass123!',
          name: 'John Doe',
          dateOfBirth: 'invalid-date',
          gender: 'Male',
          phone: '+1234567890',
          address: '123 Main St',
        }),
      })

      const response = await registerPatientPost(request)
      expect(response.status).toBe(400)
    })

    it('should sanitize input to prevent XSS', async () => {
      const request = new Request('http://localhost:3000/api/auth/register/patient', {
        method: 'POST',
        body: JSON.stringify({
          email: 'patient@example.com',
          password: 'SecurePass123!',
          name: '<script>alert("xss")</script>',
          dateOfBirth: '1990-01-01',
          gender: 'Male',
          phone: '+1234567890',
          address: '123 Main St',
        }),
      })

      const response = await registerPatientPost(request)
      expect(response.status).toBe(400)
    })
  })

  describe('POST /api/auth/register/doctor', () => {
    it('should validate required doctor fields', async () => {
      const request = new Request('http://localhost:3000/api/auth/register/doctor', {
        method: 'POST',
        body: JSON.stringify({
          email: 'doctor@example.com',
          password: 'SecurePass123!',
        }),
      })

      const response = await registerDoctorPost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
    })

    it('should require license number', async () => {
      const request = new Request('http://localhost:3000/api/auth/register/doctor', {
        method: 'POST',
        body: JSON.stringify({
          email: 'doctor@example.com',
          password: 'SecurePass123!',
          name: 'Dr. Jane Smith',
          specialization: 'Cardiology',
          phone: '+1234567890',
          department: 'Cardiology',
        }),
      })

      const response = await registerDoctorPost(request)
      expect(response.status).toBe(400)
    })
  })

  describe('Security Tests', () => {
    it('should prevent password enumeration attacks', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null)

      const request = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'password123',
        }),
      })

      const response = await loginPost(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid credentials')
    })

    it('should handle malformed JSON gracefully', async () => {
      const request = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: 'invalid json{',
      })

      const response = await loginPost(request)
      expect(response.status).toBeGreaterThanOrEqual(400)
    })
  })
})


