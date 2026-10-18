function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand-block">
          <button type="button" className="logo footer-logo" onClick={() => onNavigate('home')} aria-label="Rentify home">
            <span className="logo-mark" aria-hidden="true">R</span>
            Rentify
          </button>
          <p>Get more out of the things around you. Rent what you need, and make room for what comes next.</p>
        </div>
        <div className="footer-link-column">
          <p className="footer-column-label">EXPLORE</p>
          <div className="footer-links">
            <button type="button" onClick={() => onNavigate('home')}>Home</button>
            <button type="button" onClick={() => onNavigate('browse')}>Browse rentals</button>
            <button type="button" onClick={() => onNavigate('stores')}>Explore stores</button>
          </div>
        </div>
        <div className="footer-link-column">
          <p className="footer-column-label">YOUR ACCOUNT</p>
          <div className="footer-links">
            <button type="button" onClick={() => onNavigate('my-rentals')}>My rentals</button>
            <button type="button" onClick={() => onNavigate('create-store')}>List an item</button>
          </div>
        </div>
        <div className="footer-copy">
          <span>RENTIFY · A MARKETPLACE FOR EVERYDAY RENTALS</span>
          <span>© {new Date().getFullYear()} Rentify</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
