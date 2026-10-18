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
  }

  return (
    <section className="hero hero-marketplace" aria-labelledby="marketplace-intro">
      <div className="hero-marketplace-inner">
        <div className="marketplace-topline">
          <p>RENT WHAT YOU NEED. RETURN WHEN YOU'RE DONE.</p>
          <button type="button" className="marketplace-list-link" onClick={onOpenStore}>
            Have something to rent? <span>List it ↗</span>
          </button>
        </div>

        <div className="marketplace-intro-row">
          <div className="marketplace-headline-block">
            <h1 id="marketplace-intro">Need it for a day?<br /><span>Rent it for the day.</span></h1>
          </div>
          <div className="marketplace-intro-side">
            <span className="marketplace-side-rule" aria-hidden="true" />
            <p>From a drill for one shelf to a camera for the weekend, find useful things from local stores without buying them outright.</p>
            <button type="button" onClick={onBrowse}>Explore all rentals <span aria-hidden="true">→</span></button>
          </div>
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
            placeholder="What are you looking to rent?"
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <button type="submit">Find a rental <span aria-hidden="true">→</span></button>
        </form>

        <div className="marketplace-categories">
          <span className="marketplace-category-label">BROWSE BY CATEGORY</span>
          <div className="marketplace-category-links">
            {PRODUCT_CATEGORIES.map((item) => (
              <button key={item} type="button" onClick={() => onSelectCategory(item)}>
                {item}<span aria-hidden="true">↗</span>
              </button>
            ))}
            <button type="button" className="marketplace-all-link" onClick={onBrowse}>
              All rentals <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
