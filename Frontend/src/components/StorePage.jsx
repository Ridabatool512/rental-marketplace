import { PLACEHOLDER_IMAGE } from '../data/catalog'
import RentalGrid from './RentalGrid'

function StorePage({ store, products, onViewDetails, onBack, onManage }) {
  return (
    <main className="page">
      <button type="button" className="btn btn-ghost back-link" onClick={onBack}>
      Back to Store Dashboard
      </button>

      <section className="store-hero">
        <img
          className="store-hero-image"
          src={store.coverImage || PLACEHOLDER_IMAGE}
          alt=""
        />
        <div>
          <p className="eyebrow">{store.category || 'General'}</p>
          <h2>{store.name}</h2>
          <p className="dashboard-text">{store.description}</p>
          <p className="store-card-meta">
            {store.location ? store.location : 'Location not listed'}
          </p>
          {onManage && (
            <button type="button" className="btn btn-primary" onClick={onManage}>
              Manage this store
            </button>
          )}
        </div>
      </section>

      <div className="section-heading">
        <p className="eyebrow">Inventory</p>
        <h2>Products from {store.name}</h2>
      </div>
      <RentalGrid
        items={products}
        onViewDetails={onViewDetails}
        emptyTitle="No products in this store yet"
        emptyText="The owner has not added rental items to this store."
      />
    </main>
  )
}

export default StorePage
