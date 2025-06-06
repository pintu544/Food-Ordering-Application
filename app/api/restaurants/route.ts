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

  if (!hasPermission(user, 'viewRestaurants')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const restaurants = await prisma.restaurant.findMany({
      where: hasPermission(user, 'accessCountryData', user.country) 
        ? (user.role === 'ADMIN' ? {} : { country: user.country })
        : { country: user.country },
      include: {
        menuItems: true
      }
    })

    return NextResponse.json(restaurants)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
