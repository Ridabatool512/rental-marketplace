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
    { label: 'Electronics', value: 'Electronics', icon: '↗' },
    { label: 'Tools', value: 'Tools', icon: '⌁' },
    { label: 'Home essentials', value: 'Home Essentials', icon: '⌂' },
    { label: 'Vehicles', value: 'Vehicles', icon: '＋' },
  ]

  return (
    <section className="hero hero-human" aria-labelledby="hero-title">
      <div className="human-hero-inner">
        <div className="human-hero-copy">
          <p className="human-eyebrow"><span /> GOOD THINGS ARE BETTER SHARED</p>
          <h1 id="hero-title">Why buy it if you only need it <em>for a while?</em></h1>
          <p className="human-hero-description">
            From the camera for your next big idea to the tools for a weekend project,
            find useful things nearby and rent them for as long as you need.
          </p>

          <form className="human-search" onSubmit={handleSubmit} role="search">
            <span className="human-search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <circle cx="10.8" cy="10.8" r="6.3" />
                <path d="m15.5 15.5 4.2 4.2" />
              </svg>
            </span>
            <label className="sr-only" htmlFor="rental-search">Search rental items</label>
            <input
              id="rental-search"
              type="search"
              placeholder="What do you need to rent?"
              value={searchText}
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <div className="human-hero-actions">
            <button type="button" className="human-primary-action" onClick={onBrowse}>
              Explore Rentals <span aria-hidden="true">↗</span>
            </button>
            <button type="button" className="human-secondary-action" onClick={onOpenStore}>
              Have something to share? <strong>List an Item</strong>
            </button>
          </div>

          <div className="human-category-area">
            <p>Start with what you need</p>
            <div className="human-category-list">
              {categories.map((item) => (
                <button key={item.value} type="button" onClick={() => onSelectCategory(item.value)}>
                  <span aria-hidden="true">{item.icon}</span>
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
            <span>FOR THE THINGS YOU DO</span>
            <p>Big plans. One-off projects. Everyday life.</p>
          </div>
          <span className="human-photo-index" aria-hidden="true">01 / FIND YOUR NEXT THING</span>
        </div>
      </div>
      <div className="human-hero-bottom" aria-hidden="true">
        <span>USE IT WHEN YOU NEED IT</span><span className="human-bottom-line" /><span>PASS IT ON WHEN YOU DON'T</span>
      </div>
    </section>
  )
}

export default Hero
