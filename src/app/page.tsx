import QuoteCard from '@/components/QuoteCard'
import { fetchRandomQuote } from '@/lib/api'

export default async function Home() {
  let initialQuote = null
  
  try {
    initialQuote = await fetchRandomQuote()
  } catch (error) {
    console.error('Failed to fetch initial quote:', error)
  }

  return (
    <main className="min-h-screen py-8 sm:py-12 lg:py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <header className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="heading-primary animate-fadeInUp">
            STOIC WISDOM
          </h1>
          <p className="heading-secondary animate-fadeInUp animate-delay-200">
            Discover timeless wisdom from ancient Stoic philosophers to guide your daily life
          </p>
        </header>
        
        <QuoteCard initialQuote={initialQuote} />
      </div>
    </main>
  )
}