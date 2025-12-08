import { prisma } from '@/lib/prisma'
import { CreateAppointmentInput, UpdateAppointmentInput } from '@/lib/validations/appointment'
import { Role } from '@prisma/client'

export class AppointmentService {
  async createAppointment(patientId: string, data: CreateAppointmentInput) {
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId: data.doctorId,
        appointmentDate: new Date(data.appointmentDate),
        appointmentTime: data.appointmentTime,
        reason: data.reason,
        notes: data.notes,
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
      },
    })

    return appointment
  }

  async getAppointmentsByPatient(patientId: string) {
    const appointments = await prisma.appointment.findMany({
      where: { patientId },
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
            department: true,
          },
        },
      },
      orderBy: {
        appointmentDate: 'desc',
      },
    })

    return appointments
  }

  async getAppointmentsByDoctor(doctorId: string) {
    const appointments = await prisma.appointment.findMany({
      where: { doctorId },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            phone: true,
          },
        },
      },
      orderBy: {
        appointmentDate: 'desc',
      },
    })

    return appointments
  }

  async getAppointmentById(appointmentId: string, userId: string, userRole: Role) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
        doctor: true,
      },
    })

    if (!appointment) {
      throw new Error('Appointment not found')
    }

    if (userRole === Role.PATIENT && appointment.patientId !== userId) {
      throw new Error('Unauthorized access')
    }

    if (userRole === Role.DOCTOR && appointment.doctorId !== userId) {
      throw new Error('Unauthorized access')
    }

    return appointment
  }

  async updateAppointment(
    appointmentId: string,
    userId: string,
    userRole: Role,
    data: UpdateAppointmentInput
  ) {
    const appointment = await this.getAppointmentById(appointmentId, userId, userRole)

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        ...(data.appointmentDate && { appointmentDate: new Date(data.appointmentDate) }),
        ...(data.appointmentTime && { appointmentTime: data.appointmentTime }),
        ...(data.status && { status: data.status }),
        ...(data.reason && { reason: data.reason }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
      },
    })

    return updated
  }

  async deleteAppointment(appointmentId: string, userId: string, userRole: Role) {
    await this.getAppointmentById(appointmentId, userId, userRole)

    await prisma.appointment.delete({
      where: { id: appointmentId },
    })

    return { success: true }
  }

  async getDoctors() {
    const doctors = await prisma.doctor.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        specialization: true,
        department: true,
      },
    })

    return doctors
  }
}

export const appointmentService = new AppointmentService()

