import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/utils/session'
import { appointmentService } from '@/lib/services/appointment.service'
import { createAppointmentSchema } from '@/lib/validations/appointment'
import { Role } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    let appointments
    if (session.role === Role.PATIENT) {
      appointments = await appointmentService.getAppointmentsByPatient(session.profileId)
    } else if (session.role === Role.DOCTOR) {
      appointments = await appointmentService.getAppointmentsByDoctor(session.profileId)
    }

    return NextResponse.json({
      success: true,
      data: appointments,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch appointments' },
      { status: 400 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (session.role !== Role.PATIENT) {
      return NextResponse.json(
        { success: false, error: 'Only patients can book appointments' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createAppointmentSchema.parse(body)
    
    const appointment = await appointmentService.createAppointment(
      session.profileId,
      validatedData
    )

    return NextResponse.json({
      success: true,
      data: appointment,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create appointment' },
      { status: 400 }
    )
  }
}


