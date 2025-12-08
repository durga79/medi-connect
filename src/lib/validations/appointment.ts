import { z } from 'zod'
import { AppointmentStatus } from '@prisma/client'

export const createAppointmentSchema = z.object({
  doctorId: z.string().uuid('Invalid doctor ID'),
  appointmentDate: z.string().min(1, 'Appointment date is required'),
  appointmentTime: z.string().min(1, 'Appointment time is required'),
  reason: z.string().min(1, 'Reason for appointment is required'),
  notes: z.string().optional(),
})

export const updateAppointmentSchema = z.object({
  appointmentDate: z.string().optional(),
  appointmentTime: z.string().optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
})

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>

