
import { PLACEHOLDER_IMAGE } from '../data/catalog'

function RentalModal({
  item,
  onClose,
  onVisitStore,
  onSaveRental,
  onAddToCart,
  onRentNow,
  alreadySaved,
  isStoreOwner,
}) {
  if (!item) {
    return null
  }

  function handleAddToCart() {
    onAddToCart(item)
    onClose()
  }

  function handleRentNow() {
    onRentNow(item)
    onClose()
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
        >
          Close
        </button>

        <img
          className="modal-image"
          src={item.image || PLACEHOLDER_IMAGE}
          alt={item.name}
        />

        <p className="card-category">{item.category}</p>
        <h2 id="item-title">{item.name}</h2>

        <p className="modal-meta">
          Rs.{item.pricePerDay} / day
          {item.storeName ? ` · ${item.storeName}` : ''}
          {item.location ? ` · ${item.location}` : ''}
          {` · ${item.available ? 'Available' : 'Unavailable'}`}
        </p>

        <p className="modal-description">{item.description}</p>

        <div className="modal-actions">
          {!isStoreOwner && (
            <>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={!item.available}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>

              <button
                type="button"
                className="btn btn-primary"
                disabled={!item.available}
                onClick={handleRentNow}
              >
                Rent Now
              </button>
            </>
          )}

          {!isStoreOwner && onVisitStore && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => onVisitStore(item.storeId)}
            >
              Visit store
            </button>
          )}

          {!isStoreOwner && (
            <button
              type="button"
              className="btn btn-ghost"
              disabled={!item.available || alreadySaved}
              onClick={() => onSaveRental(item)}
            >
              {!item.available
                ? 'Currently unavailable'
                : alreadySaved
                  ? 'Saved to My Rentals'
                  : 'Save to My Rentals'}
            </button>
          )}

          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default RentalModal
