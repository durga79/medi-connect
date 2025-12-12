import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/utils/session'
import { appointmentService } from '@/lib/services/appointment.service'
import { updateAppointmentSchema } from '@/lib/validations/appointment'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const appointment = await appointmentService.getAppointmentById(
      params.id,
      session.profileId,
      session.role
    )

    return NextResponse.json({
      success: true,
      data: appointment,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch appointment' },
      { status: 400 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateAppointmentSchema.parse(body)
    
    const appointment = await appointmentService.updateAppointment(
      params.id,
      session.profileId,
      session.role,
      validatedData
    )

    return NextResponse.json({
      success: true,
      data: appointment,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update appointment' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    await appointmentService.deleteAppointment(
      params.id,
      session.profileId,
      session.role
    )

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete appointment' },
      { status: 400 }
    )
  }
}


