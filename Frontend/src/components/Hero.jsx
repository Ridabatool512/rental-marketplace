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
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker">RENTIFY <span>· Make room for more</span></p>
          <h1 id="hero-title">
            Own less.
            <br />
            <span>Experience more.</span>
          </h1>
          <p className="hero-text">
            From the camera you need for a weekend to the tools for a home project,
            find useful things from independent stores—only for as long as you need them.
          </p>

          <form className="search-form" onSubmit={handleSubmit} role="search">
            <label className="sr-only" htmlFor="rental-search">Search rental items</label>
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              id="rental-search"
              type="search"
              placeholder="What are you looking to rent?"
              value={searchText}
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          <div className="hero-actions">
            <button type="button" className="btn btn-primary hero-explore-btn" onClick={onBrowse}>
              Explore Rentals <span aria-hidden="true">↗</span>
            </button>
            <button type="button" className="btn btn-hero-secondary" onClick={onOpenStore}>
              List an Item
            </button>
          </div>

          <div className="hero-proof" aria-label="How Rentify works">
            <span>Daily rental pricing</span>
            <span>Local store listings</span>
            <span>Owner-approved requests</span>
          </div>

          <div className="hero-categories">
            <p>Find your next useful thing</p>
            <div className="hero-category-list" aria-label="Browse rental categories">
              {categories.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onSelectCategory(item.value)}
                >
                  {item.label}<span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-label="A glimpse of things you can rent">
          <figure className="hero-main-image">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=82"
              alt="Warm, thoughtfully furnished living room with natural light"
              fetchPriority="high"
              decoding="async"
            />
            <figcaption>Make the most of what you need, not what you own.</figcaption>
          </figure>
          <div className="hero-side-images">
            <figure className="hero-small-image hero-camera-image">
              <img
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=640&q=78"
                alt="Camera ready for a weekend trip"
                loading="lazy"
                decoding="async"
              />
              <figcaption>For the moments worth keeping</figcaption>
            </figure>
            <figure className="hero-small-image hero-tools-image">
              <img
                src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=640&q=78"
                alt="Hand tools arranged for a home project"
                loading="lazy"
                decoding="async"
              />
              <figcaption>For the jobs worth doing</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
