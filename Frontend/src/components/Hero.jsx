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
    { label: 'Electronics', value: 'Electronics', icon: '✳' },
    { label: 'Tools & DIY', value: 'Tools', icon: '⌁' },
    { label: 'Home essentials', value: 'Home Essentials', icon: '⌂' },
    { label: 'Vehicles', value: 'Vehicles', icon: '↗' },
  ]

  return (
    <section className="hero hero-refined" aria-labelledby="hero-title">
      <div className="refined-hero-inner">
        <div className="refined-hero-copy">
          <p className="refined-eyebrow"><span /> THE RENTAL MARKETPLACE</p>
          <h1 id="hero-title">Make room for <em>more.</em></h1>
          <p className="refined-hero-description">
            From everyday essentials to once-in-a-while adventures, find what
            you need without buying what you don't.
          </p>

          <form className="refined-search" onSubmit={handleSubmit} role="search">
            <span className="refined-search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <circle cx="10.8" cy="10.8" r="6.3" />
                <path d="m15.5 15.5 4.2 4.2" />
              </svg>
            </span>
            <label className="sr-only" htmlFor="rental-search">Search rental items</label>
            <input
              id="rental-search"
              type="search"
              placeholder="Try camera, drill, sofa..."
              value={searchText}
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <button type="submit">Search rentals <span aria-hidden="true">↗</span></button>
          </form>

          <div className="refined-hero-actions">
            <button type="button" className="refined-primary-link" onClick={onBrowse}>
              Explore all rentals <span aria-hidden="true">→</span>
            </button>
            <span className="refined-divider" />
            <button type="button" className="refined-secondary-link" onClick={onOpenStore}>
              Have something to rent? <strong>List it</strong>
            </button>
          </div>

          <div className="refined-category-area">
            <p>Explore by category</p>
            <div className="refined-category-list">
              {categories.map((item) => (
                <button key={item.value} type="button" onClick={() => onSelectCategory(item.value)}>
                  <span className="refined-category-icon" aria-hidden="true">{item.icon}</span>
                  {item.label}
                  <span className="refined-category-arrow" aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="refined-hero-visual">
          <div className="refined-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1300&q=88"
              alt="Warm, thoughtfully furnished living space"
              fetchPriority="high"
              decoding="async"
            />
            <div className="refined-image-shade" />
            <div className="refined-image-caption">
              <span>NEED IT FOR A LITTLE WHILE?</span>
              <strong>Find your kind of useful.</strong>
            </div>
          </div>
          <div className="refined-float-card">
            <span className="refined-float-icon">↗</span>
            <div>
              <strong>Use more. Own less.</strong>
              <span>A smarter way to get things done.</span>
            </div>
          </div>
          <div className="refined-visual-note"><span /> GOOD THINGS CIRCULATE</div>
        </div>
      </div>
    </section>
  )
}

export default Hero
