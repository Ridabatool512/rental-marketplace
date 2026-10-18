import { PRODUCT_CATEGORIES } from '../data/catalog'

function Hero({
  searchText,
  onSearchChange,
  onSearchSubmit,
  onOpenStore,
  onBrowse,
  onSelectCategory,
}) {
  function handleSubmit(event) {
    event.preventDefault()
    onSearchSubmit()
    onBrowse()
  }

  return (
    <section className="hero hero-marketplace" aria-label="Search rentals">
      <div className="marketplace-simple-inner">
        <div className="marketplace-simple-top">
          <div>
            <span className="marketplace-simple-label">RENTIFY MARKETPLACE</span>
            <h1>Find a rental</h1>
          </div>
          <button type="button" className="marketplace-simple-list" onClick={onOpenStore}>
            List your item <span aria-hidden="true">↗</span>
          </button>
        </div>

        <form className="marketplace-simple-search" onSubmit={handleSubmit} role="search">
          <label className="sr-only" htmlFor="rental-search">Search rental listings</label>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.3" />
            <path d="m15.5 15.5 4.2 4.2" />
          </svg>
          <input
            id="rental-search"
            type="search"
            placeholder="What do you need to rent?"
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="marketplace-simple-categories" aria-label="Rental categories">
          <span>Categories</span>
          {PRODUCT_CATEGORIES.map((item) => (
            <button key={item} type="button" onClick={() => onSelectCategory(item)}>
              {item}
            </button>
          ))}
          <button type="button" className="marketplace-simple-all" onClick={onBrowse}>
            All rentals <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
