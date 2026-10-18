import { PRODUCT_CATEGORIES } from '../data/catalog'

function Hero({
  searchText,
  onSearchChange,
  onSearchSubmit,
  onOpenStore,
  onBrowse,
  onSelectCategory,
  featuredItems = [],
  onViewItem,
}) {
  function handleSubmit(event) {
    event.preventDefault()
    onSearchSubmit()
  }

  const imageItems = featuredItems.filter((item) => item.image).slice(0, 3)

  return (
    <section className="hero hero-marketplace" aria-labelledby="marketplace-intro">
      <div className="hero-marketplace-inner">
        <div className="marketplace-topline">
          <span className="marketplace-wordmark">RENTIFY <span>／</span> RENTAL MARKETPLACE</span>
          <button type="button" className="marketplace-list-link" onClick={onOpenStore}>
            List an item <span aria-hidden="true">↗</span>
          </button>
        </div>

        <div className="marketplace-hero-layout">
          <div className="marketplace-hero-content">
            <h1 id="marketplace-intro">What are you<br />looking to <em>rent?</em></h1>
            <p className="marketplace-hero-description">
              Find it nearby. Rent it for as long as you need.
            </p>

            <form className="marketplace-search" onSubmit={handleSubmit} role="search">
              <label className="sr-only" htmlFor="rental-search">Search rental listings</label>
              <span className="marketplace-search-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <circle cx="10.8" cy="10.8" r="6.3" />
                  <path d="m15.5 15.5 4.2 4.2" />
                </svg>
              </span>
              <input
                id="rental-search"
                type="search"
                placeholder="Search tools, cameras, vehicles..."
                value={searchText}
                onChange={(event) => onSearchChange(event.target.value)}
              />
              <button type="submit">Search <span aria-hidden="true">→</span></button>
            </form>

            <div className="marketplace-categories">
              {PRODUCT_CATEGORIES.map((item) => (
                <button key={item} type="button" onClick={() => onSelectCategory(item)}>
                  {item}<span aria-hidden="true">↗</span>
                </button>
              ))}
              <button type="button" className="marketplace-all-link" onClick={onBrowse}>View all</button>
            </div>
          </div>

          <div className={imageItems.length ? "marketplace-featured-rail" : "marketplace-featured-rail is-empty"}>
            {imageItems.length ? (
              <>
                <div className="marketplace-rail-heading">
                  <span>AVAILABLE TO RENT</span>
                  <button type="button" onClick={onBrowse}>Browse all ↗</button>
                </div>
                <div className="marketplace-product-strip">
                  {imageItems.map((item, index) => (
                    <button
                      type="button"
                      className={`marketplace-product-tile marketplace-product-tile-${index + 1}`}
                      key={item.id}
                      onClick={() => onViewItem?.(item)}
                    >
                      <span className="marketplace-product-photo">
                        <img src={item.image} alt={item.name} loading={index === 0 ? 'eager' : 'lazy'} />
                      </span>
                      <span className="marketplace-product-info">
                        <span className="marketplace-product-name">{item.name}</span>
                        <span className="marketplace-product-price">Rs. {item.pricePerDay} <small>/ day</small></span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="marketplace-rail-empty">
                <span>YOUR NEXT RENTAL</span>
                <p>Tools, tech, vehicles and everyday essentials — all in one place.</p>
                <button type="button" onClick={onBrowse}>Explore rentals ↗</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
