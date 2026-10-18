
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
import './App.css'

function mapBackendListing(listing) {
  return {
    id: listing._id,
    backendListing: true,
    name: listing.title,
    description: listing.description,
    category: listing.category
      ? listing.category.replace(/\b\w/g, (letter) => letter.toUpperCase())
      : 'Other',
    image: listing.images?.[0] || '',
    images: listing.images || [],
    pricePerDay: listing.pricePerDay,
    available: listing.status === 'available',
    storeName: listing.owner?.name || 'Rental owner',
    location: listing.location || '',
    storeId: listing.owner?._id || listing.owner || '',
    ownerId: listing.owner?._id || listing.owner || '',
  }
}

function App() {
  const [page, setPage] = useState('home')

  const [currentUser, setCurrentUser] = useState(() => {
    if (!sessionStorage.getItem('token')) return null
    try {
      return JSON.parse(sessionStorage.getItem('rentifyUser')) || null
    } catch {
      return null
    }
  })

  const [afterAuthPage, setAfterAuthPage] = useState('create-store')
  const [stores, setStores] = useState(() => loadStores())
  const [products, setProducts] = useState(() => loadProducts())
  const [backendListings, setBackendListings] = useState([])
  const [isLoadingListings, setIsLoadingListings] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)
  const [savedRentals, setSavedRentals] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [checkoutItems, setCheckoutItems] = useState([])
  const [orders, setOrders] = useState([])
  const [activeStoreId, setActiveStoreId] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    saveStores(stores)
  }, [stores])

  useEffect(() => {
    let active = true

    async function loadBackendData() {
      try {
        const response = await api.get('/listings')
        if (active) {
          setBackendListings((response.data.listings || []).map(mapBackendListing))
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
    saveProducts(products)
  }, [products])

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
    stores.find((store) => store.id === activeStoreId) || null

  const storeProducts = localProductsForDisplay.filter(
    (item) => item.storeId === activeStoreId,
  )

  const myStores = stores.filter(
    (store) => store.ownerId === currentUser?.id,
  )

  function goTo(nextPage) {
    if (nextPage === 'create-store' && !currentUser) {
      setAfterAuthPage('create-store')
      setPage('sign-up')
    } else if (nextPage === 'my-stores' && !currentUser) {
      setAfterAuthPage('my-stores')
      setPage('sign-in')
    } else {
      setPage(nextPage)
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
      const response = await api.post('/auth/login', {
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
    const store = stores.find((item) => item.id === storeId)

    if (!currentUser) {
      setAfterAuthPage('my-stores')
      setPage('sign-in')
      return
    }

    if (!store || store.ownerId !== currentUser.id) {
      setStatusMessage('You can only manage your own stores.')
      goTo('my-stores')
      return
    }

    setActiveStoreId(storeId)
    setEditingProduct(null)
    goTo('dashboard')
  }

  function openPublicStore(storeId) {
    setActiveStoreId(storeId)
    setSelectedItem(null)
    goTo('store-page')
  }

  function handleSearchSubmit() {
    goTo('browse')
  }

  function handleCreateStore(formData) {
    if (!currentUser) {
      setAfterAuthPage('create-store')
      setPage('sign-up')
      return
    }

    const newStore = {
      id: createId('store'),
      ...formData,
      ownerId: currentUser.id,
    }

    setStores((current) => [...current, newStore])
    setActiveStoreId(newStore.id)
    setEditingProduct(null)
    setStatusMessage(`${newStore.name} was created successfully.`)
    setPage('dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleUpdateStore(formData) {
    if (!activeStore || activeStore.ownerId !== currentUser?.id) {
      goTo('my-stores')
      return
    }

    setStores((current) =>
      current.map((store) =>
        store.id === activeStoreId
          ? { ...store, ...formData }
          : store,
      ),
    )

    setStatusMessage('Store details were updated.')
    goTo('dashboard')
  }

  function handleDeleteStore() {
    if (!activeStore || activeStore.ownerId !== currentUser?.id) {
      goTo('my-stores')
      return
    }

    const confirmed = window.confirm(
      `Delete ${activeStore.name}? All of its products will also be removed.`,
    )

    if (!confirmed) return

    setStores((current) =>
      current.filter((store) => store.id !== activeStore.id),
    )

    setProducts((current) =>
      current.filter((item) => item.storeId !== activeStore.id),
    )

    setSavedRentals((current) =>
      current.filter((item) => item.storeId !== activeStore.id),
    )

    setActiveStoreId(null)
    setStatusMessage('The store and its products were removed.')
    goTo('my-stores')
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
      location: activeStore.location,
      status: formData.available ? 'available' : 'unavailable',
    }

    try {
      if (editingProduct?.backendListing) {
        const response = await api.put(`/listings/${editingProduct.id}`, listingData)
        const updated = mapBackendListing(response.data.listing)
        setBackendListings((current) => current.map((item) => item.id === updated.id ? updated : item))
        setProducts((current) => current.map((item) => item.id === editingProduct.id ? { ...item, ...formData } : item))
        setStatusMessage('Listing updated successfully.')
      } else {
        const response = await api.post('/listings', listingData)
        const created = mapBackendListing(response.data.listing)
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
    setStatusMessage(`Submitted ${createdBookings.length} rental request(s). Status: pending admin approval.`)
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
          />

        

          <section className="listings marketplace">
            <div className="section-heading">
              <p className="eyebrow">Marketplace</p>
              <h2>Products added by store owners</h2>
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
            products={products}
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
            Store details are saved in this browser for the demo. They are not
            sent to a shared server yet.
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
            products={products}
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
        activeStore.ownerId === currentUser?.id && (
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
            if (activeStore.ownerId === currentUser?.id) {
              openDashboard(activeStore.id)
            } else {
              goTo('browse')
            }
          }}
          onManage={() => openDashboard(activeStore.id)}
        />
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
    (store) => store.id === selectedItem?.storeId
  )}

/>
    </div>
  )
}

export default App
