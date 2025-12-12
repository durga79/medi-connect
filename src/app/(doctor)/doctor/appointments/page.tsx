import { getSession } from '@/lib/utils/session'
import { appointmentService } from '@/lib/services/appointment.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, User } from 'lucide-react'

export default async function DoctorAppointmentsPage() {
  const session = await getSession()
  if (!session) return null

  const appointments = await appointmentService.getAppointmentsByDoctor(session.profileId)

  const upcoming = appointments.filter(apt => new Date(apt.appointmentDate) >= new Date())
  const past = appointments.filter(apt => new Date(apt.appointmentDate) < new Date())

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <p className="mt-2 text-gray-600">Manage your patient appointments</p>
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
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-5 w-5 text-indigo-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {appointment.patient.firstName} {appointment.patient.lastName}
                          </h3>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(appointment.appointmentDate).toLocaleDateString('en-US', { 
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
                          <div className="mt-2">
                            <span className="font-medium">Reason:</span> {appointment.reason}
                          </div>
                          {appointment.notes && (
                            <div className="mt-2">
                              <span className="font-medium">Notes:</span> {appointment.notes}
                            </div>
                          )}
                          <div className="mt-2">
                            <span className="font-medium">Contact:</span> {appointment.patient.phone}
                          </div>
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
                          {appointment.patient.firstName} {appointment.patient.lastName}
                        </h3>
                        
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


