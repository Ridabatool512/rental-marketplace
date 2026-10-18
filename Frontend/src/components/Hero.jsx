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

  const categories = [
    { label: 'Electronics', value: 'Electronics' },
    { label: 'Tools', value: 'Tools' },
    { label: 'Home essentials', value: 'Home Essentials' },
    { label: 'Vehicles', value: 'Vehicles' },
  ]

  return (
    <section className="hero hero-human" aria-labelledby="hero-title">
      <div className="human-hero-inner">
        <div className="human-hero-copy">
          <p className="human-eyebrow"><span /> A BORROWING MARKETPLACE · EST. 2024</p>
          <h1 id="hero-title">Make room for <em>more.</em></h1>
          <p className="human-hero-description">
            From everyday essentials to once-in-a-while adventures, find what you need
            without buying what you don't.
          </p>

          <form className="human-search" onSubmit={handleSubmit} role="search">
            <label className="human-search-label" htmlFor="rental-search">WHAT DO YOU NEED?</label>
            <div className="human-search-control">
              <span className="human-search-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <circle cx="10.8" cy="10.8" r="6.3" />
                  <path d="m15.5 15.5 4.2 4.2" />
                </svg>
              </span>
              <input
                id="rental-search"
                type="search"
                placeholder="Try a camera, drill, or camping gear"
                value={searchText}
                onChange={(event) => onSearchChange(event.target.value)}
              />
              <button type="submit">Search <span aria-hidden="true">↗</span></button>
            </div>
          </form>

          <div className="human-hero-actions">
            <button type="button" className="human-primary-action" onClick={onBrowse}>
              Explore rentals <span aria-hidden="true">↗</span>
            </button>
            <button type="button" className="human-secondary-action" onClick={onOpenStore}>
              Have something to share? <strong>List your item</strong>
            </button>
          </div>

          <div className="human-category-area">
            <p className="human-category-heading">A GOOD PLACE TO START</p>
            <div className="human-category-list">
              {categories.map((item) => (
                <button key={item.value} type="button" onClick={() => onSelectCategory(item.value)}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="human-hero-visual">
          <img
            src="https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=1200&q=85"
            alt="A photographer outdoors using a camera to capture a moment"
            fetchPriority="high"
            decoding="async"
          />
          <div className="human-photo-caption">
            <span>FIG. 01 — MADE FOR THE MOMENT</span>
            <p>Big plans. One good find.</p>
          </div>
          <span className="human-photo-index" aria-hidden="true">BORROW WELL · PASS IT ON</span>
        </div>
      </div>
      <div className="human-hero-bottom" aria-hidden="true">
        <span>USE IT WHEN YOU NEED IT</span><span className="human-bottom-line" /><span>PASS IT ON WHEN YOU DON'T</span>
      </div>
    </section>
  )
}

export default Hero
