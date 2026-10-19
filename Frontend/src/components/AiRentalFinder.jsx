import { useState } from 'react'
import api from '../api/axios'
import RentalGrid from './RentalGrid'
import './AiRentalFinder.css'

function AiRentalFinder({ onViewDetails, onAddToCart, onRentNow }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [items, setItems] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function findMatches(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setSearched(true)

    try {
      const response = await api.get('/ai/recommendations', {
        params: {
          query: query.trim() || undefined,
          category: category || undefined,
          location: location.trim() || undefined,
          maxPrice: maxPrice || undefined,
        },
      })
      const recommendations = response.data.recommendations || []
      setItems(recommendations.map((listing) => ({
        id: String(listing._id || listing.id || ''),
        backendListing: true,
        name: listing.title,
        description: listing.description,
        category: listing.category ? listing.category.replace(/\b\w/g, (letter) => letter.toUpperCase()) : 'Other',
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
      })))
      if (!recommendations.length) setMessage('No available rentals matched yet. Try a broader search.')
    } catch (error) {
      setMessage(error.response?.data?.message || 'AI recommendations could not be loaded. Check that the backend is running.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="ai-rental-finder" aria-labelledby="ai-rental-title">
      <div className="ai-rental-heading">
        <span className="ai-rental-kicker">SMART MATCHING</span>
        <h2 id="ai-rental-title">AI Rental Finder</h2>
        <p>Describe what you need and get ranked rental matches based on listing details, category, location, and budget.</p>
      </div>

      <form className="ai-rental-form" onSubmit={findMatches}>
        <label>
          What do you need?
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. camera for a weekend project" maxLength={250} />
        </label>
        <label>
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Any category</option>
            <option value="electronics">Electronics</option>
            <option value="vehicles">Vehicles</option>
            <option value="tools">Tools</option>
            <option value="home essentials">Home Essentials</option>
          </select>
        </label>
        <label>
          Location
          <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Rawalpindi" maxLength={100} />
        </label>
        <label>
          Max daily budget
          <input type="number" min="0" step="1" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Any budget" />
        </label>
        <button className="btn btn-primary ai-rental-submit" type="submit" disabled={loading}>
          {loading ? 'Finding matches…' : 'Find my matches'}
        </button>
      </form>

      {message && <p className="ai-rental-message" role="status">{message}</p>}
      {searched && !loading && items.length > 0 && (
        <div className="ai-rental-results">
          <div className="ai-rental-result-title">
            <h3>Recommended for you</h3>
            <span>{items.length} match{items.length === 1 ? '' : 'es'}</span>
          </div>
          <p className="ai-rental-note">Ranked with content similarity and your selected preferences. Match scores are relative ranking scores, not probabilities.</p>
          <RentalGrid
            items={items}
            onViewDetails={onViewDetails}
            onAddToCart={onAddToCart}
            onRentNow={onRentNow}
          />
        </div>
      )}
    </section>
  )
}

export default AiRentalFinder
