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
    { label: 'Electronics', value: 'Electronics', mark: '01' },
    { label: 'Tools', value: 'Tools', mark: '02' },
    { label: 'Home essentials', value: 'Home Essentials', mark: '03' },
    { label: 'Vehicles', value: 'Vehicles', mark: '04' },
  ]

  return (
    <section className="hero hero-showcase" aria-labelledby="hero-title">
      <div className="hero-inner hero-showcase-inner">
        <div className="hero-copy hero-showcase-copy">
          <p className="hero-kicker">
            <span className="hero-kicker-dot" aria-hidden="true" />
            THE SMARTER WAY TO GET WHAT YOU NEED
          </p>

          <h1 id="hero-title">
            Good things
            <br />
            <span>don't have to</span>
            <br />
            be yours.
          </h1>

          <p className="hero-text">
            From weekend cameras to tools for that one big project, rent what
            makes life easier—then pass it on when you're done.
          </p>

          <form className="search-form hero-search" onSubmit={handleSubmit} role="search">
            <span className="search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <circle cx="10.8" cy="10.8" r="6.3" />
                <path d="m15.5 15.5 4.2 4.2" />
              </svg>
            </span>
            <label className="sr-only" htmlFor="rental-search">Search rental items</label>
            <input
              id="rental-search"
              type="search"
              placeholder="What do you need for a while?"
              value={searchText}
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          <div className="hero-actions hero-showcase-actions">
            <button type="button" className="btn btn-primary hero-explore-btn" onClick={onBrowse}>
              Explore rentals <span aria-hidden="true">↗</span>
            </button>
            <button type="button" className="btn btn-hero-secondary" onClick={onOpenStore}>
              List an item
            </button>
          </div>

          <div className="hero-categories hero-showcase-categories">
            <p>Start with a category</p>
            <div className="hero-category-list" aria-label="Browse rental categories">
              {categories.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onSelectCategory(item.value)}
                >
                  <span className="hero-category-mark">{item.mark}</span>
                  {item.label}
                  <span className="hero-category-arrow" aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-visual hero-showcase-visual" aria-label="A selection of things available to rent">
          <div className="hero-photo-frame">
            <img
              className="hero-photo-main"
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1100&q=85"
              alt="Camera ready for a weekend away"
              fetchPriority="high"
              decoding="async"
            />
            <div className="hero-photo-caption">
              <span className="hero-photo-caption-label">MAKE IT A MOMENT</span>
              <span>Rent for the story, not the storage.</span>
            </div>
          </div>

          <figure className="hero-photo-secondary hero-photo-home">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=640&q=80"
              alt="Comfortable, sunlit living room"
              loading="lazy"
              decoding="async"
            />
            <figcaption><span>01</span> Home & living</figcaption>
          </figure>

          <figure className="hero-photo-secondary hero-photo-tools">
            <img
              src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=640&q=80"
              alt="Tools ready for a home improvement project"
              loading="lazy"
              decoding="async"
            />
            <figcaption><span>02</span> Tools for the job</figcaption>
          </figure>

          <div className="hero-photo-note" aria-hidden="true">
            <span className="hero-photo-note-star">✳</span>
            <span>Use it.<br />Love it.<br /><strong>Return it.</strong></span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
