
function Navbar({
  currentPage,
  onNavigate,
  isLoggedIn,
  onSignOut,
  cartCount = 0,
  userRole,
  onOpenBookings,
  onOpenAdminBookings,
  ownerBookingUpdates = 0,
  ownerHasStore = false,
}) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button
          type="button"
          className="logo"
          onClick={() => onNavigate('home')}
        >
          <span className="logo-mark">R</span>
          Rentify
        </button>

        <nav className="nav-links" aria-label="Main">
          <button
            type="button"
            className={currentPage === 'home' ? 'nav-link active' : 'nav-link'}
            onClick={() => onNavigate('home')}
          >
            Home
          </button>

          <button
            type="button"
            className={currentPage === 'browse' ? 'nav-link active' : 'nav-link'}
            onClick={() => onNavigate('browse')}
          >
            Browse Rentals
          </button>

          <button
            type="button"
            className={currentPage === 'stores' ? 'nav-link active' : 'nav-link'}
            onClick={() => onNavigate('stores')}
          >
            Explore Stores
          </button>

          <button
            type="button"
            className={currentPage === 'my-rentals' ? 'nav-link active' : 'nav-link'}
            onClick={() => onNavigate('my-rentals')}
          >
            My Rentals
          </button>

          <button
            type="button"
            className={currentPage === 'cart' ? 'nav-link active' : 'nav-link'}
            onClick={() => onNavigate('cart')}
          >
            Cart ({cartCount})
          </button>

          {isLoggedIn && ownerHasStore && (
            <button
              type="button"
              className={currentPage === 'owner-bookings' ? 'nav-link active' : 'nav-link'}
              onClick={() => onNavigate('owner-bookings')}
            >
              Booking Updates
              {ownerBookingUpdates > 0 && (
                <span className="nav-count" aria-label={ownerBookingUpdates + ' booking updates'}>
                  {ownerBookingUpdates}
                </span>
              )}
            </button>
          )}

          {isLoggedIn && onOpenBookings && (
            <button
              type="button"
              className={currentPage === 'my-bookings' ? 'nav-link active' : 'nav-link'}
              onClick={onOpenBookings}
            >
              My Requests
            </button>
          )}


          {isLoggedIn && (
            <button
              type="button"
              className={
                currentPage === 'dashboard' || currentPage === 'my-stores'
                  ? 'nav-link active'
                  : 'nav-link'
              }
              onClick={() => onNavigate('my-stores')}
            >
              My Stores
            </button>
          )}
        </nav>

        <div className="nav-actions">
          {isLoggedIn ? (
            <button
              type="button"
              className="nav-link"
              onClick={onSignOut}
            >
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              className="nav-link"
              onClick={() => onNavigate('sign-in')}
            >
              Sign In
            </button>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              onNavigate(isLoggedIn ? 'create-store' : 'sign-up')
            }
          >
            Open Your Store
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
