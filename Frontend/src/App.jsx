
import { useEffect, useMemo, useState } from 'react'
import AuthForm from './components/AuthForm'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import './App.css'
import CategoryFilter from './components/CategoryFilter'
import RentalGrid from './components/RentalGrid'
import RentalModal from './components/RentalModal'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'
import StoreGrid from './components/StoreGrid'
import StoreForm from './components/StoreForm'
import ProductForm from './components/ProductForm'
import StoreDashboard from './components/StoreDashboard'
import StorePage from './components/StorePage'
import CartPage from './components/CartPage'
import CheckoutPage from './components/CheckoutPage'
import AdminBookings from './components/AdminBookings'
import MyBookings from './components/MyBookings'
import OwnerBookings from './components/OwnerBookings'
import api from './api/axios'


import {
  createId,
  filterProducts,
  productsWithStoreInfo,
} from './data/catalog'
import {
  loadProducts,
  loadStores,
  saveProducts,
  saveStores,
} from './data/storage'

function mapBackendListing(listing) {
  return {
    id: String(listing._id || listing.id || ''),
    backendListing: true,
    name: listing.title,
    description: listing.description,
    category: listing.category
      ? listing.category.replace(/\b\w/g, (letter) => letter.toUpperCase())
      : 'Other',
    image: listing.images?.[0] || '',
    images: listing.images || [],
    pricePerDay: listing.pricePerDay,
    quantity: Number(listing.quantity ?? 1),
    status: listing.status,
    available: listing.status === 'available' && Number(listing.quantity ?? 1) > 0,
    storeName: listing.store?.name || listing.owner?.name || 'Rental owner',
    location: listing.store?.location || listing.location || '',
    storeId: String(listing.store?._id || listing.store || ''),
    ownerId: String(listing.owner?._id || listing.owner || ''),
    storeCategory: listing.store?.category || 'General',
  }
}

function mapBackendStore(store) {
  return {
    id: String(store._id || store.id || ''),
    name: store.name,
    description: store.description || '',
    location: store.location || '',
    category: store.category || 'General',
    coverImage: store.coverImage || '',
    ownerId: String(store.owner?._id || store.owner || store.ownerId || ''),
    ownerName: store.owner?.name || '',
    backendStore: true,
  }
}

