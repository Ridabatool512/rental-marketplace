
import { PLACEHOLDER_IMAGE } from '../data/catalog'

function StoreCard({
  store,
  productCount,
  onOpen,
  actionLabel = 'Visit store',
}) {
  return (
    <article className="store-card">
      <div className="card-image-wrap">
        <img
          src={store.coverImage || PLACEHOLDER_IMAGE}
          alt={store.name}
        />
      </div>

      <div className="card-body">
        <p className="card-category">
          {store.category || 'General'}
        </p>

        <h3>{store.name}</h3>

        <p className="store-card-text">
          {store.description}
        </p>

        <p className="store-card-meta">
          {store.location ? `${store.location} · ` : ''}
          {productCount} {productCount === 1 ? 'product' : 'products'}
        </p>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onOpen(store)}
        >
          {actionLabel}
        </button>
      </div>
    </article>
  )
}

export default StoreCard
