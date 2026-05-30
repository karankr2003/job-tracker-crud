import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthPayload } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthPayload()

    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: idParam } = await params
    const id = Number.parseInt(idParam)

    const job = await db.jobApplication.findFirst({
      where: {
        id,
        userId: auth.userId,
      },
    })

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ job })
  } catch (error) {
    console.error('Get job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthPayload()

    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: idParam } = await params
    const id = Number.parseInt(idParam)
    const body = await request.json()

    // Verify the job belongs to the user
    const existingJob = await db.jobApplication.findFirst({
      where: {
        id,
        userId: auth.userId,
      },
    })

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    const job = await db.jobApplication.update({
      where: { id },
      data: {
        ...body,
        appliedDate: body.appliedDate ? new Date(body.appliedDate) : undefined,
        interviewDate: body.interviewDate ? new Date(body.interviewDate) : null,
      },
    })

    return NextResponse.json({ job })
  } catch (error) {
    console.error('Update job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthPayload()

    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: idParam } = await params
    const id = Number.parseInt(idParam)

    // Verify the job belongs to the user
    const existingJob = await db.jobApplication.findFirst({
      where: {
        id,
        userId: auth.userId,
      },
    })

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    await db.jobApplication.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
