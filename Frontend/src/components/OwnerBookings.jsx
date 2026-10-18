import { useCallback, useEffect, useState } from 'react'
import api from '../api/axios'

function OwnerBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadBookings = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/bookings/received')
      setBookings(response.data.bookings || [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load booking updates. Please sign in again if your session has expired.')
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
        <p className="eyebrow">Store owner dashboard</p>
        <h2>Booking Updates</h2>
        <p>See rental requests for your listings and whether the admin approved or rejected them.</p>
      </div>

      <button type="button" className="btn btn-secondary" onClick={loadBookings} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh updates'}
      </button>

      {error && <p className="status-banner" role="alert">{error}</p>}
      {loading && <p>Loading booking requests...</p>}
      {!loading && bookings.length === 0 && (
        <div className="empty-state">
          <h3>No booking requests yet</h3>
          <p>When customers request your rental products, their requests will appear here.</p>
        </div>
      )}

      <div className="cart-list">
        {bookings.map((booking) => {
          const status = String(booking.status || 'pending').toLowerCase()
          const statusMessage = status === 'approved'
            ? 'The admin approved this rental request.'
            : status === 'rejected'
              ? 'The admin rejected this rental request.'
              : status === 'pending'
                ? 'Waiting for admin review.'
                : status === 'cancelled'
                  ? 'This rental request was cancelled.'
                  : status === 'completed'
                    ? 'This rental has been completed.'
                    : 'Booking status updated.'

          return (
            <article className="cart-item" key={booking._id}>
              {booking.listing?.images?.[0] && (
                <img
                  src={booking.listing.images[0]}
                  alt={booking.listing?.title || 'Rental item'}
                  className="cart-item-image"
                />
              )}
              <div className="cart-item-details">
                <h3>{booking.listing?.title || 'Listing unavailable'}</h3>
                <p><strong>Customer:</strong> {booking.renter?.name || 'Unknown'} ({booking.renter?.email || 'No email'})</p>
                <p><strong>Rental dates:</strong> {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}</p>
                <p><strong>Duration:</strong> {booking.totalDays} day(s)</p>
                <p><strong>Total:</strong> Rs. {booking.totalPrice}</p>
                <p><strong>Status:</strong> <span className={`booking-status booking-status-${status}`}>{status.toUpperCase()}</span></p>
                <p>{statusMessage}</p>
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}

export default OwnerBookings
