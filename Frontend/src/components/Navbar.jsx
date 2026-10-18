import { useState } from 'react'

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
  const [menuOpen, setMenuOpen] = useState(false)

  function navigateTo(page) {
    setMenuOpen(false)
    onNavigate(page)
  }

  function openBookings() {
    setMenuOpen(false)
    onOpenBookings?.()
  }

  function openAdminBookings() {
    setMenuOpen(false)
    if (onOpenAdminBookings) onOpenAdminBookings()
    else onNavigate('admin-bookings')
  }

  function signOut() {
    setMenuOpen(false)
    onSignOut()
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button
          type="button"
          className="logo"
          onClick={() => navigateTo('home')}
          aria-label="Rentify home"
        >
          <span className="logo-mark" aria-hidden="true">R</span>
          Rentify
        </button>

        <button
          type="button"
          className="nav-menu-toggle"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="rentify-main-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" className={menuOpen ? 'menu-lines is-open' : 'menu-lines'}>
            <span />
            <span />
            <span />
          </span>
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
        </button>

        <nav
          id="rentify-main-navigation"
          className={menuOpen ? 'nav-links is-open' : 'nav-links'}
          aria-label="Main"
        >
          <button
            type="button"
            className={currentPage === 'home' ? 'nav-link active' : 'nav-link'}
            onClick={() => navigateTo('home')}
          >
            Home
          </button>

          <button
            type="button"
            className={currentPage === 'browse' ? 'nav-link active' : 'nav-link'}
            onClick={() => navigateTo('browse')}
          >
            Browse rentals
          </button>

          <button
            type="button"
            className={currentPage === 'stores' ? 'nav-link active' : 'nav-link'}
            onClick={() => navigateTo('stores')}
          >
            Explore stores
          </button>

          <button
            type="button"
            className={currentPage === 'my-rentals' ? 'nav-link active' : 'nav-link'}
            onClick={() => navigateTo('my-rentals')}
          >
            My rentals
          </button>

          <button
            type="button"
            className={currentPage === 'cart' ? 'nav-link active' : 'nav-link'}
            onClick={() => navigateTo('cart')}
          >
            Cart <span className="cart-count">({cartCount})</span>
          </button>

          {isLoggedIn && ownerHasStore && (
            <button
              type="button"
              className={currentPage === 'owner-bookings' ? 'nav-link active' : 'nav-link'}
              onClick={() => navigateTo('owner-bookings')}
            >
              Booking updates
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
              onClick={openBookings}
            >
              My requests
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
              onClick={() => navigateTo('my-stores')}
            >
              My stores
            </button>
          )}

          {isLoggedIn && userRole === 'admin' && (
            <button
              type="button"
              className={currentPage === 'admin-bookings' ? 'nav-link active' : 'nav-link'}
              onClick={openAdminBookings}
            >
              Admin bookings
            </button>
          )}

          <div className="mobile-nav-actions">
            {isLoggedIn ? (
              <button type="button" className="nav-link" onClick={signOut}>
                Sign out
              </button>
            ) : (
              <button type="button" className="nav-link" onClick={() => navigateTo('sign-in')}>
                Sign in
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigateTo(isLoggedIn ? 'create-store' : 'sign-up')}
            >
              List an item
            </button>
          </div>
        </nav>

        <div className="nav-actions">
          {isLoggedIn ? (
            <button type="button" className="nav-link" onClick={signOut}>
              Sign out
            </button>
          ) : (
            <button type="button" className="nav-link" onClick={() => navigateTo('sign-in')}>
              Sign in
            </button>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigateTo(isLoggedIn ? 'create-store' : 'sign-up')}
          >
            List an item
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
