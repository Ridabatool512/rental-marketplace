
import RentalGrid from './RentalGrid'

function StoreDashboard({
  store,
  products,
  onAddProduct,
  onEditProduct,
  onRemoveProduct,
  onEditStore,
  onBack,
  onDeleteStore,
  onViewPublic,
  onViewDetails,
}) {
  const productCount = products.length

  return (
    <main className="page store-dashboard">
    <button
      type="button"
      className="btn btn-ghost"
      onClick={onBack}
      >
       Back to My Stores
    </button>
      <div className="dashboard-header">
        <div className="dashboard-info">
          <p className="eyebrow">YOUR STORE</p>
          <h2>{store.name}</h2>

          <p className="dashboard-text">
            {store.description}
          </p>

          <div className="store-dashboard-meta">
            <span>{store.category || 'General'}</span>

            {store.location && (
              <span>{store.location}</span>
            )}

            <span>
              {productCount}{' '}
              {productCount === 1 ? 'Product' : 'Products'}
            </span>
          </div>
        </div>

        <div className="dashboard-product-count">
          <strong>{productCount}</strong>
          <span>Listed items</span>
        </div>
      </div>

      <div className="dashboard-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onAddProduct}
        >
          + Add Product
        </button>

        <button
          type="button"
          className="btn btn-ghost"
          onClick={onViewPublic}
        >
          View Store
        </button>

        <button
          type="button"
          className="btn btn-ghost"
          onClick={onEditStore}
        >
          Edit Store
        </button>

        <button
          type="button"
          className="btn btn-danger"
          onClick={onDeleteStore}
        >
          Delete Store
        </button>
      </div>

      <section className="dashboard-products">
        <div className="dashboard-products-heading">
          <div>
            <p className="eyebrow">YOUR INVENTORY</p>
            <h2>Store Products</h2>
          </div>

          <span>{productCount} items</span>
        </div>

        <RentalGrid
          items={products}
          onViewDetails={onViewDetails}
          onEdit={onEditProduct}
          onRemove={onRemoveProduct}
          showOwnerActions
          emptyTitle="Your store is waiting for its first product"
          emptyText="Add a rental item to start building your store inventory."
          emptyActionLabel="Add Your First Product"
          onEmptyAction={onAddProduct}
        />
      </section>
    </main>
  )
}

export default StoreDashboard
