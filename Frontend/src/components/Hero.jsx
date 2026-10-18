import { useEffect, useRef } from 'react'
import { PRODUCT_CATEGORIES } from '../data/catalog'

function Hero({
  searchText,
  onSearchChange,
  onSearchSubmit,
  onOpenStore,
  onBrowse,
  onSelectCategory,
}) {
  const imageRef = useRef(null)

  useEffect(() => {
    const image = imageRef.current
    if (!image) return

    let frame = 0
    const updateParallax = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const section = image.closest('.hero-marketplace')
        if (!section) return
        const bounds = section.getBoundingClientRect()
        const offset = Math.max(-34, Math.min(34, -bounds.top * 0.12))
        image.style.transform = `translate3d(0, ${offset}px, 0) scale(1.08)`
      })
    }

    updateParallax()
    window.addEventListener('scroll', updateParallax, { passive: true })
    window.addEventListener('resize', updateParallax)
    return () => {
      window.removeEventListener('scroll', updateParallax)
      window.removeEventListener('resize', updateParallax)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    onSearchSubmit()
  }

  return (
    <section className="hero hero-marketplace" aria-labelledby="marketplace-intro">
      <div className="hero-marketplace-inner">
        <div className="marketplace-topline">
          <p>RENTAL MARKETPLACE</p>
          <button type="button" className="marketplace-list-link" onClick={onOpenStore}>
            Have something to rent? <span>List it ↗</span>
          </button>
        </div>

        <div className="marketplace-hero-layout">
          <div className="marketplace-hero-content">
            <p className="marketplace-eyebrow">LESS BUYING. MORE DOING.</p>
            <h1 id="marketplace-intro">What do you<br />need <em>today?</em></h1>
            <p className="marketplace-hero-description">
              Find useful things from local stores, for just the time you need them.
            </p>

            <form className="marketplace-search" onSubmit={handleSubmit} role="search">
              <label className="sr-only" htmlFor="rental-search">Search rental listings</label>
              <span className="marketplace-search-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <circle cx="10.8" cy="10.8" r="6.3" />
                  <path d="m15.5 15.5 4.2 4.2" />
                </svg>
              </span>
              <input
                id="rental-search"
                type="search"
                placeholder="Try “camera” or “power drill”"
                value={searchText}
                onChange={(event) => onSearchChange(event.target.value)}
              />
              <button type="submit">Search <span aria-hidden="true">→</span></button>
            </form>

            <div className="marketplace-categories">
              <span className="marketplace-category-label">QUICK BROWSE</span>
              <div className="marketplace-category-links">
                {PRODUCT_CATEGORIES.map((item) => (
                  <button key={item} type="button" onClick={() => onSelectCategory(item)}>
                    {item}<span aria-hidden="true">↗</span>
                  </button>
                ))}
                <button type="button" className="marketplace-all-link" onClick={onBrowse}>
                  All rentals <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </div>

          <div className="marketplace-visual">
            <div className="marketplace-image-window">
              <img
                ref={imageRef}
                src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1400&q=85"
                alt="Tools arranged on a workbench, ready for a project"
                loading="eager"
              />
              <span className="marketplace-image-index">01 / FIND YOUR NEXT TOOL</span>
            </div>
            <div className="marketplace-image-caption">
              <span>For the project, not the storage shelf.</span>
              <button type="button" onClick={onBrowse}>Explore rentals <span aria-hidden="true">↗</span></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
