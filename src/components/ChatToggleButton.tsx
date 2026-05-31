'use client'

interface ChatToggleButtonProps {
  isOpen: boolean
  onToggle: () => void
}

export default function ChatToggleButton({ isOpen, onToggle }: ChatToggleButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="chat-fab"
      aria-label={isOpen ? 'Close chat' : 'Open Stoic Tutor chat'}
    >
      {isOpen ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )}
    </button>
  )
}
