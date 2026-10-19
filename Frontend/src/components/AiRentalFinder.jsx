import { useState } from 'react'
import { Bot, Sparkles, Send, SlidersHorizontal, MapPin, Wallet, RotateCcw } from 'lucide-react'
import api from '../api/axios'
import RentalGrid from './RentalGrid'
import './AiRentalFinder.css'

const quickPrompts = [
  'I need a camera for a project',
  'Find affordable electronics',
  'I need tools near me',
]

function AiRentalFinder({ onViewDetails, onAddToCart, onRentNow }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [items, setItems] = useState([])
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! I’m your Rentify rental assistant. Tell me what you’re looking to rent, and I’ll find the closest matches from available listings.",
    },
  ])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  async function findMatches(event, prompt = query) {
    event?.preventDefault()
    const requestedQuery = prompt.trim()
    if (!requestedQuery && !category && !location && !maxPrice) {
      setMessages((current) => [...current, {
        role: 'assistant',
        text: 'Tell me what you need, or open preferences to add a category, location, or daily budget.',
      }])
      return
    }

    setQuery(requestedQuery)
    setMessages((current) => [...current, { role: 'user', text: requestedQuery || 'Recommend rentals using my selected preferences.' }])
    setLoading(true)
    setItems([])
    setHasSearched(true)

    try {
      const response = await api.get('/ai/recommendations', {
        params: {
          query: requestedQuery || undefined,
          category: category || undefined,
          location: location.trim() || undefined,
          maxPrice: maxPrice || undefined,
        },
      })
      const recommendations = response.data.recommendations || []
      const mappedItems = recommendations.map((listing) => ({
        id: String(listing._id || listing.id || ''),
        backendListing: true,
        name: listing.title,
        description: listing.description,
        category: listing.category ? listing.category.replace(/\\b\\w/g, (letter) => letter.toUpperCase()) : 'Other',
        image: listing.images?.[0] || '',
        images: listing.images || [],
        pricePerDay: listing.pricePerDay,
        quantity: Number(listing.quantity ?? 1),
        status: listing.status,
        available: listing.status === 'available' && Number(listing.quantity ?? 1) > 0,
        storeName: listing.store?.name || listing.owner?.name || 'Rental owner',
        location: listing.store?.location || listing.location || '',
        storeId: String(listing.store?._id || listing.store || ''),
        ownerId: String(listing.owner?._id || listing.owner || ''),
        storeCategory: listing.store?.category || 'General',
        aiMatchScore: listing.matchScore,
        aiReason: listing.recommendationReason,
      }))
      setItems(mappedItems)
      if (!mappedItems.length) {
        setMessages((current) => [...current, {
          role: 'assistant',
          text: 'I couldn’t find available rentals matching that request yet. Try a broader description or adjust your preferences.',
        }])
      } else {
        setMessages((current) => [...current, {
          role: 'assistant',
          text: `I found ${mappedItems.length} rental match${mappedItems.length === 1 ? '' : 'es'} for you. I ranked them using listing details and your preferences. Select a card below to explore a rental.`,
        }])
      }
    } catch (error) {
      setItems([])
      setMessages((current) => [...current, {
        role: 'assistant',
        text: error.response?.data?.message || 'I couldn’t connect to the recommendation service. Please check the backend and try again.',
      }])
    } finally {
      setLoading(false)
    }
  }

  function resetChat() {
    setQuery('')
    setCategory('')
    setLocation('')
    setMaxPrice('')
    setItems([])
    setHasSearched(false)
    setMessages([{
      role: 'assistant',
      text: 'Hi! I’m your Rentify rental assistant. Tell me what you’re looking to rent, and I’ll find the closest matches from available listings.',
    }])
  }

  return (
    <section className="ai-rental-finder" aria-labelledby="ai-rental-title">
      <header className="ai-chat-header">
        <div className="ai-chat-brand">
          <div className="ai-chat-avatar"><Bot size={23} /></div>
          <div>
            <span className="ai-rental-kicker">RENTIFY INTELLIGENCE</span>
            <h2 id="ai-rental-title">Rental assistant</h2>
            <p><span className="ai-chat-status-dot" /> Your personal rental matchmaker</p>
          </div>
        </div>
        <button className="ai-chat-reset" type="button" onClick={resetChat} aria-label="Reset conversation" title="New conversation">
          <RotateCcw size={17} />
        </button>
      </header>

      <div className="ai-chat-body">
        <div className="ai-chat-intro">
          <div className="ai-chat-sparkle"><Sparkles size={19} /></div>
          <div>
            <h3>Let’s find your perfect rental.</h3>
            <p>Tell me what you need in your own words. I’ll rank available items by relevance, location, and budget.</p>
          </div>
        </div>

        <div className="ai-chat-messages" aria-live="polite">
          {messages.map((message, index) => (
            <div className={`ai-chat-message ai-chat-message-${message.role}`} key={`${message.role}-${index}`}>
              {message.role === 'assistant' && <span className="ai-chat-message-avatar"><Sparkles size={15} /></span>}
              <p>{message.text}</p>
            </div>
          ))}
          {loading && (
            <div className="ai-chat-message ai-chat-message-assistant" role="status">
              <span className="ai-chat-message-avatar"><Sparkles size={15} /></span>
              <p className="ai-chat-typing"><span /><span /><span /> Finding your best matches…</p>
            </div>
          )}
        </div>

        {!hasSearched && (
          <div className="ai-chat-suggestions">
            <span>TRY ASKING</span>
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => findMatches(null, prompt)} disabled={loading}>
                {prompt}
              </button>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="ai-chat-results">
            <div className="ai-chat-results-heading">
              <div><span>YOUR MATCHES</span><h3>Picked for your request</h3></div>
              <span className="ai-chat-match-count">{items.length} found</span>
            </div>
            <p className="ai-chat-results-note">Match scores show relative relevance, not a probability.</p>
            <RentalGrid
              items={items}
              onViewDetails={onViewDetails}
              onAddToCart={onAddToCart}
              onRentNow={onRentNow}
            />
          </div>
        )}
      </div>

      <form className="ai-chat-composer" onSubmit={findMatches}>
        {showFilters && (
          <div className="ai-chat-filters">
            <label><span><SlidersHorizontal size={14} /> Category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="">Any category</option>
                <option value="electronics">Electronics</option>
                <option value="vehicles">Vehicles</option>
                <option value="tools">Tools</option>
                <option value="home essentials">Home Essentials</option>
              </select>
            </label>
            <label><span><MapPin size={14} /> Location</span>
              <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City or area" maxLength={100} />
            </label>
            <label><span><Wallet size={14} /> Daily budget</span>
              <input type="number" min="0" step="1" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="No limit" />
            </label>
          </div>
        )}
        <div className="ai-chat-input-row">
          <button className={`ai-chat-filter-toggle ${showFilters ? 'is-active' : ''}`} type="button" onClick={() => setShowFilters((value) => !value)} aria-label="Toggle rental preferences" title="Rental preferences">
            <SlidersHorizontal size={19} />
          </button>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Describe what you want to rent…"
            aria-label="Describe what you want to rent"
            maxLength={250}
            disabled={loading}
          />
          <button className="ai-chat-send" type="submit" disabled={loading} aria-label="Send message">
            <Send size={18} />
          </button>
        </div>
        <p className="ai-chat-disclaimer">Rentify recommendations are based on available listing information and your preferences.</p>
      </form>
    </section>
  )
}

export default AiRentalFinder
