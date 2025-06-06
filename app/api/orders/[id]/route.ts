import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { hasPermission } from '@/lib/permissions'

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

  try {
    const body = await request.json()
    const { status, paymentMethod } = body

    // Check if user can place order (for status updates like CONFIRMED)
    if (status === 'CONFIRMED' && !hasPermission(user, 'placeOrder')) {
      return NextResponse.json({ error: 'Forbidden - Cannot place order' }, { status: 403 })
    }

    // Get existing order to check permissions
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: { user: true }
    })

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check location-based access
    if (!hasPermission(user, 'accessCountryData', existingOrder.country)) {
      return NextResponse.json({ error: 'Forbidden - Location access denied' }, { status: 403 })
    }

    // Check if user owns the order or has manager/admin privileges
    const canModify = existingOrder.userId === user.id || 
                     user.role === 'ADMIN' || 
                     (user.role === 'MANAGER' && user.country === existingOrder.country)

    if (!canModify) {
      return NextResponse.json({ error: 'Forbidden - Cannot modify this order' }, { status: 403 })
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (paymentMethod) updateData.paymentMethod = paymentMethod

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        },
        user: true
      }
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
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

  if (!hasPermission(user, 'cancelOrder')) {
    return NextResponse.json({ error: 'Forbidden - Cannot cancel orders' }, { status: 403 })
  }

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id }
    })

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check location-based access
    if (!hasPermission(user, 'accessCountryData', existingOrder.country)) {
      return NextResponse.json({ error: 'Forbidden - Location access denied' }, { status: 403 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' }
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
