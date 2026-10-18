import { PLACEHOLDER_IMAGE } from '../data/catalog'

function RentalCard({
  item,
  onViewDetails,
  onAddToCart,
  onRentNow,
  onEdit,
  onRemove,
  showOwnerActions,
}) {
  const unavailableLabel = Number(item.quantity ?? 1) <= 0
    ? 'Out of stock'
    : item.available
      ? 'Available to rent'
      : 'Currently unavailable'

  return (
    <article className="rental-card">
      <button
        type="button"
        className="card-image-wrap"
        onClick={() => onViewDetails(item)}
        aria-label={`View details for ${item.name}`}
      >
        <img
          src={item.image || PLACEHOLDER_IMAGE}
          alt={item.name}
          loading="lazy"
          decoding="async"
        />
        <span className="card-image-open" aria-hidden="true">View item ↗</span>
      </button>

      <div className="card-body">
        <div className="card-meta-row">
          <p className="card-category">{item.category || 'Rental item'}</p>
          <span className={item.available ? 'card-availability is-available' : 'card-availability is-unavailable'}>
            <span aria-hidden="true" />
            {unavailableLabel}
          </span>
        </div>
        <h3>{item.name}</h3>

        {item.storeName && (
          <p className="store-name-chip">From {item.storeName}</p>
        )}

        <p className="card-price">
          <strong>Rs. {item.pricePerDay}</strong>
          <span> / day</span>
        </p>

        <div className="card-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onViewDetails(item)}
          >
            View details
          </button>

          {!showOwnerActions && (
            <>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={!item.available}
                onClick={() => onAddToCart(item)}
              >
                Add to cart
              </button>

              <button
                type="button"
                className="btn btn-primary"
                disabled={!item.available}
                onClick={() => onRentNow(item)}
              >
                Rent now
              </button>
            </>
          )}
        </div>

        {showOwnerActions && (
          <div className="card-owner-actions">
            <button type="button" className="btn btn-ghost" onClick={() => onEdit(item)}>
              Edit
            </button>
            <button type="button" className="btn btn-danger" onClick={() => onRemove(item)}>
              Remove
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

export default RentalCard
