'use client'

import { useState } from 'react'
import { Quote } from '@/types/quote'
import { fetchRandomQuote } from '@/lib/api'

interface QuoteCardProps {
  initialQuote?: Quote | null
}

export default function QuoteCard({ initialQuote }: QuoteCardProps) {
  const [quote, setQuote] = useState<Quote | null>(initialQuote || null)
  const [loading, setLoading] = useState(false)
  const [explaining, setExplaining] = useState(false)
  const [explanation, setExplanation] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleNewQuote = async () => {
    setLoading(true)
    setError(null)
    setExplanation(null)
    
    try {
      const newQuote = await fetchRandomQuote()
      setQuote(newQuote)
    } catch (err) {
      setError('Failed to fetch new quote. Please try again.')
      console.error('Error fetching quote:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExplainQuote = async () => {
    if (!quote) return
    
    setExplaining(true)
    setError(null)
    
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: quote.text, 
          author: quote.author 
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get explanation')
      }

      const data = await response.json()
      setExplanation(data.explanation)
    } catch (err) {
      setError('Failed to explain quote. Please try again.')
      console.error('Error explaining quote:', err)
    } finally {
      setExplaining(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="quote-card">
        {quote && (
          <div className="mb-8 lg:mb-12">
            <blockquote className="quote-text">
              {quote.text}
            </blockquote>
            <cite className="quote-author">
              {quote.author}
            </cite>
          </div>
        )}

        {explanation && (
          <div className="explanation-box">
            <h3 className="explanation-title">Simplified Explanation:</h3>
            <p className="explanation-text">{explanation}</p>
          </div>
        )}
        
        {error && (
          <div className="error-box">
            {error}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleNewQuote}
            disabled={loading}
            className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
          >
            {loading ? 'Reflecting' : 'New Wisdom'}
          </button>
          
          {quote && (
            <button
              onClick={handleExplainQuote}
              disabled={explaining || loading}
              className={`btn btn-secondary ${explaining ? 'btn-loading' : ''}`}
            >
              {explaining ? 'Explaining' : 'Explain Quote'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}