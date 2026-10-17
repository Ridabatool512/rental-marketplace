
import RentalCard from './RentalCard'

function RentalGrid({
  items,
  onViewDetails,
  onAddToCart,
  onRentNow,
  onEdit,
  onRemove,
  showOwnerActions = false,
  emptyTitle = 'No products yet',
  emptyText = 'Stores can add rental items from their dashboard.',
  emptyActionLabel,
  onEmptyAction,
}) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h3>{emptyTitle}</h3>
        <p>{emptyText}</p>
        {onEmptyAction && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={onEmptyAction}
          >
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
