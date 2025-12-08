import { getSession } from '@/lib/utils/session'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { User, Mail, Phone, Calendar, FileText } from 'lucide-react'

export default async function DoctorPatientsPage() {
  const session = await getSession()
  if (!session) return null

  const patients = await prisma.patient.findMany({
    include: {
      user: {
        select: {
          email: true,
        },
      },
      _count: {
        select: {
          appointments: true,
          medicalRecords: true,
          prescriptions: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
        <p className="mt-2 text-gray-600">View all registered patients</p>
      </div>

      <div className="grid gap-4">
        {patients.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-500 text-center py-8">No patients found</p>
            </CardContent>
          </Card>
        ) : (
          patients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Patient ID: {patient.id.substring(0, 8)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{patient.user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                      {patient.bloodGroup && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span>Blood Group: {patient.bloodGroup}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-gray-500">Appointments:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {patient._count.appointments}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Medical Records:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {patient._count.medicalRecords}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Prescriptions:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {patient._count.prescriptions}
                          </span>
                        </div>
                      </div>
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

