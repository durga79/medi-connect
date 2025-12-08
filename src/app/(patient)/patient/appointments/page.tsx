import { getSession } from '@/lib/utils/session'
import { appointmentService } from '@/lib/services/appointment.service'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, User, Stethoscope } from 'lucide-react'

export default async function PatientAppointmentsPage() {
  const session = await getSession()
  if (!session) return null

  const appointments = await appointmentService.getAppointmentsByPatient(session.profileId)

  const upcoming = appointments.filter(apt => new Date(apt.appointmentDate) >= new Date())
  const past = appointments.filter(apt => new Date(apt.appointmentDate) < new Date())

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="mt-2 text-gray-600">View and manage your appointments</p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Upcoming Appointments ({upcoming.length})
          </h2>
          
          {upcoming.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {upcoming.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Stethoscope className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                            </h3>
                            <p className="text-sm text-gray-500">{appointment.doctor.specialization}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600 ml-15">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">{new Date(appointment.appointmentDate).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.appointmentTime}</span>
                          </div>
                          <div className="mt-3">
                            <span className="font-medium text-gray-700">Reason:</span>
                            <p className="mt-1 text-gray-600">{appointment.reason}</p>
                          </div>
                          {appointment.notes && (
                            <div className="mt-2">
                              <span className="font-medium text-gray-700">Notes:</span>
                              <p className="mt-1 text-gray-600">{appointment.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'SCHEDULED' 
                            ? 'bg-blue-100 text-blue-800'
                            : appointment.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Past Appointments ({past.length})
          </h2>
          
          {past.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-500 text-center py-8">No past appointments</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {past.slice(0, 10).map((appointment) => (
                <Card key={appointment.id} className="opacity-75">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">{appointment.doctor.specialization}</p>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                            <Clock className="h-4 w-4 ml-2" />
                            <span>{appointment.appointmentTime}</span>
                          </div>
                          <div>
                            <span className="font-medium">Reason:</span> {appointment.reason}
                          </div>
                        </div>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

