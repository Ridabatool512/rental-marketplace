
function CartPage({
  items,
  onUpdateDays,
  onRemove,
  onCheckout,
  onContinueShopping,
}) {
  const total = items.reduce(
    (sum, item) => sum + item.pricePerDay * item.days,
    0
  )

  return (
    <main className="page">
      <h1>Your Cart</h1>
      <p>Review your rental items before checkout.</p>

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <p>Add some rental items to get started.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onContinueShopping}
          >
            Browse Rentals
          </button>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />

                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>Rs.{item.pricePerDay} per day</p>

                  <label>
                    Rental days:{' '}
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={item.days}
                      onChange={(event) =>
                        onUpdateDays(
                          item.id,
                          Math.max(
                            1,
                            Math.min(
                              365,
                              Number(event.target.value) || 1
                            )
                          )
                        )
                      }
                    />
                  </label>

                  <p>
                    Subtotal: Rs.{item.pricePerDay * item.days}
                  </p>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => onRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <section className="cart-summary">
            <h2>Total: Rs.{total}</h2>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onCheckout}
            >
              Proceed to Checkout
            </button>
          </section>
        </>
      )}
    </main>
  )
}

export default CartPage
