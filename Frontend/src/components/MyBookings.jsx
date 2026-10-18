import { useCallback, useEffect, useState } from 'react'
import api from '../api/axios'

function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [payingId, setPayingId] = useState('')

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

  async function payOnline(booking) {
    setPayingId(booking._id)
    setError('')
    try {
      const paymentResponse = await api.post('/payments/demo', { bookingId: booking._id })
      await api.post(`/payments/${paymentResponse.data.payment._id}/simulate`, { outcome: 'success' })
      await loadBookings()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not complete the demo payment.')
    } finally {
      setPayingId('')
    }
  }

  return (
    <main className="page">
      <div className="section-heading">
        <p className="eyebrow">Your account</p>
        <h2>My Rental Requests</h2>
        <p>Check request approval and payment status here.</p>
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
              <p><strong>Request status:</strong> {booking.status}</p>
              <p><strong>Payment method:</strong> {booking.paymentMethod === 'online' ? 'Online payment' : 'Cash on Delivery (COD)'}</p>
              <p><strong>Payment status:</strong> {booking.paymentMethod === 'cod' ? (booking.paymentStatus === 'paid' ? 'Paid (COD collected)' : 'Due on delivery') : (booking.paymentStatus || 'unpaid')}</p>
              {booking.status === 'approved' && booking.paymentMethod === 'online' && booking.paymentStatus === 'unpaid' && (
                <div className="card-actions">
                  <button type="button" className="btn btn-primary" disabled={payingId === booking._id} onClick={() => payOnline(booking)}>
                    {payingId === booking._id ? 'Processing...' : 'Pay Online (Demo)'}
                  </button>
                </div>
              )}
              {booking.paymentMethod === 'online' && booking.status === 'pending' && (
                <p>Online payment will be available after admin approval.</p>
              )}
            </div>
          </article>
        ))}
      </div>
      <p className="payment-demo-note">Demo notice: online payments are simulated for project testing. No real money is charged.</p>
    </main>
  )
}

export default MyBookings
