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
    <section className="hero hero-modern" aria-labelledby="hero-title">
      <div className="hero-modern-shell">
        <div className="hero-kicker-row">
          <p className="hero-kicker"><span className="hero-kicker-dot" /> RENTIFY / EVERYDAY RENTALS</p>
          <p className="hero-kicker-note">Useful things. Just for as long as you need them.</p>
        </div>

        <div className="hero-intro">
          <h1 id="hero-title">Get what you need.<br /><em>Not what you don't.</em></h1>
          <div className="hero-intro-aside">
            <p>Rent the things you need for a day, a weekend, or a special occasion—without paying to own them forever.</p>
            <div className="hero-modern-actions">
              <button type="button" className="hero-explore-button" onClick={onBrowse}>
                Explore rentals <span aria-hidden="true">↗</span>
              </button>
              <button type="button" className="hero-list-button" onClick={onOpenStore}>
                List an item
              </button>
            </div>
          </div>
        </div>

        <figure className="hero-photo">
          <img
            src="https://images.unsplash.com/photo-1590635023142-73c3d34f2805?auto=format&fit=crop&crop=entropy&w=2200&h=900&q=85"
            alt="A person using a cordless drill while assembling furniture at home"
            fetchPriority="high"
            decoding="async"
          />
          <figcaption>
            <span>A small project doesn't have to mean a big purchase.</span>
            <span className="hero-photo-index">TOOLS · HOME · EVERYDAY</span>
          </figcaption>
        </figure>

        <div className="hero-discovery">
          <form className="hero-search-modern" onSubmit={handleSubmit} role="search">
            <label htmlFor="rental-search">What are you looking for?</label>
            <div className="hero-search-control">
              <span className="hero-search-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <circle cx="10.8" cy="10.8" r="6.3" />
                  <path d="m15.5 15.5 4.2 4.2" />
                </svg>
              </span>
              <input
                id="rental-search"
                type="search"
                placeholder="Try a camera, drill, or something for home"
                value={searchText}
                onChange={(event) => onSearchChange(event.target.value)}
              />
              <button type="submit">Search</button>
            </div>
          </form>

          <div className="hero-category-discovery" aria-label="Browse by category">
            <span className="hero-category-label">Browse by need</span>
            <div className="hero-category-links">
              {PRODUCT_CATEGORIES.map((item) => (
                <button key={item} type="button" onClick={() => onSelectCategory(item)}>
                  {item}
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
