
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
  return (
    <article className="rental-card">
      <div className="card-image-wrap">
        <img src={item.image || PLACEHOLDER_IMAGE} alt={item.name} loading="lazy" decoding="async" />
        <span
          className={item.available ? 'badge available' : 'badge unavailable'}
        >
          {Number(item.quantity ?? 1) <= 0 ? 'Out of Stock' : item.available ? 'Available' : 'Unavailable'}
        </span>
      </div>

      <div className="card-body">
        <p className="card-category">{item.category}</p>
        <h3>{item.name}</h3>

        {item.storeName && (
          <p className="store-name-chip">From {item.storeName}</p>
        )}

        <p className="card-price">
          Rs.{item.pricePerDay}
          <span> / day</span>
        </p>

        <div className="card-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onViewDetails(item)}
          >
            View Details
          </button>

          {!showOwnerActions && (
            <>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={!item.available}
                onClick={() => onAddToCart(item)}
              >
                Add to Cart
              </button>

              <button
                type="button"
                className="btn btn-primary"
                disabled={!item.available}
                onClick={() => onRentNow(item)}
              >
                Rent Now
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
