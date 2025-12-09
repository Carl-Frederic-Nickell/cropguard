import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ farmId: string }> }
) {
  try {
    const { farmId } = await params

    // First delete all crops of the farm
    await prisma.crop.deleteMany({
      where: { farmId }
    })

    // Then delete the farm itself
    await prisma.farm.delete({
      where: { id: farmId }
    })

    return NextResponse.json({ success: true, message: 'Farm successfully deleted' })
  } catch (error) {
    console.error('Error deleting farm:', error)
    return NextResponse.json(
      { error: 'Failed to delete farm' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ farmId: string }> }
) {
  try {
    const { farmId } = await params

    const farm = await prisma.farm.findUnique({
      where: { id: farmId },
      include: { crops: true }
    })

    if (!farm) {
      return NextResponse.json(
        { error: 'Farm not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(farm)
  } catch (error) {
    console.error('Error fetching farm:', error)
    return NextResponse.json(
      { error: 'Failed to fetch farm' },
      { status: 500 }
    )
  }
}