import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ farmId: string }> }
) {
  try {
    const { farmId } = await params
    const { name, type, plantedDate } = await request.json()

    const crop = await prisma.crop.create({
      data: {
        name,
        type,
        plantedDate: new Date(plantedDate),
        farmId
      }
    })

    return NextResponse.json(crop, { status: 201 })
  } catch (error) {
    console.error('Error adding crop:', error)
    return NextResponse.json(
      { error: 'Failed to add crop' },
      { status: 500 }
    )
  }
}