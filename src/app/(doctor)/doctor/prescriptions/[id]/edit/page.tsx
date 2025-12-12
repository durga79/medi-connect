'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Pill, ArrowLeft, Upload, X, Download, FileText } from 'lucide-react'
import Link from 'next/link'

export default function EditPrescriptionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
  })
  const [patientName, setPatientName] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchPrescription()
  }, [])

  const fetchPrescription = async () => {
    try {
      const response = await fetch(`/api/prescriptions/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setFormData({
          medication: data.data.medication,
          dosage: data.data.dosage,
          frequency: data.data.frequency,
          duration: data.data.duration,
          instructions: data.data.instructions || '',
        })
        setPatientName(`${data.data.patient.firstName} ${data.data.patient.lastName}`)
        
        // Load existing file if present
        if (data.data.fileUrl) {
          setExistingFileUrl(data.data.fileUrl)
        }
      } else {
        setError(data.error || 'Failed to fetch prescription')
      }
    } catch (err) {
      setError('Failed to load prescription')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`/api/prescriptions/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Failed to update prescription')
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  const handleDeleteExistingFile = () => {
    setExistingFileUrl(null)
  }

  if (fetchLoading) {
    return (
      <div className="px-4 py-6 sm:px-0 max-w-3xl mx-auto">
        <p className="text-center text-gray-600">Loading...</p>
      </div>
    )
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Edit Prescription</h1>
        <p className="mt-2 text-gray-600">Update medication details</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Pill className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>Prescription for {patientName}</CardTitle>
              <CardDescription>Update medication information</CardDescription>
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
              <Label htmlFor="medication">Medication Name *</Label>
              <Input
                id="medication"
                name="medication"
                type="text"
                required
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
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Four times daily">Four times daily</option>
                  <option value="Every 4 hours">Every 4 hours</option>
                  <option value="Every 6 hours">Every 6 hours</option>
                  <option value="Every 8 hours">Every 8 hours</option>
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
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 resize-none"
              />
            </div>

            {/* Existing File Section */}
            {existingFileUrl && (
              <div className="space-y-2">
                <Label>Current Prescription Document</Label>
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-900">Prescription Document</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={existingFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-indigo-100 rounded-md transition-colors"
                    >
                      <Download className="h-4 w-4 text-indigo-600" />
                    </a>
                    <button
                      type="button"
                      onClick={handleDeleteExistingFile}
                      className="p-2 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Upload New File Section */}
            <div className="space-y-2">
              <Label>{existingFileUrl ? 'Replace with New File (Optional)' : 'Upload Prescription Document (Optional)'}</Label>
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
                        <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 5MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
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
                  Remove New File
                </Button>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Note: File upload will be simulated. In production, files would be uploaded to cloud storage.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Prescription'}
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
    </div>
  )
}


