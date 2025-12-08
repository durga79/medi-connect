import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/utils/session'
import { medicalRecordService } from '@/lib/services/medical-record.service'
import { createMedicalRecordSchema } from '@/lib/validations/medical-record'
import { Role } from '@prisma/client'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    let records
    if (session.role === Role.PATIENT) {
      records = await medicalRecordService.getMedicalRecordsByPatient(session.profileId)
    } else if (session.role === Role.DOCTOR) {
      records = await medicalRecordService.getMedicalRecordsByDoctor(session.profileId)
    }

    return NextResponse.json({
      success: true,
      data: records,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch medical records' },
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

    if (session.role !== Role.DOCTOR) {
      return NextResponse.json(
        { success: false, error: 'Only doctors can create medical records' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createMedicalRecordSchema.parse(body)
    
    const record = await medicalRecordService.createMedicalRecord(
      session.profileId,
      validatedData
    )

    return NextResponse.json({
      success: true,
      data: record,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create medical record' },
      { status: 400 }
    )
  }
}

