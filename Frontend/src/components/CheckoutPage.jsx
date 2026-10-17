
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
  
    function handleSubmit(event) {
      event.preventDefault()
  
      const formData = new FormData(event.currentTarget)
  
      onPlaceOrder({
        customerName: formData.get('customerName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        notes: formData.get('notes'),
      })
    }
  
    if (items.length === 0) {
      return (
        <main className="page">
          <h1>No items to check out</h1>
          <p>Please add a rental item before continuing.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onContinueShopping}
          >
            Browse Rentals
          </button>
        </main>
      )
    }
  
    return (
      <main className="page checkout-page">
        <h1>Checkout</h1>
        <p>Enter your details to place your rental order.</p>
  
        <section className="checkout-summary">
          <h2>Order Summary</h2>
  
          {items.map((item) => (
            <div className="checkout-item" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <p>
                  {item.days} day(s) × Rs.{item.pricePerDay}
                </p>
              </div>
              <strong>Rs.{item.pricePerDay * item.days}</strong>
            </div>
          ))}
  
          <h3>Total: Rs.{total}</h3>
        </section>
  
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              type="text"
              name="customerName"
              required
              autoComplete="name"
            />
          </label>
  
          <label>
            Email address
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
            />
          </label>
  
          <label>
            Phone number
            <input
              type="tel"
              name="phone"
              required
              autoComplete="tel"
            />
          </label>
  
          <label>
            Delivery address
            <textarea
              name="address"
              required
              rows="3"
              autoComplete="street-address"
            />
          </label>
  
          <label>
            Additional notes (optional)
            <textarea name="notes" rows="2" />
          </label>
  
          <p>
            Demo checkout only. No real payment will be taken.
          </p>
  
          <div className="checkout-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onBackToCart}
            >
              Back to Cart
            </button>
  
            <button type="submit" className="btn btn-primary">
              Place Rental Order
            </button>
          </div>
        </form>
      </main>
    )
  }
  
  export default CheckoutPage
  