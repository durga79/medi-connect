import { getSession } from '@/lib/utils/session'
import { medicalRecordService } from '@/lib/services/medical-record.service'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, User, Calendar } from 'lucide-react'

export default async function DoctorMedicalRecordsPage() {
  const session = await getSession()
  if (!session) return null

  const records = await medicalRecordService.getMedicalRecordsByDoctor(session.profileId)

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
        <p className="mt-2 text-gray-600">View all medical records you've created</p>
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
                            {record.patient.firstName} {record.patient.lastName}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
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
                      <div>
                        <span className="text-sm font-medium text-gray-700">Diagnosis:</span>
                        <p className="mt-1 text-gray-900">{record.diagnosis}</p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-700">Symptoms:</span>
                        <p className="mt-1 text-gray-600">{record.symptoms}</p>
                      </div>

                      {record.notes && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Notes:</span>
                          <p className="mt-1 text-gray-600">{record.notes}</p>
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

