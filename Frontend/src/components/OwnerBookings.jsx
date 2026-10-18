import { useCallback, useEffect, useState } from 'react'
import api from '../api/axios'

function OwnerBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [workingId, setWorkingId] = useState('')

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

  async function updateStatus(id, status) {
    setWorkingId(id)
    setError('')
    try {
      await api.patch(`/bookings/${id}/status`, { status })
      await loadBookings()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update this booking.')
    } finally {
      setWorkingId('')
    }
  }

  async function markPaymentReceived(id) {
    setWorkingId(id)
    setError('')
    try {
      await api.patch(`/bookings/${id}/cod-payment`)
      await loadBookings()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not record this payment.')
    } finally {
      setWorkingId('')
    }
  }

  return (
    <main className="page">
      <div className="section-heading">
        <p className="eyebrow">Store owner dashboard</p>
        <h2>Booking Updates</h2>
        <p>Review requests for your products, approve or reject rentals, and record Cash on Delivery payments.</p>
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
            ? 'You approved this rental request.'
            : status === 'rejected'
              ? 'You rejected this rental request.'
              : status === 'pending'
                ? 'Waiting for your decision.'
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
                {status === 'pending' && (
                  <div className="card-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={workingId === booking._id}
                      onClick={() => updateStatus(booking._id, 'approved')}
                    >
                      {workingId === booking._id ? 'Updating...' : 'Approve Rental'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      disabled={workingId === booking._id}
                      onClick={() => updateStatus(booking._id, 'rejected')}
                    >
                      Reject Request
                    </button>
                  </div>
                )}
                {status === 'approved' && booking.paymentMethod === 'cod' && booking.paymentStatus !== 'paid' && (
                  <div className="card-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={workingId === booking._id}
                      onClick={() => markPaymentReceived(booking._id)}
                    >
                      {workingId === booking._id ? 'Updating...' : 'Mark COD as Collected'}
                    </button>
                  </div>
                )}
                {status === 'approved' && booking.paymentStatus === 'paid' && (
                  <p><strong>Payment:</strong> Paid</p>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}

export default OwnerBookings
