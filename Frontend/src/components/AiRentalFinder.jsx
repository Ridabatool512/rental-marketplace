import { useState } from 'react'
import { Bot, Sparkles, Send, RotateCcw, X, MessageCircle } from 'lucide-react'
import api from '../api/axios'
import './AiRentalFinder.css'

const quickPrompts = [
  'What should I check before renting an item?',
  'How does renting on Rentify work?',
  'Help me find an affordable camera',
]

const welcomeMessage = {
  role: 'assistant',
  text: "Hi! I'm your Rentify AI assistant. Ask me anything about renting, choosing an item, prices, or how to use the marketplace. I can also answer general questions and remember the context of our conversation.",
}

function AiRentalFinder() {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState([welcomeMessage])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  async function sendMessage(event, prompt = query) {
    event?.preventDefault()
    const text = prompt.trim()
    if (!text || loading) return

    const conversation = [...messages, { role: 'user', text }]
    setMessages(conversation)
    setQuery('')
    setLoading(true)

    try {
      const response = await api.post('/ai/chat', {
        messages: conversation.slice(-12).map((message) => ({
          role: message.role,
          content: message.text,
        })),
      })
      setMessages([...conversation, {
        role: 'assistant',
        text: response.data.answer || "I couldn't generate an answer. Please try again.",
      }])
    } catch (error) {
      setMessages([...conversation, {
        role: 'assistant',
        text: error.response?.data?.message || 'I couldn’t connect to the AI assistant. Please check that the backend is running and try again.',
      }])
    } finally {
      setLoading(false)
    }
  }

  function resetChat() {
    setQuery('')
    setMessages([welcomeMessage])
  }

  return (
    <>
      {!isOpen && (
        <button
          className="ai-chat-launcher"
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Rentify AI assistant"
          title="Chat with Rentify AI"
        >
          <MessageCircle size={25} />
          <span className="ai-chat-launcher-sparkle"><Sparkles size={13} /></span>
        </button>
      )}

      {isOpen && (
      <section className="ai-rental-finder" aria-labelledby="ai-rental-title" role="dialog" aria-modal="false">
      <header className="ai-chat-header">
        <div className="ai-chat-brand">
          <div className="ai-chat-avatar"><Bot size={23} /></div>
          <div>
            <span className="ai-rental-kicker">RENTIFY INTELLIGENCE</span>
            <h2 id="ai-rental-title">AI assistant</h2>
            <p><span className="ai-chat-status-dot" /> Powered by a language model</p>
          </div>
        </div>
        <div className="ai-chat-header-actions">
          <button className="ai-chat-reset" type="button" onClick={resetChat} aria-label="Start a new conversation" title="New conversation">
            <RotateCcw size={16} />
          </button>
          <button className="ai-chat-close" type="button" onClick={() => setIsOpen(false)} aria-label="Close Rentify AI assistant" title="Close chat">
            <X size={19} />
          </button>
        </div>
      </header>

      <div className="ai-chat-body">
        

        <div className="ai-chat-messages" aria-live="polite" aria-relevant="additions">
          {messages.map((message, index) => (
            <div className={`ai-chat-message ai-chat-message-${message.role}`} key={`${message.role}-${index}`}>
              {message.role === 'assistant' && <span className="ai-chat-message-avatar"><Sparkles size={15} /></span>}
              <p>{message.text}</p>
            </div>
          ))}
          {loading && (
            <div className="ai-chat-message ai-chat-message-assistant" role="status">
              <span className="ai-chat-message-avatar"><Sparkles size={15} /></span>
              <p className="ai-chat-typing"><span /><span /><span /> Thinking…</p>
            </div>
          )}
        </div>

        {messages.length === 1 && (
          <div className="ai-chat-suggestions">
            <span>TRY ASKING</span>
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => sendMessage(null, prompt)} disabled={loading}>
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>

      <form className="ai-chat-composer" onSubmit={sendMessage}>
        <div className="ai-chat-input-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ask me anything…"
            aria-label="Ask the Rentify AI assistant a question"
            maxLength={2000}
            disabled={loading}
          />
          <button className="ai-chat-send" type="submit" disabled={loading || !query.trim()} aria-label="Send message">
            <Send size={18} />
          </button>
        </div>
        <p className="ai-chat-disclaimer">AI can make mistakes. Confirm rental prices, availability, and booking details in Rentify.</p>
      </form>
      </section>
      )}
    </>
  )
}

export default AiRentalFinder
