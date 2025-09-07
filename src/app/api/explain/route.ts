import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, author } = await request.json()

    if (!text || !author) {
      return NextResponse.json(
        { error: 'Quote text and author are required' },
        { status: 400 }
      )
    }

    // Using Groq API
    const groqKey = process.env.GROQ_API_KEY

    if (!groqKey) {
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are a helpful assistant that explains philosophical quotes in simple, accessible language. Break down complex ideas into everyday terms that anyone can understand.

Please explain this quote by ${author} in simple terms: "${text}"`
          }
        ],
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get explanation from Groq')
    }

    const data = await response.json()
    const explanation = data.choices[0]?.message?.content

    if (!explanation) {
      throw new Error('No explanation received')
    }

    return NextResponse.json({ explanation })

  } catch (error) {
    console.error('Error explaining quote:', error)
    return NextResponse.json(
      { error: 'Failed to explain quote' },
      { status: 500 }
    )
  }
}