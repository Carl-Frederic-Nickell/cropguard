import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5002'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { farmId: string } }
) {
  try {
    const { farmId } = params

    const response = await fetch(`${BACKEND_URL}/api/farms/${farmId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Delete farm API error:', error)
    return NextResponse.json(
      { error: 'Failed to delete farm' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { farmId: string } }
) {
  try {
    const { farmId } = params

    const response = await fetch(`${BACKEND_URL}/api/farms/${farmId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Get farm API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch farm data' },
      { status: 500 }
    )
  }
}