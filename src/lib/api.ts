import { Quote } from '@/types/quote'

const API_BASE_URL = 'https://stoic-quotes.com/api'

export async function fetchRandomQuote(): Promise<Quote> {
  const response = await fetch(`${API_BASE_URL}/quote`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch quote')
  }
  
  return response.json()
}