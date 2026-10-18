import StoreCard from './StoreCard'

function StoreGrid({
  stores,
  products,
  onOpen,
  actionLabel,
  emptyTitle,
  emptyText,
  onEmptyAction,
  emptyActionLabel,
}) {
  if (stores.length === 0) {
    return (
      <div className="empty-state">
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
      {stores.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          productCount={products.filter((item) => String(item.storeId) === String(store.id)).length}
          onOpen={onOpen}
          actionLabel={actionLabel}
        />
      ))}
    </div>
  )
}

export default StoreGrid
