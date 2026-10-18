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
          <p className="hero-kicker">RENTIFY <span>— A smarter way to get the good stuff</span></p>
          <h1>Need it for a while? <span>Rent it.</span></h1>
          <p className="hero-text">
            Cameras for a trip, a drill for one weekend, a chair for your new place.
            Find useful things from local stores without buying them for good.
          </p>

          <form className="search-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="rental-search">Search rental items</label>
            <input
              id="rental-search"
              type="search"
              placeholder="What do you need to rent?"
              value={searchText}
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search rentals</button>
          </form>

          <div className="hero-actions">
            <button type="button" className="btn btn-hero" onClick={onBrowse}>
              Browse all items <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="hero-owner-link" onClick={onOpenStore}>
              Have something to rent? <strong>List it here</strong>
            </button>
          </div>

          <div className="hero-proof" aria-label="Marketplace benefits">
            <span>Local independent stores</span>
            <span>Upfront daily prices</span>
            <span>Requests approved by owners</span>
          </div>
        </div>

        <div className="hero-visual">
          <img
            className="hero-photo"
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85"
            alt="A comfortable, sunlit living room"
          />
          <p className="hero-image-caption">Good things are better when shared.</p>
        </div>
      </div>
    </section>
  )
}

export default Hero
