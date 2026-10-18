function Hero({
  searchText,
  onSearchChange,
  onSearchSubmit,
  onOpenStore,
  onBrowse,
}) {
  function handleSubmit(event) {
    event.preventDefault()
    onSearchSubmit()
  }

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="hero-kicker-dot" />
            GOOD FINDS. SHORT-TERM COMMITMENTS.
          </div>
          <h1>Your next fave thing? <span>Rent it.</span></h1>
          <p className="hero-text">
            From weekend plans to everyday essentials, find cool stuff from
            independent stores nearby. Use it, love it, give it back.
          </p>

          <form className="search-form" onSubmit={handleSubmit}>
            <span className="hero-search-icon" aria-hidden="true">⌕</span>
            <label className="sr-only" htmlFor="rental-search">
              Search rental items
            </label>
            <input
              id="rental-search"
              type="search"
              placeholder="What are we renting today?"
              value={searchText}
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Find my thing <span aria-hidden="true">↗</span>
            </button>
          </form>

          <div className="hero-actions">
            <button type="button" className="btn btn-hero" onClick={onBrowse}>
              Explore the goods <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="hero-owner-link" onClick={onOpenStore}>
              Got stuff to share? <strong>Open your store</strong>
            </button>
          </div>

          <div className="hero-proof" aria-label="Marketplace benefits">
            <span><b aria-hidden="true">✓</b> Local independent stores</span>
            <span><b aria-hidden="true">✓</b> Clear daily prices</span>
            <span><b aria-hidden="true">✓</b> Owner-approved requests</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Discover items available to rent">
          <div className="hero-photo" role="img" aria-label="Bright creative workspace" />
          <div className="hero-photo-shade" />
          <div className="hero-visual-caption">
            <span className="hero-caption-label">LESS STUFF, MORE STORIES</span>
            <strong>Borrow the vibe. Skip the clutter.</strong>
            <span>Your next little obsession is out there.</span>
          </div>
          <div className="hero-floating-card">
            <span className="hero-floating-icon" aria-hidden="true">✳</span>
            <div>
              <strong>A good find is calling</strong>
              <span>Discover something worth borrowing</span>
            </div>
          </div>
          <div className="hero-image-tag"><span /> Use more. Waste less.</div>
        </div>
      </div>
      <div className="hero-sticker" aria-hidden="true">rent the<br />good stuff <span>✳</span></div>
    </section>
  )
}

export default Hero
