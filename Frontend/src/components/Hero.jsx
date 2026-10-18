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
            THE RENTAL CLUB <span className="hero-kicker-note">✳ good finds only</span>
          </div>
          <h1>Your next obsession, <span>on your terms.</span></h1>
          <p className="hero-text">
            Big plans, tiny budgets, zero clutter. Find the things you want
            from independent stores — rent them for a while, then pass them on.
          </p>

          <form className="search-form" onSubmit={handleSubmit}>
            <span className="hero-search-icon" aria-hidden="true">⌕</span>
            <label className="sr-only" htmlFor="rental-search">
              Search rental items
            </label>
            <input
              id="rental-search"
              type="search"
              placeholder="Try camera, outfit, furniture..."
              value={searchText}
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Find my fave <span aria-hidden="true">↗</span>
            </button>
          </form>

          <div className="hero-actions">
            <button type="button" className="btn btn-hero" onClick={onBrowse}>
              Explore rentals <span aria-hidden="true">↗</span>
            </button>
            <button type="button" className="hero-owner-link" onClick={onOpenStore}>
              Got good stuff? <strong>Put it up for rent</strong>
            </button>
          </div>

          <div className="hero-proof" aria-label="Marketplace benefits">
            <span><b aria-hidden="true">✓</b> Local finds</span>
            <span><b aria-hidden="true">✓</b> Clear daily prices</span>
            <span><b aria-hidden="true">✓</b> Owner-approved rentals</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Discover stylish items available to rent">
          <div className="hero-photo" role="img" aria-label="A curated, stylish modern interior" />
          <div className="hero-photo-shade" />
          <div className="hero-visual-caption">
            <span className="hero-caption-label">YOUR NEXT LITTLE YES</span>
            <strong>Try the thing. Live the moment.</strong>
            <span>Keep the memories, not the clutter.</span>
          </div>
          <div className="hero-floating-card">
            <span className="hero-floating-icon" aria-hidden="true">✳</span>
            <div>
              <strong>It's giving main character</strong>
              <span>Find your next favourite thing</span>
            </div>
          </div>
          <div className="hero-image-tag"><span /> Rent it. Make it yours.</div>
        </div>
      </div>
      <div className="hero-sticker" aria-hidden="true"><span>LESS BUYING</span><b>MORE</b><span>TRYING ✳</span></div>
    </section>
  )
}

export default Hero
