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
      ? 'Available'
      : 'Unavailable'

  return (
    <article className="rental-card">
      <div className="card-image-wrap">
        <img src={item.image || PLACEHOLDER_IMAGE} alt={item.name} loading="lazy" decoding="async" />
        <span className="catalog-category-tag">{item.category || 'Everyday finds'}</span>
        <span className={item.available ? 'badge available' : 'badge unavailable'}>
          {unavailableLabel}
        </span>
      </div>

      <div className="card-body">
        <p className="card-category">FROM THE RENTAL SHELF</p>
        <h3>{item.name}</h3>

        {item.storeName && (
          <p className="store-name-chip">From {item.storeName}</p>
        )}

        <p className="card-price">
          Rs. {item.pricePerDay}
          <span> / DAY</span>
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
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => onEdit(item)}
            >
              Edit
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={() => onRemove(item)}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

export default RentalCard
