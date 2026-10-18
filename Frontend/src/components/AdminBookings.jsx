import { useCallback, useEffect, useState } from 'react'
import api from '../api/axios'

function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [workingId, setWorkingId] = useState('')

  const loadBookings = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/bookings/admin/all')
      setBookings(response.data.bookings || [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load booking requests.')
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

  return (
    <main className="page">
      <div className="section-heading">
        <p className="eyebrow">Administration</p>
        <h2>Rental Booking Requests</h2>
        <p>Review pending requests and approve or reject them.</p>
      </div>

      <button type="button" className="btn btn-secondary" onClick={loadBookings} disabled={loading}>
        {loading ? 'Loading...' : 'Refresh requests'}
      </button>

      {error && <p className="status-banner" role="alert">{error}</p>}
      {loading && <p>Loading booking requests from the server...</p>}
      {!loading && bookings.length === 0 && <p>No rental requests have been submitted yet.</p>}

      <div className="cart-list">
        {bookings.map((booking) => (
          <article className="cart-item" key={booking._id}>
            <div className="cart-item-details">
              <h3>{booking.listing?.title || 'Listing unavailable'}</h3>
              <p><strong>Customer:</strong> {booking.renter?.name || 'Unknown'} ({booking.renter?.email || 'No email'})</p>
              <p><strong>Owner:</strong> {booking.owner?.name || 'Unknown'} ({booking.owner?.email || 'No email'})</p>
              <p><strong>Contact phone:</strong> {booking.contactPhone || 'Not provided'}</p>
              <p><strong>Delivery address:</strong> {booking.deliveryAddress || 'Not provided'}</p>
              {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
              <p><strong>Dates:</strong> {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}</p>
              <p><strong>Duration:</strong> {booking.totalDays} day(s)</p>
              <p><strong>Total:</strong> Rs. {booking.totalPrice}</p>
              <p><strong>Payment method:</strong> {booking.paymentMethod === 'online' ? 'Online payment' : 'Cash on Delivery (COD)'}</p>
              <p><strong>Payment status:</strong> {booking.paymentMethod === 'cod' ? 'Due on delivery' : (booking.paymentStatus || 'unpaid')}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              {booking.status === 'pending' && (
                <div className="card-actions">
                  <button type="button" className="btn btn-primary" disabled={workingId === booking._id} onClick={() => updateStatus(booking._id, 'approved')}>
                    {workingId === booking._id ? 'Updating...' : 'Approve'}
                  </button>
                  <button type="button" className="btn btn-danger" disabled={workingId === booking._id} onClick={() => updateStatus(booking._id, 'rejected')}>
                    Reject
                  </button>
                </div>
              )}
              {booking.status === 'approved' && booking.paymentMethod === 'cod' && booking.paymentStatus !== 'paid' && (
                <div className="card-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={workingId === booking._id}
                    onClick={async () => {
                      setWorkingId(booking._id)
                      setError('')
                      try {
                        await api.patch(`/bookings/${booking._id}/cod-payment`)
                        await loadBookings()
                      } catch (requestError) {
                        setError(requestError.response?.data?.message || 'Could not record COD payment.')
                      } finally {
                        setWorkingId('')
                      }
                    }}
                  >
                    {workingId === booking._id ? 'Updating...' : 'Mark COD as Collected'}
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export default AdminBookings
