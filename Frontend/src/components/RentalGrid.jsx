import RentalCard from './RentalCard'

function RentalGrid({
  items,
  onViewDetails,
  onAddToCart,
  onRentNow,
  onEdit,
  onRemove,
  showOwnerActions = false,
  loading = false,
  emptyTitle = 'No products yet',
  emptyText = 'Stores can add rental items from their dashboard.',
  emptyActionLabel,
  onEmptyAction,
}) {
  if (loading && items.length === 0) {
    return (
      <div className="rental-grid skeleton-grid" role="status" aria-label="Loading rental listings">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="rental-skeleton" key={index} aria-hidden="true">
            <div className="skeleton-image" />
            <div className="skeleton-copy">
              <span className="skeleton-line skeleton-label" />
              <span className="skeleton-line skeleton-title" />
              <span className="skeleton-line skeleton-price" />
              <span className="skeleton-button" />
            </div>
          </div>
        ))}
        <span className="sr-only">Loading rentals. Please wait.</span>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-kicker">THE RENTAL SHELF</p>
        <h3>{emptyTitle}</h3>
        <p>{emptyText}</p>
        {onEmptyAction && (
          <button type="button" className="btn btn-primary" onClick={onEmptyAction}>
            {emptyActionLabel}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="rental-grid">
      {items.map((item) => (
        <RentalCard
          key={item.id}
          item={item}
          onViewDetails={onViewDetails}
          onAddToCart={onAddToCart}
          onRentNow={onRentNow}
          onEdit={onEdit}
          onRemove={onRemove}
          showOwnerActions={showOwnerActions}
        />
      ))}
    </div>
  )
}

export default RentalGrid
