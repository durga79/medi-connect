'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Pill, ArrowLeft, User } from 'lucide-react'
import Link from 'next/link'

interface Patient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  bloodGroup: string | null
  user: {
    email: string
  }
}

export default function CreatePrescriptionPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    patientId: '',
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
  })

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients')
      const data = await response.json()
      
      if (data.success) {
        setPatients(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch patients:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Failed to create prescription')
        setLoading(false)
        return
      }

      router.push('/doctor/prescriptions')
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const selectedPatient = patients.find(p => p.id === formData.patientId)

  return (
    <div className="px-4 py-6 sm:px-0 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/doctor/prescriptions"
          className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-500 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Prescriptions
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create Prescription</h1>
        <p className="mt-2 text-gray-600">Prescribe medication for your patient</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Pill className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>Prescription Details</CardTitle>
              <CardDescription>Fill in the medication information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="patientId">Select Patient *</Label>
              <select
                id="patientId"
                name="patientId"
                required
                value={formData.patientId}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
              >
                <option value="">Choose a patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName} - {patient.user.email}
                  </option>
                ))}
              </select>
            </div>

            {selectedPatient && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </p>
                    <p className="text-sm text-blue-700">{selectedPatient.user.email}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-blue-600">
                      <div>DOB: {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}</div>
                      {selectedPatient.bloodGroup && <div>Blood: {selectedPatient.bloodGroup}</div>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="medication">Medication Name *</Label>
              <Input
                id="medication"
                name="medication"
                type="text"
                required
                placeholder="e.g., Amoxicillin, Ibuprofen, Metformin"
                value={formData.medication}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  name="dosage"
                  type="text"
                  required
                  placeholder="e.g., 500mg, 10ml"
                  value={formData.dosage}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <select
                  id="frequency"
                  name="frequency"
                  required
                  value={formData.frequency}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                >
                  <option value="">Select frequency</option>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Four times daily">Four times daily</option>
                  <option value="Every 4 hours">Every 4 hours</option>
                  <option value="Every 6 hours">Every 6 hours</option>
                  <option value="Every 8 hours">Every 8 hours</option>
                  <option value="Every 12 hours">Every 12 hours</option>
                  <option value="Before meals">Before meals</option>
                  <option value="After meals">After meals</option>
                  <option value="At bedtime">At bedtime</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <select
                id="duration"
                name="duration"
                required
                value={formData.duration}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
              >
                <option value="">Select duration</option>
                <option value="3 days">3 days</option>
                <option value="5 days">5 days</option>
                <option value="7 days">7 days</option>
                <option value="10 days">10 days</option>
                <option value="14 days">14 days</option>
                <option value="30 days">30 days</option>
                <option value="60 days">60 days</option>
                <option value="90 days">90 days</option>
                <option value="Ongoing">Ongoing</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Special Instructions</Label>
              <textarea
                id="instructions"
                name="instructions"
                rows={4}
                value={formData.instructions}
                onChange={handleChange}
                placeholder="e.g., Take with food, Avoid alcohol, Complete the full course..."
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Prescription'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-900 mb-2">⚠️ Important:</h3>
        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
          <li>Verify patient allergies before prescribing</li>
          <li>Check for drug interactions with current medications</li>
          <li>Patient will receive this prescription immediately</li>
          <li>Ensure dosage and instructions are accurate</li>
        </ul>
      </div>
    </div>
  )
}

