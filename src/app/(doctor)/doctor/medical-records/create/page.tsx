'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FileText, ArrowLeft, User, Upload, X } from 'lucide-react'
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

export default function CreateMedicalRecordPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    patientId: '',
    diagnosis: '',
    symptoms: '',
    notes: '',
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
      console.log('Submitting form...')
      console.log('Uploaded file:', uploadedFile)
      
      // Always use FormData to support file uploads
      const submitFormData = new FormData()
      submitFormData.append('patientId', formData.patientId)
      submitFormData.append('diagnosis', formData.diagnosis)
      submitFormData.append('symptoms', formData.symptoms)
      
      if (formData.notes) {
        submitFormData.append('notes', formData.notes)
      }
      
      // Add file if present
      if (uploadedFile) {
        console.log('Adding file to FormData:', uploadedFile.name)
        submitFormData.append('file', uploadedFile)
      }

      console.log('Sending request...')
      const response = await fetch('/api/medical-records', {
        method: 'POST',
        body: submitFormData,
      })

      const data = await response.json()
      console.log('Response:', data)

      if (!data.success) {
        setError(data.error || 'Failed to create medical record')
        setLoading(false)
        return
      }

      router.push('/doctor/medical-records')
      router.refresh()
    } catch (err) {
      console.error('Error:', err)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  const selectedPatient = patients.find(p => p.id === formData.patientId)

  return (
    <div className="px-4 py-6 sm:px-0 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/doctor/medical-records"
          className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-500 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Medical Records
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create Medical Record</h1>
        <p className="mt-2 text-gray-600">Document patient diagnosis and treatment</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle>Medical Record Details</CardTitle>
              <CardDescription>Fill in the patient's medical information</CardDescription>
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
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Input
                id="diagnosis"
                name="diagnosis"
                type="text"
                required
                placeholder="e.g., Hypertension, Common Cold, Diabetes Type 2"
                value={formData.diagnosis}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500">Primary diagnosis or condition</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms *</Label>
              <textarea
                id="symptoms"
                name="symptoms"
                required
                rows={4}
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="Describe the patient's symptoms in detail..."
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Treatment Notes & Recommendations</Label>
              <textarea
                id="notes"
                name="notes"
                rows={5}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Treatment plan, recommendations, follow-up instructions..."
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 resize-none"
              />
            </div>

            {/* File Upload - INSIDE FORM */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="h-5 w-5 text-purple-600" />
                <Label>Upload Test Results / Reports (Optional)</Label>
              </div>
              <p className="text-sm text-gray-500 mb-3">Upload lab reports, X-rays, or other medical documents</p>
              
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploadedFile ? (
                      <>
                        <FileText className="w-10 h-10 mb-3 text-green-600" />
                        <p className="mb-2 text-sm text-gray-700">
                          <span className="font-semibold">{uploadedFile.name}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG, DICOM (MAX. 10MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.dicom"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {uploadedFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setUploadedFile(null)}
                  className="w-full text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove File
                </Button>
              )}
            </div>

            {/* Submit - INSIDE FORM */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Medical Record'}
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

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">💡 After creating this record:</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>You can create prescriptions for this patient</li>
          <li>The patient will be able to view this record</li>
          <li>This record becomes part of the patient's medical history</li>
        </ul>
      </div>
    </div>
  )
}

