function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <p className="logo footer-logo">
            <span className="logo-mark">R</span>
            Rentify
          </p>
          <p>A local marketplace for finding useful things and giving good items another life.</p>
        </div>
        <div className="footer-links">
          <button type="button" onClick={() => onNavigate('home')}>
            Home
          </button>
          <button type="button" onClick={() => onNavigate('browse')}>
            Browse Rentals
          </button>
          <button type="button" onClick={() => onNavigate('stores')}>
            Explore Stores
          </button>
          <button type="button" onClick={() => onNavigate('my-rentals')}>
            My Rentals
          </button>
          <button type="button" onClick={() => onNavigate('create-store')}>
            Open Your Store
          </button>
        </div>
        <p className="footer-copy">© 2026 Rentify. Own less. Experience more.</p>
      </div>
    </footer>
  )
}

export default Footer
