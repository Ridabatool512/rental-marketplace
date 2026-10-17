function Hero({
  searchText,
  onSearchChange,
  onSearchSubmit,
  onOpenStore,
}) {
  function handleSubmit(event) {
    event.preventDefault()
    onSearchSubmit()
  }

  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Peer-to-peer rentals</p>
        <h1>Find What You Need. Rent What You Don&apos;t.</h1>
        <p className="hero-text">
          Browse stores opened by people on Rentify, or create your own shop
          and list the gear you are ready to rent.
        </p>

        <form className="search-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="rental-search">
            Search rental items
          </label>
          <input
            id="rental-search"
            type="search"
            placeholder="Search products added by stores..."
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        <div className="hero-cta">
          <button type="button" className="btn btn-hero" onClick={onOpenStore}>
            Open Your Store
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
