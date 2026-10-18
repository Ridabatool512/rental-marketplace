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
            THE SMARTER WAY TO RENT
          </div>
          <h1>Good things don&apos;t have to be <span>owned.</span></h1>
          <p className="hero-text">
            Discover useful things from independent stores near you. Rent what
            you need, when you need it — without the long-term commitment.
          </p>

          <form className="search-form" onSubmit={handleSubmit}>
            <span className="hero-search-icon" aria-hidden="true">⌕</span>
            <label className="sr-only" htmlFor="rental-search">
              Search rental items
            </label>
            <input
              id="rental-search"
              type="search"
              placeholder="What are you looking to rent?"
              value={searchText}
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Search rentals <span aria-hidden="true">↗</span>
            </button>
          </form>

          <div className="hero-actions">
            <button type="button" className="btn btn-hero" onClick={onBrowse}>
              Explore marketplace <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="hero-owner-link" onClick={onOpenStore}>
              Have something to rent? <strong>Open your store</strong>
            </button>
          </div>

          <div className="hero-proof" aria-label="Marketplace benefits">
            <span><b aria-hidden="true">✓</b> Independent stores</span>
            <span><b aria-hidden="true">✓</b> Clear daily pricing</span>
            <span><b aria-hidden="true">✓</b> Owner-approved requests</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Discover items available to rent">
          <div className="hero-photo" role="img" aria-label="Modern workspace with items ready to use" />
          <div className="hero-photo-shade" />
          <div className="hero-visual-caption">
            <span className="hero-caption-label">MAKE ROOM FOR MORE</span>
            <strong>Use it. Enjoy it. Return it.</strong>
            <span>Simple rentals for everyday life.</span>
          </div>
          <div className="hero-floating-card">
            <span className="hero-floating-icon" aria-hidden="true">↗</span>
            <div>
              <strong>Find your next essential</strong>
              <span>Browse products from local stores</span>
            </div>
          </div>
          <div className="hero-image-tag"><span /> More use. Less waste.</div>
        </div>
      </div>
    </section>
  )
}

export default Hero
