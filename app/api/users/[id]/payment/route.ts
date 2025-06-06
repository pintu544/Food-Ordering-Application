import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../lib/auth'
import { PrismaClient } from '@prisma/client'
import { hasPermission } from '../../../../../lib/permissions'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = {
    id: session.user.id,
    role: session.user.role as any,
    country: session.user.country as any
  }

  if (!hasPermission(user, 'updatePaymentMethod')) {
    return NextResponse.json({ error: 'Forbidden - Only admins can update payment methods' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { paymentMethod } = body

    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method is required' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { paymentMethod }
    })

    return NextResponse.json({ 
      id: updatedUser.id, 
      name: updatedUser.name, 
      paymentMethod: updatedUser.paymentMethod 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
