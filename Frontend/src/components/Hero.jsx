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
          <p><span className="marketplace-live-dot" /> GOOD THINGS, PASSED AROUND</p>
          <button type="button" className="marketplace-list-link" onClick={onOpenStore}>
            Got something gathering dust? List it <span aria-hidden="true">↗</span>
          </button>
        </div>

        <div className="marketplace-intro-row">
          <div>
            <h1 id="marketplace-intro">Borrow the good<br /><span>stuff.</span></h1>
          </div>
          <p className="marketplace-intro-copy">
            A drill for Saturday. A camera for the trip. Find what you need, use it well, then pass it on.
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
          <button type="submit">Search rentals <span aria-hidden="true">↗</span></button>
        </form>

        <div className="marketplace-categories">
          <span className="marketplace-category-label">START WITH A CATEGORY</span>
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
