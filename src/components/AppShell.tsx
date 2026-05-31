'use client'

import { useState, useEffect } from 'react'
import { Quote } from '@/types/quote'
import QuoteCard from '@/components/QuoteCard'
import ChatToggleButton from '@/components/ChatToggleButton'
import ChatPanel from '@/components/ChatPanel'

interface AppShellProps {
  initialQuote: Quote | null
}

export default function AppShell({ initialQuote }: AppShellProps) {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(initialQuote)
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Lock body scroll on mobile when the bottom sheet is open
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isChatOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isChatOpen])

  return (
    <>
      <QuoteCard
        quote={currentQuote}
        onQuoteChange={setCurrentQuote}
      />
      <ChatToggleButton
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(prev => !prev)}
      />
      <ChatPanel
        isOpen={isChatOpen}
        currentQuote={currentQuote}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  )
}
