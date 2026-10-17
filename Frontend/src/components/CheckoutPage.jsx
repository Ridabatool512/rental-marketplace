function CheckoutPage({
    items,
    onPlaceOrder,
    onBackToCart,
    onContinueShopping,
  }) {
    const total = items.reduce(
      (sum, item) => sum + item.pricePerDay * item.days,
      0
    )
  
    function formatPrice(price) {
      return `Rs. ${Number(price).toLocaleString('en-PK')}`
    }
  
    function handleSubmit(event) {
      event.preventDefault()
  
      const formData = new FormData(event.currentTarget)
      const phone = formData.get('phone')?.trim() || ''

if (!/^03\d{9}$/.test(phone)) {
  event.currentTarget.elements.phone.setCustomValidity(
    'Enter a valid 11-digit Pakistani mobile number starting with 03.'
  )
  event.currentTarget.elements.phone.reportValidity()
  event.currentTarget.elements.phone.setCustomValidity('')
  return
}
  
      onPlaceOrder({
        customerName: formData.get('customerName'),
        email: formData.get('email'),
        phone: phone,
        address: formData.get('address'),
        notes: formData.get('notes'),
      })
    }
  
    if (items.length === 0) {
      return (
        <main className="page checkout-page">
          <section className="checkout-empty">
            <div className="checkout-empty-icon">🛍️</div>
            <h1>Your checkout is empty</h1>
            <p>Add something you would like to rent before checking out.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onContinueShopping}
            >
              Browse Rentals
            </button>
          </section>
        </main>
      )
    }
  
    return (
      <main className="page checkout-page">
        <div className="checkout-header">
          <button
            type="button"
            className="checkout-back-link"
            onClick={onBackToCart}
          >
            ← Back to cart
          </button>
  
          <p className="checkout-eyebrow">YOUR RENTAL, YOUR WAY</p>
          <h1>Complete your order</h1>
          <p className="checkout-subtitle">
            Just a few details and your rental order will be ready.
          </p>
  
          <div className="checkout-progress">
            <div className="checkout-progress-step checkout-progress-done">
              <span>✓</span>
              <p>Your items</p>
            </div>
            <div className="checkout-progress-line checkout-progress-line-active" />
            <div className="checkout-progress-step checkout-progress-current">
              <span>2</span>
              <p>Checkout</p>
            </div>
            <div className="checkout-progress-line" />
            <div className="checkout-progress-step">
              <span>3</span>
              <p>Confirmation</p>
            </div>
          </div>
        </div>
  
        <div className="checkout-layout">
          <section className="checkout-panel checkout-details-panel">
            <div className="checkout-section-heading">
              <div className="checkout-heading-icon">01</div>
              <div>
                <h2>Your details</h2>
                <p>Where should we contact you?</p>
              </div>
            </div>
  
            <form
              id="rental-checkout-form"
              className="checkout-form"
              onSubmit={handleSubmit}
            >
              <div className="checkout-form-grid">
                <label className="checkout-field checkout-field-full">
                  <span>Full name <b>*</b></span>
                  <input
                    type="text"
                    name="customerName"
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                  />
                </label>
  
                <label className="checkout-field">
                  <span>Email address <b>*</b></span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </label>
  
                <label className="checkout-field">
  <span>Phone number <b>*</b></span>
  <input
    type="tel"
    name="phone"
    placeholder="03001234567"
    required
    autoComplete="tel"
    inputMode="numeric"
    pattern="03[0-9]{9}"
    maxLength={11}
    minLength={11}
    title="Enter a valid 11-digit Pakistani mobile number starting with 03."
    onChange={(event) => {
      event.target.value = event.target.value
        .replace(/\D/g, '')
        .slice(0, 11)
    }}
  />
  <small>Enter 11 digits, starting with 03.</small>
</label>
  
                <label className="checkout-field checkout-field-full">
                  <span>Delivery address <b>*</b></span>
                  <textarea
                    name="address"
                    placeholder="Enter your complete delivery address"
                    rows={3}
                    required
                    autoComplete="street-address"
                  />
                </label>
  
                <label className="checkout-field checkout-field-full">
                  <span>Additional notes <small>Optional</small></span>
                  <textarea
                    name="notes"
                    placeholder="Any special instructions?"
                    rows={2}
                  />
                </label>
              </div>
  
              <div className="checkout-demo-notice">
                <span className="checkout-notice-icon">ⓘ</span>
                <p>
                  <strong>Demo checkout</strong>
                  <br />
                  This is a demonstration order. No real payment will be taken.
                </p>
              </div>
  
              <div className="checkout-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={onBackToCart}
                >
                  Back to Cart
                </button>
  
                <button
                  type="submit"
                  className="btn btn-primary checkout-submit"
                >
                  Place Rental Order <span>→</span>
                </button>
              </div>
            </form>
          </section>
  
          <aside className="checkout-panel checkout-order-panel">
            <div className="checkout-order-heading">
              <div>
                <p className="checkout-eyebrow">YOUR SELECTION</p>
                <h2>Order summary</h2>
              </div>
              <span className="checkout-item-count">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
  
            <div className="checkout-order-items">
              {items.map((item) => (
                <article className="checkout-order-item" key={item.id}>
                  <div className="checkout-product-placeholder">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <span>R</span>
                    )}
                  </div>
  
                  <div className="checkout-product-info">
                    <h3>{item.name}</h3>
                    <p>
                      {formatPrice(item.pricePerDay)} / day
                    </p>
                    <span>
                      {item.days} {item.days === 1 ? 'day' : 'days'}
                    </span>
                  </div>
  
                  <strong className="checkout-item-price">
                    {formatPrice(item.pricePerDay * item.days)}
                  </strong>
                </article>
              ))}
            </div>
  
            <div className="checkout-price-breakdown">
              <div>
                <span>Rental subtotal</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <div>
                <span>Payment</span>
                <span className="checkout-demo-label">Demo only</span>
              </div>
            </div>
  
            <div className="checkout-grand-total">
              <div>
                <h3>Total</h3>
                <p>For your selected rental duration</p>
              </div>
              <strong>{formatPrice(total)}</strong>
            </div>
  
            <div className="checkout-trust-note">
              <span>✓</span>
              <p>
                <strong>Review before submitting</strong>
                Your order details will be shown in your confirmation.
              </p>
            </div>
  
            <p className="checkout-summary-footer">
              Rental costs are calculated using the daily price multiplied by
              the number of rental days.
            </p>
          </aside>
        </div>
      </main>
    )
  }
  
  export default CheckoutPage