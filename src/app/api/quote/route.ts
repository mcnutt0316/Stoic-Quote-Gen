import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch runs server-side, so the 307 redirect from stoic-quotes.com works fine here
    const response = await fetch('https://stoic-quotes.com/api/quote', { redirect: 'follow' })

    if (!response.ok) {
      throw new Error('Failed to fetch quote from upstream API')
    }

    const quote = await response.json()
    return NextResponse.json(quote)

  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    )
  }
}
