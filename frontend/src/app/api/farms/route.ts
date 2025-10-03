import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching farms...')
    const farms = await prisma.farm.findMany({
      include: { crops: true }
    })
    console.log('Found farms:', farms.length)
    return NextResponse.json(farms)
  } catch (error) {
    console.error('Error fetching farms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch farms' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, location, latitude, longitude } = await request.json()

    // Create a temporary user for testing
    let user = await prisma.user.findFirst()
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'hashedpassword',
          name: 'Test User'
        }
      })
    }

    const farm = await prisma.farm.create({
      data: {
        name,
        location,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        userId: user.id
      }
    })

    return NextResponse.json(farm, { status: 201 })
  } catch (error) {
    console.error('Error creating farm:', error)
    return NextResponse.json(
      { error: 'Failed to create farm' },
      { status: 500 }
    )
  }
}