import { NextRequest, NextResponse } from 'next/server'

const MAX_MESSAGES = 20
const MAX_MESSAGE_LENGTH = 500
const MAX_QUOTE_FIELD_LENGTH = 300

export async function POST(request: NextRequest) {
  try {
    const { messages, currentQuote } = await request.json()

    const groqKey = process.env.GROQ_API_KEY
    if (!groqKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 })
    }

    // Validate and sanitize messages — only allow user/assistant roles, cap count and length
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const sanitizedMessages = messages
      .filter((m): m is { role: string; content: string } =>
        m !== null &&
        typeof m === 'object' &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string'
      )
      .slice(-MAX_MESSAGES)
      .map(m => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }))

    // Sanitize currentQuote fields before injecting into the system prompt
    let systemPrompt = `You are a knowledgeable and thoughtful Stoic philosophy tutor. You help users understand Stoicism, the teachings of Marcus Aurelius, Epictetus, and Seneca, and how to apply Stoic principles to modern life. Keep your answers clear and accessible — avoid academic jargon unless asked. Be warm but direct.`

    if (currentQuote && typeof currentQuote.text === 'string' && typeof currentQuote.author === 'string') {
      const safeText = currentQuote.text.slice(0, MAX_QUOTE_FIELD_LENGTH)
      const safeAuthor = currentQuote.author.slice(0, MAX_QUOTE_FIELD_LENGTH)
      systemPrompt += `\n\nThe user is currently viewing this quote by ${safeAuthor}: "${safeText}". They may ask about it directly — answer as if you know exactly which quote they mean.`
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 1000,
        stream: true,
        messages: [
          { role: 'system', content: systemPrompt },
          ...sanitizedMessages,
        ],
      }),
    })

    if (!groqResponse.ok) {
      const errText = await groqResponse.text()
      console.error('Groq API error:', errText)
      return NextResponse.json({ error: 'Failed to get response from AI' }, { status: 500 })
    }

    // Parse the SSE stream from Groq and pipe only the text content to the client
    const stream = new ReadableStream({
      async start(controller) {
        const reader = groqResponse.body!.getReader()
        const decoder = new TextDecoder()
        const encoder = new TextEncoder()
        let buffer = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              controller.close()
              break
            }

            buffer += decoder.decode(value, { stream: true })

            // Split on newlines, keeping the last (possibly incomplete) line in the buffer
            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed.startsWith('data: ')) continue

              const data = trimmed.slice(6)
              if (data === '[DONE]') {
                controller.close()
                return
              }

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  controller.enqueue(encoder.encode(content))
                }
              } catch {
                // skip malformed chunks
              }
            }
          }
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Chat route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
