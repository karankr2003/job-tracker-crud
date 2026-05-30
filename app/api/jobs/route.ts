import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthPayload } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthPayload()

    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const jobs = await db.jobApplication.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Get jobs error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthPayload()

    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { company, position, description, requirements, salary, location, appliedDate, interviewDate, notes, status } = body

    if (!company || !position || !appliedDate) {
      return NextResponse.json(
        { error: 'Company, position, and applied date are required' },
        { status: 400 }
      )
    }

    const job = await db.jobApplication.create({
      data: {
        company,
        position,
        description,
        requirements,
        salary,
        location,
        appliedDate: new Date(appliedDate),
        interviewDate: interviewDate ? new Date(interviewDate) : null,
        notes,
        status: status || 'applied',
        userId: auth.userId,
      },
    })

    return NextResponse.json({ job }, { status: 201 })
  } catch (error) {
    console.error('Create job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
