import { PRODUCT_CATEGORIES } from '../data/catalog'

function Hero({
  searchText,
  onSearchChange,
  onSearchSubmit,
  onOpenStore,
  onSelectCategory,
}) {
  function handleSubmit(event) {
    event.preventDefault()
    onSearchSubmit()
  }

  return (
    <section className="hero hero-marketplace" aria-labelledby="marketplace-intro">
      <div className="hero-marketplace-inner">
        <div className="marketplace-topline">
          <p><span className="marketplace-live-dot" /> THE RENTAL MARKETPLACE</p>
          <button type="button" className="marketplace-list-link" onClick={onOpenStore}>
            Have something useful? List it <span aria-hidden="true">↗</span>
          </button>
        </div>

        <div className="marketplace-intro-row">
          <div>
            <h1 id="marketplace-intro">Good things are<br /><span>better shared.</span></h1>
          </div>
          <p className="marketplace-intro-copy">
            Find useful things near you. Rent them for the time you need, then pass them on.
          </p>
        </div>

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
            placeholder="Search tools, cameras, furniture..."
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <button type="submit">Find a rental <span aria-hidden="true">↗</span></button>
        </form>

        <div className="marketplace-categories">
          <span className="marketplace-category-label">Browse by category</span>
          <div className="marketplace-category-links">
            {PRODUCT_CATEGORIES.map((item) => (
              <button key={item} type="button" onClick={() => onSelectCategory(item)}>
                {item}<span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
