import { useCallback, useEffect, useState } from 'react'
import api from '../api/axios'

function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadBookings = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/bookings/my')
      setBookings(response.data.bookings || [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load your rental requests.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  return (
    <main className="page">
      <div className="section-heading">
        <p className="eyebrow">Your account</p>
        <h2>My Rental Requests</h2>
        <p>Check the status of your rental requests.</p>
      </div>

      <button type="button" className="btn btn-secondary" onClick={loadBookings} disabled={loading}>
        {loading ? 'Loading...' : 'Refresh requests'}
      </button>

      {error && <p className="status-banner" role="alert">{error}</p>}
      {loading && <p>Loading your requests...</p>}
      {!loading && bookings.length === 0 && <p>You have no rental requests yet.</p>}

      <div className="cart-list">
        {bookings.map((booking) => (
          <article className="cart-item" key={booking._id}>
            <img
              src={booking.listing?.images?.[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'}
              alt={booking.listing?.title || 'Rental item'}
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <h3>{booking.listing?.title || 'Listing unavailable'}</h3>
              <p>Rental dates: {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}</p>
              <p>{booking.totalDays} day(s) × Rs. {booking.pricePerDay}</p>
              <p><strong>Total: Rs. {booking.totalPrice}</strong></p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Payment:</strong> {booking.paymentStatus}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export default MyBookings
