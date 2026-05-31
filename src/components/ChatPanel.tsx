'use client'

import { useState, useRef, useEffect } from 'react'
import { Quote } from '@/types/quote'
import { Message, ChatRole } from '@/types/chat'

interface ChatPanelProps {
  isOpen: boolean
  currentQuote: Quote | null
  onClose: () => void
}

export default function ChatPanel({ isOpen, currentQuote, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      // Small delay so the panel slide-in animation starts before focus
      const t = setTimeout(() => inputRef.current?.focus(), 350)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = inputValue.trim()
    if (!text || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user' as ChatRole,
      content: text,
    }

    const assistantId = crypto.randomUUID()

    // Capture messages to send before state updates
    const apiMessages = [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))

    setMessages(prev => [
      ...prev,
      userMessage,
      { id: assistantId, role: 'assistant' as ChatRole, content: '', isStreaming: true },
    ])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, currentQuote }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        setMessages(prev => {
          const last = prev[prev.length - 1]
          if (last?.id !== assistantId) return prev
          return [...prev.slice(0, -1), { ...last, content: last.content + chunk }]
        })
      }

      setMessages(prev => {
        const last = prev[prev.length - 1]
        if (last?.id !== assistantId) return prev
        return [...prev.slice(0, -1), { ...last, isStreaming: false }]
      })
    } catch {
      setMessages(prev => {
        const last = prev[prev.length - 1]
        if (last?.id !== assistantId) return prev
        return [
          ...prev.slice(0, -1),
          {
            ...last,
            content: last.content || 'Sorry, something went wrong. Please try again.',
            isStreaming: false,
          },
        ]
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Semi-transparent backdrop — mobile only, tap to close */}
      <div
        className={`chat-backdrop ${isOpen ? 'chat-backdrop--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`chat-panel ${isOpen ? 'chat-panel--open' : ''}`}
        aria-hidden={!isOpen}
        role="dialog"
        aria-label="Stoic Tutor"
        aria-modal="true"
      >
        {/* Header */}
        <div className="chat-header">
          <div>
            <h2 className="chat-title">Stoic Tutor</h2>
            <p className="chat-subtitle">Ask about the quote or Stoicism</p>
          </div>
          <button onClick={onClose} className="chat-close-btn" aria-label="Close chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message list */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-empty-state">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, marginBottom: '0.75rem' }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p>Ask me about Stoic philosophy,<br />or about the quote above.</p>
            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                className={
                  msg.role === 'user'
                    ? 'chat-message-user'
                    : `chat-message-assistant${msg.isStreaming ? ' chat-message-streaming' : ''}`
                }
              >
                {msg.content}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSend} className="chat-input-area">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Ask about Stoicism..."
            className="chat-input"
            disabled={isLoading}
            aria-label="Chat message"
          />
          <button
            type="submit"
            className={`chat-send-btn${isLoading ? ' chat-send-btn--loading' : ''}`}
            disabled={isLoading || !inputValue.trim()}
            aria-label="Send message"
          >
            {isLoading ? (
              <svg className="chat-spinner-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </>
  )
}
