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
    <main className="min-h-screen bg-stone-100 py-8 sm:py-12 lg:py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <header className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-stone-800 mb-4 sm:mb-6 tracking-wide">
            STOIC WISDOM
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
            Discover timeless wisdom from ancient Stoic philosophers to guide your daily life
          </p>
        </header>
        
        <QuoteCard initialQuote={initialQuote} />
      </div>
    </main>
  )
}