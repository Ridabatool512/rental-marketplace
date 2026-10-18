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
    { label: 'Tech & gadgets', value: 'Electronics' },
    { label: 'Tools & DIY', value: 'Tools' },
    { label: 'Home & living', value: 'Home Essentials' },
    { label: 'Cars & rides', value: 'Vehicles' },
  ]

  return (
    <section className="hero hero-cinematic" aria-labelledby="hero-title">
      <div className="cinematic-backdrop" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=88"
          alt=""
          fetchPriority="high"
          decoding="async"
        />
      </div>

      <div className="cinematic-content">
        <div className="cinematic-copy">
          <p className="cinematic-eyebrow"><span /> RENT THE MOMENT, NOT THE THING</p>
          <h1 id="hero-title">More living.<br /><em>Less owning.</em></h1>
          <p className="cinematic-description">
            Need it for a day, a weekend, or a big project? Find useful things
            nearby, rent them simply, and give them back when you're done.
          </p>

          <form className="cinematic-search" onSubmit={handleSubmit} role="search">
            <span className="cinematic-search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <circle cx="10.8" cy="10.8" r="6.3" />
                <path d="m15.5 15.5 4.2 4.2" />
              </svg>
            </span>
            <label className="sr-only" htmlFor="rental-search">Search rental items</label>
            <input
              id="rental-search"
              type="search"
              placeholder="What are you looking to rent?"
              value={searchText}
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <button type="submit">Find a rental <span aria-hidden="true">↗</span></button>
          </form>

          <div className="cinematic-actions">
            <button type="button" className="cinematic-link" onClick={onBrowse}>
              Explore all rentals <span aria-hidden="true">→</span>
            </button>
            <span className="cinematic-action-divider" aria-hidden="true" />
            <button type="button" className="cinematic-link" onClick={onOpenStore}>
              Have something to share? <strong>List it</strong>
            </button>
          </div>
        </div>

        <div className="cinematic-image-label" aria-hidden="true">
          <span className="cinematic-label-line" />
          <span>GOOD THINGS, ON YOUR TERMS</span>
        </div>

        <div className="cinematic-bottom">
          <span className="cinematic-bottom-title">FIND YOUR NEXT SOMETHING</span>
          <div className="cinematic-categories" aria-label="Browse rental categories">
            {categories.map((item) => (
              <button key={item.value} type="button" onClick={() => onSelectCategory(item.value)}>
                {item.label}<span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <span className="cinematic-index">01 <i /> 04</span>
        </div>
      </div>
    </section>
  )
}

export default Hero
