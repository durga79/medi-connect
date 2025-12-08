import { getSession } from '@/lib/utils/session'
import { medicalRecordService } from '@/lib/services/medical-record.service'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, User, Calendar } from 'lucide-react'

export default async function PatientMedicalRecordsPage() {
  const session = await getSession()
  if (!session) return null

  const records = await medicalRecordService.getMedicalRecordsByPatient(session.profileId)

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
        <p className="mt-2 text-gray-600">View your medical history</p>
      </div>

      <div className="grid gap-4">
        {records.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-500 text-center py-8">No medical records found</p>
            </CardContent>
          </Card>
        ) : (
          records.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            Dr. {record.doctor.firstName} {record.doctor.lastName}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-500">{record.doctor.specialization}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(record.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <span className="text-sm font-medium text-blue-900">Diagnosis:</span>
                        <p className="mt-1 text-blue-900 font-semibold">{record.diagnosis}</p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-700">Symptoms:</span>
                        <p className="mt-1 text-gray-600">{record.symptoms}</p>
                      </div>

                      {record.notes && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Doctor's Notes:</span>
                          <p className="mt-1 text-gray-600">{record.notes}</p>
                        </div>
                      )}

                      {record.appointment && (
                        <div className="pt-3 border-t border-gray-100 text-sm text-gray-500">
                          Related to appointment on {new Date(record.appointment.appointmentDate).toLocaleDateString()}
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