function App() {
  const [page, setPage] = useState(() => window.location.hash.toLowerCase() === '#admin' ? 'admin-bookings' : 'home')

  const [currentUser, setCurrentUser] = useState(() => {
    if (!sessionStorage.getItem('token')) return null
    try {
      return JSON.parse(sessionStorage.getItem('rentifyUser')) || null
    } catch {
      return null
    }
  })

  const [afterAuthPage, setAfterAuthPage] = useState('create-store')
  const [stores, setStores] = useState([])
  const [products, setProducts] = useState(() => loadProducts())
  const [backendListings, setBackendListings] = useState([])
  const [isLoadingListings, setIsLoadingListings] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)
  const [savedRentals, setSavedRentals] = useState(() => {
    try {
      const saved = localStorage.getItem('rentifySavedRentals')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('rentifySavedRentals', JSON.stringify(savedRentals))
    } catch {
      // Saved rentals remain available in the current session if storage is unavailable.
    }
  }, [savedRentals])
  const [cartItems, setCartItems] = useState([])
  const [checkoutItems, setCheckoutItems] = useState([])
  const [orders, setOrders] = useState([])
  const [activeStoreId, setActiveStoreId] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [ownerBookingUpdates, setOwnerBookingUpdates] = useState(0)

  useEffect(() => {
    function handleHashChange() {
      if (window.location.hash.toLowerCase() === '#admin') {
        if (currentUser?.role === 'admin') {
          setPage('admin-bookings')
        } else if (!currentUser) {
          setAfterAuthPage('admin-bookings')
          setPage('sign-in')
        } else {
          setStatusMessage('Access denied. This page is only available to admins.')
          setPage('home')
          window.location.hash = ''
        }
      } else if (page === 'admin-bookings') {
        setPage('home')
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    if (window.location.hash.toLowerCase() === '#admin') {
      handleHashChange()
    }

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [currentUser, page])

  useEffect(() => {
    let active = true

    async function loadBackendData() {
      try {
        const response = await api.get('/listings?limit=50')
        if (active) {
          const publicListings = (response.data.listings || []).map(mapBackendListing)
          setBackendListings((current) => {
            const merged = new Map(current.map((listing) => [listing.id, listing]))
            publicListings.forEach((listing) => merged.set(listing.id, listing))
            return Array.from(merged.values())
          })
        }
      } catch (error) {
        if (active) {
          setStatusMessage(error.response?.data?.message || 'Could not load rentals from the server.')
        }
      } finally {
        if (active) setIsLoadingListings(false)
      }
    }

    loadBackendData()

    // Load all of the signed-in owner's listings, including unavailable ones,
    // so the store dashboard can manage the complete inventory.
    if (sessionStorage.getItem('token')) {
      api.get('/listings/my')
        .then((response) => {
          if (!active) return
          const ownedListings = (response.data.listings || []).map(mapBackendListing)
          setBackendListings((current) => {
            const merged = new Map(current.map((listing) => [listing.id, listing]))
            ownedListings.forEach((listing) => merged.set(listing.id, listing))
            return Array.from(merged.values())
          })
        })
        .catch((error) => {
          if (active) setStatusMessage(error.response?.data?.message || 'Could not load your store inventory.')
        })
    }

    api.get('/stores')
      .then((response) => {
        if (!active) return
        const remoteStores = (response.data.stores || []).map(mapBackendStore)
        const legacyStores = loadStores().map((store) => ({
          ...store,
          id: String(store.id || ''),
          ownerId: String(store.ownerId || ''),
          backendStore: false,
        }))
        const remoteKeys = new Set(
          remoteStores.map((store) => `${store.name.trim().toLowerCase()}|${store.location.trim().toLowerCase()}`),
        )
        const uniqueLegacyStores = legacyStores.filter((store) => {
          const key = `${String(store.name || '').trim().toLowerCase()}|${String(store.location || '').trim().toLowerCase()}`
          return store.id && !remoteKeys.has(key)
        })
        setStores([...remoteStores, ...uniqueLegacyStores])
      })
      .catch((error) => {
        if (!active) return
        const legacyStores = loadStores().map((store) => ({
          ...store,
          id: String(store.id || ''),
          ownerId: String(store.ownerId || ''),
          backendStore: false,
        }))
        setStores(legacyStores)
        setStatusMessage(error.response?.data?.message || 'Could not load stores from the server. Showing stores saved in this browser.')
      })

    const token = sessionStorage.getItem('token')
    if (token) {
      api.get('/auth/me')
        .then((response) => {
          if (!active) return
          setCurrentUser(response.data.user)
          sessionStorage.setItem('rentifyUser', JSON.stringify(response.data.user))
        })
        .catch(() => {
          if (!active) return
          sessionStorage.removeItem('token')
          sessionStorage.removeItem('rentifyUser')
          setCurrentUser(null)
        })
    }

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!currentUser || !sessionStorage.getItem('token')) {
      setOwnerBookingUpdates(0)
      return
    }

    let active = true
    const loadOwnerUpdates = async () => {
      try {
        const response = await api.get('/bookings/received')
        if (!active) return
        const updates = (response.data.bookings || []).filter(
          (booking) => ['approved', 'rejected'].includes(booking.status),
        )
        setOwnerBookingUpdates(updates.length)
      } catch {
        if (active) setOwnerBookingUpdates(0)
      }
    }

    loadOwnerUpdates()
    const intervalId = window.setInterval(loadOwnerUpdates, 30000)
    window.addEventListener('focus', loadOwnerUpdates)

    return () => {
      active = false
      window.clearInterval(intervalId)
      window.removeEventListener('focus', loadOwnerUpdates)
    }
  }, [currentUser])

  const localProductsForDisplay = useMemo(
    () => productsWithStoreInfo(products, stores),
    [products, stores],
  )

  // The public marketplace uses MongoDB listings returned by the backend.
  const productsForDisplay = backendListings

  const visibleProducts = useMemo(
    () => filterProducts(productsForDisplay, searchText, category),
    [productsForDisplay, searchText, category],
  )

  const activeStore =
    stores.find((store) => String(store.id) === String(activeStoreId)) || null

  const storeProducts = activeStore
    ? (activeStore.backendStore ? backendListings : localProductsForDisplay).filter((item) => {
        if (String(item.storeId) === String(activeStore.id)) return true
        if (activeStore.ownerId && item.ownerId && String(item.ownerId) === String(activeStore.ownerId)) {
          return String(item.storeName || '').trim().toLowerCase() === String(activeStore.name || '').trim().toLowerCase()
        }
        return false
      })
    : []

  const myStores = stores.filter(
    (store) => String(store.ownerId) === String(currentUser?.id),
  )

  function goTo(nextPage) {
    if (nextPage === 'admin-bookings') {
      if (currentUser?.role === 'admin') {
        window.location.hash = 'admin'
        setPage('admin-bookings')
      } else if (!currentUser) {
        window.location.hash = 'admin'
        setAfterAuthPage('admin-bookings')
        setPage('sign-in')
      } else {
        setStatusMessage('Access denied. This page is only available to admins.')
        setPage('home')
      }
    } else {
      if (window.location.hash.toLowerCase() === '#admin') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
      }

      if (nextPage === 'create-store' && !currentUser) {
        setAfterAuthPage('create-store')
        setPage('sign-up')
      } else if (nextPage === 'my-stores' && !currentUser) {
        setAfterAuthPage('my-stores')
        setPage('sign-in')
      } else {
        setPage(nextPage)
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleSignOut() {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('rentifyUser')
    setCurrentUser(null)
    setActiveStoreId(null)
    setStatusMessage('You have signed out.')
    setPage('home')
  }

  async function handleSignUp(formData) {
    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      sessionStorage.setItem('token', response.data.token)
      sessionStorage.setItem('rentifyUser', JSON.stringify(response.data.user))
      setCurrentUser(response.data.user)
      setStatusMessage('Account created successfully.')
      setPage(afterAuthPage)
    } catch (error) {
      window.alert(error.response?.data?.message || 'Could not create your account. Please try again.')
    }
  }

  async function handleSignIn(formData) {
    try {
      const isAdminLogin = afterAuthPage === 'admin-bookings'
      const loginEndpoint = isAdminLogin ? '/auth/admin/login' : '/auth/login'
      const response = await api.post(loginEndpoint, {
        email: formData.email,
        password: formData.password,
      })
      sessionStorage.setItem('token', response.data.token)
      sessionStorage.setItem('rentifyUser', JSON.stringify(response.data.user))
      setCurrentUser(response.data.user)
      setStatusMessage('Signed in successfully.')
      setPage(afterAuthPage)
    } catch (error) {
      window.alert(error.response?.data?.message || 'Email or password is incorrect.')
    }
  }

  function openDashboard(storeId) {
    const store = stores.find((item) => String(item.id) === String(storeId))

    if (!currentUser) {
      setAfterAuthPage('my-stores')
      setPage('sign-in')
      return
    }

    if (!store || String(store.ownerId) !== String(currentUser.id)) {
      setStatusMessage('You can only manage your own stores.')
      goTo('my-stores')
      return
    }

    setActiveStoreId(storeId)
    setEditingProduct(null)
    goTo('dashboard')
  }

  function openPublicStore(storeOrProduct) {
    const isProduct = storeOrProduct && typeof storeOrProduct === 'object'
    const requestedStoreId = String(isProduct ? storeOrProduct.storeId || '' : storeOrProduct || '')
    let store = stores.find((item) => requestedStoreId && String(item.id) === requestedStoreId)

    // Some older listings may not have a store ID. Resolve only when the
    // product's store name/location identifies a store unambiguously.
    if (!store && isProduct) {
      const productStoreName = String(storeOrProduct.storeName || '').trim().toLowerCase()
      const productLocation = String(storeOrProduct.location || '').trim().toLowerCase()
      const matches = stores.filter((item) =>
        productStoreName &&
        String(item.name || '').trim().toLowerCase() === productStoreName &&
        (!productLocation || String(item.location || '').trim().toLowerCase() === productLocation)
      )
      if (matches.length === 1) store = matches[0]
    }

    if (!store) {
      setSelectedItem(null)
      setStatusMessage('This product is not linked to a store yet. Please open Store Explorer to choose a store.')
      goTo('stores')
      return
    }

    setActiveStoreId(String(store.id))
    setSelectedItem(null)
    goTo('store-page')
  }

  function handleSearchSubmit() {
    goTo('browse')
  }

  async function handleCreateStore(formData) {
    if (!currentUser) {
      setAfterAuthPage('create-store')
      setPage('sign-up')
      return
    }

    try {
      const response = await api.post('/stores', formData)
      const newStore = mapBackendStore(response.data.store)
      setStores((current) => [newStore, ...current])
      setActiveStoreId(newStore.id)
      setEditingProduct(null)
      setStatusMessage(newStore.name + ' was created successfully.')
      setPage('dashboard')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      window.alert(error.response?.data?.message || 'Could not create your store.')
    }
  }

  async function handleUpdateStore(formData) {
    if (!activeStore || String(activeStore.ownerId) !== String(currentUser?.id)) {
      goTo('my-stores')
      return
    }

    try {
      const response = await api.put('/stores/' + activeStore.id, formData)
      const updatedStore = mapBackendStore(response.data.store)
      setStores((current) => current.map((store) => String(store.id) === String(updatedStore.id) ? updatedStore : store))
      setStatusMessage('Store details were updated.')
      goTo('dashboard')
    } catch (error) {
      window.alert(error.response?.data?.message || 'Could not update this store.')
    }
  }

  async function handleDeleteStore() {
    if (!activeStore || activeStore.ownerId !== currentUser?.id) {
      goTo('my-stores')
      return
    }

    const confirmed = window.confirm(
      `Delete ${activeStore.name}? All of its products will also be removed.`,
    )

    if (!confirmed) return

    try {
      await api.delete('/stores/' + activeStore.id)
      setStores((current) => current.filter((store) => store.id !== activeStore.id))
      setBackendListings((current) => current.filter((item) => item.storeId !== activeStore.id))
      setProducts((current) => current.filter((item) => item.storeId !== activeStore.id))
      setSavedRentals((current) => current.filter((item) => item.storeId !== activeStore.id))
      setActiveStoreId(null)
      setStatusMessage('The store and its products were removed.')
      goTo('my-stores')
    } catch (error) {
      window.alert(error.response?.data?.message || 'Could not delete this store.')
    }
  }

  async function handleSaveProduct(formData) {
    if (!activeStore || activeStore.ownerId !== currentUser?.id) {
      goTo('my-stores')
      return
    }

    const listingData = {
      title: formData.name,
      description: formData.description,
      category: formData.category,
      images: formData.images || (formData.image ? [formData.image] : []),
      condition: 'good',
      pricePerDay: Number(formData.pricePerDay),
      quantity: Number(formData.quantity),
      location: activeStore.location,
      status: Number(formData.quantity) === 0 ? 'rented' : formData.available ? 'available' : 'unavailable',
    }

    try {
      if (editingProduct?.backendListing) {
        const response = await api.put(`/listings/${editingProduct.id}`, listingData)
        const updated = {
          ...mapBackendListing(response.data.listing),
          storeName: activeStore.name,
          storeId: activeStore.id,
          location: activeStore.location,
        }
        setBackendListings((current) => current.map((item) => item.id === updated.id ? updated : item))
        setProducts((current) => current.map((item) => item.id === editingProduct.id ? { ...item, ...formData } : item))
        setStatusMessage('Listing updated successfully.')
      } else {
        const response = await api.post('/listings', { ...listingData, storeId: activeStore.id })
        const created = {
          ...mapBackendListing(response.data.listing),
          storeName: activeStore.name,
          storeId: activeStore.id,
          location: activeStore.location,
        }
        setBackendListings((current) => [created, ...current])
        const localProduct = {
          id: created.id,
          storeId: activeStoreId,
          ...formData,
          backendListing: true,
        }
        setProducts((current) => [...current, localProduct])
        setStatusMessage('Listing saved to the marketplace.')
      }

      setEditingProduct(null)
      goTo('dashboard')
    } catch (error) {
      window.alert(error.response?.data?.message || 'Could not save the listing. Please check that you are signed in.')
    }
  }

  function handleRemoveProduct(item) {
    if (
      !activeStore ||
      activeStore.ownerId !== currentUser?.id ||
      item.storeId !== activeStoreId
    ) {
      goTo('my-stores')
      return
    }
  
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"? It will disappear from your store and the marketplace.`,
    )
    
    if (!confirmed) return
    if (item.backendListing) {
      api.delete(`/listings/${item.id}`)
        .then(() => {
          setBackendListings((current) => current.filter((product) => product.id !== item.id))
          setProducts((current) => current.filter((product) => product.id !== item.id))
          setSavedRentals((current) => current.filter((product) => product.id !== item.id))
          setSelectedItem(null)
          setStatusMessage(`${item.name} was removed.`)
        })
        .catch((error) => window.alert(error.response?.data?.message || 'Could not delete this listing.'))
      return
    }

    setProducts((current) => current.filter((product) => product.id !== item.id))
    setSavedRentals((current) => current.filter((product) => product.id !== item.id))
    setSelectedItem(null)
    setStatusMessage(`${item.name} was removed.`)
  }

  function handleSaveRental(item) {
    setSavedRentals((current) => {
      if (current.some((saved) => saved.id === item.id)) {
        return current
      }

      return [...current, item]
    })

    setSelectedItem(null)
    goTo('my-rentals')
  }
   

  function handleAddToCart(item) {
    if (!item || !item.available) {
      setStatusMessage('This item is currently unavailable.')
      return
    }
  
    setCartItems((current) => {
      const existingItem = current.find(
        (cartItem) => cartItem.id === item.id
      )
  
      if (existingItem) {
        setStatusMessage(`${item.name} is already in your cart.`)
        return current
      }
  
      setStatusMessage(`${item.name} added to your cart.`)
  
      return [...current, { ...item, days: 1 }]
    })
  }
  
  function handleRentNow(item) {
    if (!item || !item.available) {
      setStatusMessage('This item is currently unavailable.')
      return
    }
  
    setCheckoutItems([{ ...item, days: 1 }])
    setSelectedItem(null)
    goTo('checkout')
  }
  

function handleOpenCart() {
  setCheckoutItems([])
  goTo('cart')
}


function handleUpdateCartDays(itemId, days) {
  setCartItems((current) =>
    current.map((item) =>
      item.id === itemId ? { ...item, days } : item
    )
  )
}

function handleRemoveFromCart(itemId) {
  setCartItems((current) =>
    current.filter((item) => item.id !== itemId)
  )
}


async function handlePlaceOrder(customerDetails) {
  if (!currentUser || !sessionStorage.getItem('token')) {
    setAfterAuthPage('checkout')
    setPage('sign-in')
    setStatusMessage('Please sign in before sending a rental request.')
    return
  }

  const startDate = customerDetails.startDate
  const endDate = customerDetails.endDate
  if (!startDate || !endDate || endDate <= startDate) {
    window.alert('Please choose a valid rental start and end date.')
    return
  }

  try {
    const createdBookings = []
    for (const item of checkoutItems) {
      if (!item.backendListing) {
        throw new Error(`"${item.name}" is not a server listing yet. Please select a listing from the marketplace.`)
      }
      const response = await api.post('/bookings', {
        listingId: item.id,
        startDate,
        endDate,
        phone: customerDetails.phone,
        address: customerDetails.address,
        notes: customerDetails.notes,
        paymentMethod: customerDetails.paymentMethod,
      })
      createdBookings.push(response.data.booking)
    }

    const itemIds = new Set(checkoutItems.map((item) => item.id))
    setCartItems((current) => current.filter((item) => !itemIds.has(item.id)))
    setCheckoutItems([])
    setStatusMessage(`Submitted ${createdBookings.length} rental request(s). Status: waiting for the store owner to approve.`)
    goTo('my-bookings')
  } catch (error) {
    window.alert(error.response?.data?.message || error.message || 'Could not submit the rental request.')
  }
}


  const alreadySaved = selectedItem
    ? savedRentals.some((saved) => saved.id === selectedItem.id)
    : false

  return (
    <div className="app">
      
<Navbar
  currentPage={page}
  onNavigate={goTo}
  isLoggedIn={Boolean(currentUser)}
  onSignOut={handleSignOut}
  cartCount={cartItems.length}
  onOpenCart={handleOpenCart}
  userRole={currentUser?.role}
  onOpenBookings={() => goTo('my-bookings')}
  onOpenAdminBookings={() => goTo('admin-bookings')}
  ownerBookingUpdates={ownerBookingUpdates}
  ownerHasStore={myStores.length > 0}
/>

      {statusMessage &&
        page !== 'create-store' &&
        page !== 'edit-store' &&
        page !== 'product-form' && (
          <p className="status-banner">{statusMessage}</p>
        )}

      {page === 'home' && (
        <main>
          <Hero
            searchText={searchText}
            onSearchChange={setSearchText}
            onSearchSubmit={handleSearchSubmit}
            onOpenStore={() => goTo('create-store')}
            onBrowse={() => goTo('browse')}
            onSelectCategory={(nextCategory) => {
              setCategory(nextCategory)
              goTo('browse')
            }}
          />

        

          <section className="listings marketplace">
            <div className="section-heading">
              <p className="eyebrow">The good stuff, nearby</p>
              <h2>Find what you came for.</h2>
              <p className="section-description">Browse the listings. Compare daily prices. Pick what works for you.</p>
            </div>

            <CategoryFilter
              selectedCategory={category}
              onSelectCategory={setCategory}
            />

            <RentalGrid
              items={visibleProducts}
              onViewDetails={setSelectedItem}
              onAddToCart={handleAddToCart}
              onRentNow={handleRentNow}
              loading={isLoadingListings}
            emptyTitle={isLoadingListings ? 'Loading rentals...' : 'No server listings yet'}
              emptyText={isLoadingListings ? 'Getting available rentals from the server.' : 'Sign in and open your store to add the first rental listing.'}
              emptyActionLabel="Open Your Store"
              onEmptyAction={
                products.length === 0
                  ? () => goTo('create-store')
                  : undefined
              }
            />
          </section>

          <section className="rental-confidence" aria-labelledby="rental-confidence-title">
            <div className="confidence-heading">
              <p className="eyebrow">No surprises</p>
              <h2 id="rental-confidence-title">Know what happens next.</h2>
              <p>See the listed daily price, send your dates, and wait for the store owner to review your request before it is confirmed.</p>
            </div>
            <div className="confidence-points">
              <article>
                <span className="confidence-number">01</span>
                <h3>See the daily price</h3>
                <p>Every rental card shows the listed price per day before you send a request.</p>
              </article>
              <article>
                <span className="confidence-number">02</span>
                <h3>The owner reviews it</h3>
                <p>Your request waits for the store owner to approve or decline it.</p>
              </article>
              <article>
                <span className="confidence-number">03</span>
                <h3>Choose your dates</h3>
                <p>Share your rental dates and the details requested at checkout before submitting.</p>
              </article>
            </div>
          </section>

          <HowItWorks />
        </main>
      )}

      {page === 'browse' && (
        <main className="page">
          <div className="section-heading">
            <p className="eyebrow">Marketplace</p>
            <h2>Browse rentals</h2>
          </div>

          <div className="browse-search">
            <label className="sr-only" htmlFor="browse-search">
              Search rental items
            </label>
            <input
              id="browse-search"
              type="search"
              placeholder="Search by product or store name..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>

          <CategoryFilter
            selectedCategory={category}
            onSelectCategory={setCategory}
          />

          <RentalGrid
            items={visibleProducts}
            onViewDetails={setSelectedItem}
            onAddToCart={handleAddToCart}
            onRentNow={handleRentNow}
            loading={isLoadingListings}
            emptyTitle={isLoadingListings ? 'Loading rentals...' : 'No server listings yet'}
            emptyText={isLoadingListings ? 'Getting available rentals from the server.' : 'Sign in and open your store to add the first rental listing.'}
            emptyActionLabel="Open Your Store"
            onEmptyAction={
              products.length === 0
                ? () => goTo('create-store')
                : undefined
            }
          />
        </main>
      )}

      {page === 'stores' && (
        <main className="page">
          <div className="section-heading">
            <p className="eyebrow">Directory</p>
            <h2>Explore stores</h2>
          </div>

          <StoreGrid
            stores={stores}
            products={[...backendListings, ...localProductsForDisplay]}
            onOpen={(store) => openPublicStore(store.id)}
            emptyTitle="No stores yet. Be the first to open your store!"
            emptyText="Visitors will see stores here after someone creates one."
            emptyActionLabel="Open Your Store"
            onEmptyAction={() => goTo('create-store')}
          />
        </main>
      )}

      {page === 'create-store' && (
        <main className="page">
          <div className="section-heading">
            <p className="eyebrow">Get started</p>
            <h2>Open your store</h2>
          </div>

          <p className="form-intro">
            Your store will be saved to your account and shared with the marketplace.
          </p>

          <StoreForm
            submitLabel="Create Store"
            onSubmit={handleCreateStore}
            onCancel={() => goTo('home')}
          />
        </main>
      )}

      {page === 'edit-store' && activeStore && (
        <main className="page">
          <div className="section-heading">
            <p className="eyebrow">Store settings</p>
            <h2>Edit store</h2>
          </div>

          <StoreForm
            initialStore={activeStore}
            submitLabel="Save store changes"
            onSubmit={handleUpdateStore}
            onCancel={() => goTo('dashboard')}
          />
        </main>
      )}

      {page === 'my-stores' && (
        <main className="page">
          <div className="section-heading">
            <p className="eyebrow">Owner tools</p>
            <h2>My stores</h2>
          </div>

          <StoreGrid
            stores={myStores}
            products={[...backendListings, ...localProductsForDisplay]}
            actionLabel="Manage store"
            onOpen={(store) => openDashboard(store.id)}
            emptyTitle="You have not opened a store yet"
            emptyText="Create a store to add products and appear in Explore Stores."
            emptyActionLabel="Open Your Store"
            onEmptyAction={() => goTo('create-store')}
          />

{myStores.length > 0 && (
  <button
    type="button"
    className="btn btn-primary"
    onClick={() => goTo('create-store')}
  >
    Create Another Store
  </button>
)}
        </main>
      )}

      {page === 'dashboard' &&
        activeStore &&
        String(activeStore.ownerId) === String(currentUser?.id) && (
          <StoreDashboard
            store={activeStore}
            products={storeProducts}
            onBack={() => goTo('stores')}
            onAddProduct={() => {
              setEditingProduct(null)
              goTo('product-form')
            }}
            onEditProduct={(item) => {
              setEditingProduct(item)
              goTo('product-form')
            }}
            onRemoveProduct={handleRemoveProduct}
            onEditStore={() => goTo('edit-store')}
            onDeleteStore={handleDeleteStore}
            onViewPublic={() => openPublicStore(activeStore.id)}
            onViewDetails={setSelectedItem}
          />
        )}

      {page === 'product-form' &&
        activeStore &&
        activeStore.ownerId === currentUser?.id && (
          <main className="page">
            <div className="section-heading">
              <p className="eyebrow">{activeStore.name}</p>
              <h2>{editingProduct ? 'Edit product' : 'Add a product'}</h2>
            </div>

            <ProductForm
              initialProduct={editingProduct}
              submitLabel="Save Product"
              onSubmit={handleSaveProduct}
              onCancel={() => goTo('dashboard')}
            />
          </main>
        )}

      {page === 'store-page' && activeStore && (
        <StorePage
          store={activeStore}
          products={storeProducts}
          onViewDetails={setSelectedItem}
          onBack={() => {
            if (String(activeStore.ownerId) === String(currentUser?.id) && activeStore.backendStore) {
              openDashboard(activeStore.id)
            } else {
              goTo('stores')
            }
          }}
          onManage={activeStore.backendStore && String(activeStore.ownerId) === String(currentUser?.id)
            ? () => openDashboard(activeStore.id)
            : undefined}
        />
      )}

      {page === 'store-page' && !activeStore && (
        <main className="page">
          <div className="empty-state">
            <h2>Store could not be found</h2>
            <p>The store list may still be loading, or this store is no longer available.</p>
            <button type="button" className="btn btn-primary" onClick={() => goTo('stores')}>
              Back to Store Explorer
            </button>
          </div>
        </main>
      )}

      {page === 'my-rentals' && (
        <main className="page">
          <div className="section-heading">
            <p className="eyebrow">Your list</p>
            <h2>My Rentals</h2>
          </div>

          <RentalGrid
            items={savedRentals}
            onViewDetails={setSelectedItem}
            emptyTitle="You have not saved any rentals yet"
            emptyText="Open a product and choose Save to My Rentals. This list stays in this browser session only."
            emptyActionLabel="Browse rentals"
            onEmptyAction={() => goTo('browse')}
          />
        </main>
      )}
         
{page === 'cart' && (
  <CartPage
    items={cartItems}
    onUpdateDays={handleUpdateCartDays}
    onRemove={handleRemoveFromCart}
    onCheckout={() => {
      setCheckoutItems(cartItems)
      goTo('checkout')
    }}
    onContinueShopping={() => goTo('browse')}
  />
)}
 
{page === 'my-bookings' && (
  <MyBookings />
)}

{page === 'owner-bookings' && currentUser && (
  <OwnerBookings />
)}

{page === 'admin-bookings' && currentUser?.role === 'admin' && (
  <AdminBookings />
)}

{page === 'checkout' && (
  <CheckoutPage
    currentUser={currentUser}
    items={checkoutItems}
    onPlaceOrder={handlePlaceOrder}
    onBackToCart={handleOpenCart}
    onContinueShopping={() => goTo('browse')}
  />
)}


      {(page === 'sign-up' || page === 'sign-in') && (
        <AuthForm
          mode={page}
          isAdminLogin={page === 'sign-in' && afterAuthPage === 'admin-bookings'}
          onSubmit={page === 'sign-up' ? handleSignUp : handleSignIn}
          onSwitch={() => {
            setPage(page === 'sign-up' ? 'sign-in' : 'sign-up')
          }}
          onCancel={() => goTo('home')}
        />
      )}

      <Footer onNavigate={goTo} />

      <RentalModal
  item={selectedItem}
  onClose={() => setSelectedItem(null)}
  onVisitStore={openPublicStore}
  onSaveRental={handleSaveRental}
  onAddToCart={handleAddToCart}
  onRentNow={handleRentNow}
  alreadySaved={alreadySaved}
 
  isStoreOwner={myStores.some(
    (store) => String(store.id) === String(selectedItem?.storeId)
  )}

/>
    </div>
  )
}

export default App
