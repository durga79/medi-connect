import { getSession } from '@/lib/utils/session'
import { prescriptionService } from '@/lib/services/prescription.service'
import { Card, CardContent } from '@/components/ui/card'
import { Pill, User, Calendar } from 'lucide-react'

export default async function PatientPrescriptionsPage() {
  const session = await getSession()
  if (!session) return null

  const prescriptions = await prescriptionService.getPrescriptionsByPatient(session.profileId)

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Prescriptions</h1>
        <p className="mt-2 text-gray-600">View your current and past prescriptions</p>
      </div>

      <div className="grid gap-4">
        {prescriptions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-500 text-center py-8">No prescriptions found</p>
            </CardContent>
          </Card>
        ) : (
          prescriptions.map((prescription) => (
            <Card key={prescription.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Pill className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {prescription.medication}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User className="h-4 w-4" />
                          <span>Prescribed by Dr. {prescription.doctor.firstName} {prescription.doctor.lastName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(prescription.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 space-y-3 border border-indigo-100">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-indigo-900">Dosage:</span>
                          <p className="text-indigo-800 font-semibold">{prescription.dosage}</p>
                        </div>
                        <div>
                          <span className="font-medium text-indigo-900">Frequency:</span>
                          <p className="text-indigo-800 font-semibold">{prescription.frequency}</p>
                        </div>
                        <div>
                          <span className="font-medium text-indigo-900">Duration:</span>
                          <p className="text-indigo-800 font-semibold">{prescription.duration}</p>
                        </div>
                      </div>

                      {prescription.instructions && (
                        <div className="pt-3 border-t border-indigo-200">
                          <span className="text-sm font-medium text-indigo-900">Instructions:</span>
                          <p className="mt-1 text-sm text-indigo-800">{prescription.instructions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

