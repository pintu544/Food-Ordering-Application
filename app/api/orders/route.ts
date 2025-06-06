import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { hasPermission } from '@/lib/permissions'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
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
    const orders = await prisma.order.findMany({
      where: user.role === 'ADMIN' 
        ? {} 
        : user.role === 'MANAGER' 
        ? { country: user.country }
        : { userId: user.id },
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        },
        user: true
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = {
    id: session.user.id,
    role: session.user.role as any,
    country: session.user.country as any
  }

  if (!hasPermission(user, 'createOrder')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { items, totalAmount } = body

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount,
        country: user.country,
        status: 'PENDING',
        orderItems: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
