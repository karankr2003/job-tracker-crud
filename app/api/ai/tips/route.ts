import { NextRequest, NextResponse } from 'next/server'
import { getAuthPayload } from '@/lib/auth'
import { CohereClient } from 'cohere-ai'

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
    const { company, position, description, requirements } = body

    if (!company || !position) {
      return NextResponse.json(
        { error: 'Company and position are required' },
        { status: 400 }
      )
    }

    const cohereApiKey = process.env.COHERE_API_KEY
    if (!cohereApiKey) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      )
    }

    const cohere = new CohereClient({
      token: cohereApiKey,
    })

    const message = `You are an expert interview coach. Provide 3-4 concise interview preparation tips for the following job:

Company: ${company}
Position: ${position}
${description ? `Description: ${description}` : ''}
${requirements ? `Requirements: ${requirements}` : ''}

Format your response as a numbered list with brief, actionable tips. Focus on what the candidate should prepare or research.`

    const response = await cohere.chat({
      model: 'command-a-03-2025',
      message: message,
    })

    console.log('Cohere response:', JSON.stringify(response, null, 2))

    let tips = ''
    if (response.text) {
      tips = response.text
    }

    return NextResponse.json({ tips: tips.trim() })
  } catch (error) {
    console.error('Tips generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
