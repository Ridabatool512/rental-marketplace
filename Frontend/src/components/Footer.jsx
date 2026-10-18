function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand-block">
          <p className="logo footer-logo">
            <span className="logo-mark" aria-hidden="true">R</span>
            Rentify
          </p>
          <p>A borrowing marketplace for useful things, good plans, and giving well-made items another life.</p>
        </div>
        <div className="footer-link-column">
          <p className="footer-column-label">FIND YOUR THING</p>
          <div className="footer-links">
            <button type="button" onClick={() => onNavigate('home')}>Home</button>
            <button type="button" onClick={() => onNavigate('browse')}>Browse rentals</button>
            <button type="button" onClick={() => onNavigate('stores')}>Explore stores</button>
          </div>
        </div>
        <div className="footer-link-column">
          <p className="footer-column-label">YOUR RENTIFY</p>
          <div className="footer-links">
            <button type="button" onClick={() => onNavigate('my-rentals')}>My rentals</button>
            <button type="button" onClick={() => onNavigate('create-store')}>List your item</button>
          </div>
        </div>
        <div className="footer-copy">
          <span>EST. 2024 — A BORROWING MARKETPLACE</span>
          <span>© 2026 Rentify. Own less. Experience more.</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
