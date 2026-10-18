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
          <p><span className="marketplace-live-dot" /> GOOD THINGS, PASSED AROUND</p>
          <button type="button" className="marketplace-list-link" onClick={onOpenStore}>
            Got something gathering dust? List it <span aria-hidden="true">↗</span>
          </button>
        </div>

        <div className="marketplace-intro-row">
          <div className="marketplace-headline-block">
            <p className="marketplace-edition">THE RENTAL SHELF <span>— No. 001</span></p>
            <h1 id="marketplace-intro">Borrow the good<br /><span>stuff.</span></h1>
            <p className="marketplace-intro-copy">
              For the things you need once in a while, not forever.
            </p>
          </div>
          <aside className="marketplace-editorial" aria-label="The Rentify idea">
            <div className="editorial-note-top"><span>THE IDEA</span><span>01 / 03</span></div>
            <div className="editorial-loop" aria-hidden="true">
              <svg viewBox="0 0 180 110" focusable="false">
                <path d="M28 56c0-22 18-40 40-40 16 0 29 9 36 22" />
                <path d="m91 35 13 4 2-14" />
                <path d="M152 55c0 22-18 40-40 40-16 0-29-9-36-22" />
                <path d="m89 76-13-4-2 14" />
              </svg>
              <span>IN<br />ROTATION</span>
            </div>
            <p>Use it for the weekend.<br />Pass it on for the next.</p>
            <div className="editorial-note-bottom"><span>LESS WASTE</span><span>MORE USE</span></div>
          </aside>
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
          <span className="marketplace-category-label">SHOP BY NEED</span>
          <div className="marketplace-category-links">
            {PRODUCT_CATEGORIES.map((item, index) => (
              <button key={item} type="button" onClick={() => onSelectCategory(item)}>
                <span className="category-index">{String(index + 1).padStart(2, '0')}</span>{item}<span aria-hidden="true">↗</span>
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
