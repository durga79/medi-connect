import { redirect } from 'next/navigation'
import { getSession } from '@/lib/utils/session'
import { Role } from '@prisma/client'

export default async function Home() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  if (session.role === Role.PATIENT) {
    redirect('/patient/dashboard')
  } else if (session.role === Role.DOCTOR) {
    redirect('/doctor/dashboard')
  }

  redirect('/login')
}

