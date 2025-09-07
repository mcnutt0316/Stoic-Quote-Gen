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
      <div className="bg-stone-50 border border-stone-200 rounded-none sm:rounded-lg shadow-sm p-6 sm:p-8 lg:p-12">
        {quote && (
          <div className="mb-8 lg:mb-12">
            <blockquote className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-light text-stone-800 mb-6 lg:mb-8 leading-relaxed lg:leading-loose tracking-wide">
              "{quote.text}"
            </blockquote>
            <cite className="text-base sm:text-lg lg:text-xl text-stone-600 font-normal tracking-wide">
              — {quote.author}
            </cite>
          </div>
        )}

        {explanation && (
          <div className="mb-8 lg:mb-12 p-6 bg-blue-50 border border-blue-200 rounded-sm">
            <h3 className="text-lg font-medium text-stone-800 mb-4">Simplified Explanation:</h3>
            <p className="text-base text-stone-700 leading-relaxed">{explanation}</p>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-sm text-sm sm:text-base">
            {error}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleNewQuote}
            disabled={loading}
            className="w-full sm:w-auto sm:min-w-48 bg-stone-700 hover:bg-stone-800 disabled:bg-stone-400 text-white font-normal py-3 sm:py-4 px-8 sm:px-12 rounded-none sm:rounded-sm transition-colors duration-300 text-sm sm:text-base tracking-wider uppercase"
          >
            {loading ? 'Reflecting...' : 'New Wisdom'}
          </button>
          
          {quote && (
            <button
              onClick={handleExplainQuote}
              disabled={explaining || loading}
              className="w-full sm:w-auto sm:min-w-48 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-normal py-3 sm:py-4 px-8 sm:px-12 rounded-none sm:rounded-sm transition-colors duration-300 text-sm sm:text-base tracking-wider uppercase"
            >
              {explaining ? 'Explaining...' : 'Explain Quote'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}