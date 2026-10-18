import { useState } from 'react'

function CheckoutPage({ items, onPlaceOrder, onBackToCart, onContinueShopping }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')

  const rentalDays = startDate && endDate
    ? Math.max(1, Math.round(
        (new Date(`${endDate}T00:00:00`).getTime() -
          new Date(`${startDate}T00:00:00`).getTime()) / 86400000
      ))
    : null

  const total = items.reduce(
    (sum, item) => sum + item.pricePerDay * (rentalDays || item.days),
    0
  )

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    onPlaceOrder({
      customerName: formData.get('customerName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      notes: formData.get('notes'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      paymentMethod,
    })
  }

  if (items.length === 0) {
    return (
      <main className="page">
        <h1>No items to check out</h1>
        <p>Please add a rental item before continuing.</p>
        <button type="button" className="btn btn-primary" onClick={onContinueShopping}>
          Browse Rentals
        </button>
      </main>
    )
  }

  return (
    <main className="page checkout-page">
      <h1>Checkout</h1>
      <p>Enter your details, choose a payment method, and send your rental request.</p>

      <section className="checkout-summary">
        <h2>Order Summary</h2>
        {items.map((item) => (
          <div className="checkout-item" key={item.id}>
            <div>
              <strong>{item.name}</strong>
              <p>{rentalDays || item.days} day(s) × Rs. {item.pricePerDay}</p>
            </div>
            <strong>Rs. {item.pricePerDay * (rentalDays || item.days)}</strong>
          </div>
        ))}
        <h3>Total: Rs. {total}</h3>
      </section>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <label>
          Rental start date
          <input
            type="date"
            name="startDate"
            min={new Date().toISOString().slice(0, 10)}
            value={startDate}
            onChange={(event) => {
              setStartDate(event.target.value)
              if (endDate && event.target.value >= endDate) setEndDate('')
            }}
            required
          />
        </label>

        <label>
          Rental end date
          <input
            type="date"
            name="endDate"
            min={startDate
              ? new Date(new Date(`${startDate}T00:00:00`).getTime() + 86400000).toISOString().slice(0, 10)
              : new Date().toISOString().slice(0, 10)}
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            required
          />
        </label>

        <label>
          Full name
          <input type="text" name="customerName" required autoComplete="name" />
        </label>

        <label>
          Email address
          <input type="email" name="email" required autoComplete="email" />
        </label>

        <label>
          Phone number
          <input type="tel" name="phone" required autoComplete="tel" />
        </label>

        <label>
          Delivery address
          <textarea name="address" required rows="3" autoComplete="street-address" />
        </label>

        <label>
          Additional notes (optional)
          <textarea name="notes" rows="2" />
        </label>

        <fieldset className="payment-method-options">
          <legend>Payment method</legend>
          <label className="payment-method-option">
            <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
            <span>
              <strong>Cash on Delivery (COD)</strong>
              <small>Pay when the rental is delivered. Your request still needs admin approval.</small>
            </span>
          </label>
          <label className="payment-method-option">
            <input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
            <span>
              <strong>Online Payment</strong>
              <small>After admin approval, you can complete a demo online payment. No real money is charged until a payment provider is connected.</small>
            </span>
          </label>
        </fieldset>

        <p>Your request is created as Pending. The admin must approve it before an online payment can be completed.</p>

        <div className="checkout-actions">
          <button type="button" className="btn btn-ghost" onClick={onBackToCart}>Back to Cart</button>
          <button type="submit" className="btn btn-primary">Place Rental Order</button>
        </div>
      </form>
    </main>
  )
}

export default CheckoutPage
