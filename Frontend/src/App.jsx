
import { useEffect, useMemo, useState } from 'react'
import api from './api/axios'

import AuthForm from './components/AuthForm'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
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

function App() {
  const [page, setPage] = useState('home')

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('rentifyUser')) || null
    } catch {
      return null
    }
  })

  const [afterAuthPage, setAfterAuthPage] = useState('create-store')

  const [stores, setStores] = useState(() => loadStores())
  const [products, setProducts] = useState(() => loadProducts())

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

  // Save local demo stores.
  useEffect(() => {
    saveStores(stores)
  }, [stores])

  // Save local demo products.
  useEffect(() => {
    saveProducts(products)
  }, [products])

  const productsForDisplay = useMemo(
    () => productsWithStoreInfo(products, stores),
    [products, stores],
  )

  const visibleProducts = useMemo(
    () => filterProducts(productsForDisplay, searchText, category),
    [productsForDisplay, searchText, category],
  )

  const activeStore =
    stores.find((store) => store.id === activeStoreId) || null

  const storeProducts = productsForDisplay.filter(
    (item) => item.storeId === activeStoreId,
  )

  const myStores = stores.filter(
    (store) => store.ownerId === currentUser?.id,
  )

  // Navigate between application pages.
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

  // Register a new user through the backend API.
  async function handleSignUp(formData) {
    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      const { token, user } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('rentifyUser', JSON.stringify(user))

      setCurrentUser(user)
      setStatusMessage('Account created successfully.')
      setPage(afterAuthPage)

      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Registration failed. Please try again.'

      window.alert(message)
    }
  }

  // Sign in an existing user through the backend API.
  async function handleSignIn(formData) {
    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      })

      const { token, user } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('rentifyUser', JSON.stringify(user))

      setCurrentUser(user)
      setStatusMessage('Signed in successfully.')
      setPage(afterAuthPage)

      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Login failed. Please check your connection and try again.'

      window.alert(message)
    }
  }

  // Sign out and remove the saved authentication token.
  function handleSignOut() {
    localStorage.removeItem('token')
    localStorage.removeItem('rentifyUser')

    setCurrentUser(null)
    setActiveStoreId(null)
    setStatusMessage('You have signed out.')
    setPage('home')

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Open a store dashboard belonging to the current user.
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

  // Open a publicly viewable store.
  function openPublicStore(storeId) {
    setActiveStoreId(storeId)
    setSelectedItem(null)
    goTo('store-page')
  }

  function handleSearchSubmit() {
    goTo('browse')
  }

  // Create a store locally.
  // Backend store integration is a separate step.
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

  // Update a store locally.
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

  // Delete a store and its local products.
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

  // Add or update a product locally.
  function handleSaveProduct(formData) {
    if (!activeStore || activeStore.ownerId !== currentUser?.id) {
      goTo('my-stores')
      return
    }

    if (editingProduct) {
      setProducts((current) =>
        current.map((item) =>
          item.id === editingProduct.id &&
          item.storeId === activeStoreId
            ? { ...item, ...formData }
            : item,
        ),
      )

      setStatusMessage('Product details were updated.')
    } else {
      const newProduct = {
        id: createId('product'),
        storeId: activeStoreId,
        ...formData,
      }

      setProducts((current) => [...current, newProduct])
      setStatusMessage(
        'Product added to your store and the marketplace.',
      )
    }

    setEditingProduct(null)
    goTo('dashboard')
  }

  // Delete a product locally.
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

    setProducts((current) =>
      current.filter((product) => product.id !== item.id),
    )

    setSavedRentals((current) =>
      current.filter((product) => product.id !== item.id),
    )

    setSelectedItem(null)
    setStatusMessage(`${item.name} was removed.`)
  }

  // Save a rental to the user's local saved list.
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

  // Add an available product to the cart.
  function handleAddToCart(item) {
    if (!item || !item.available) {
      setStatusMessage('This item is currently unavailable.')
      return
    }

    setCartItems((current) => {
      const existingItem = current.find(
        (cartItem) => cartItem.id === item.id,
      )

      if (existingItem) {
        setStatusMessage(`${item.name} is already in your cart.`)
        return current
      }

      setStatusMessage(`${item.name} added to your cart.`)

      return [...current, { ...item, days: 1 }]
    })
  }

  // Rent an item immediately.
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

  // Update the rental duration for a cart item.
  function handleUpdateCartDays(itemId, days) {
    setCartItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, days } : item,
      ),
    )
  }

  // Remove a product from the cart.
  function handleRemoveFromCart(itemId) {
    setCartItems((current) =>
      current.filter((item) => item.id !== itemId),
    )
  }

  // Place an order locally.
  // Backend booking and payment integration is a separate step.
  function handlePlaceOrder(customerDetails) {
    const order = {
      id: createId(),
      customer: customerDetails,
      items: checkoutItems.map((item) => ({ ...item })),
      total: checkoutItems.reduce(
        (sum, item) => sum + item.pricePerDay * item.days,
        0,
      ),
      createdAt: new Date().toISOString(),
    }

    setOrders((current) => [...current, order])

    setCartItems((current) =>
      current.filter(
        (cartItem) =>
          !checkoutItems.some((item) => item.id === cartItem.id),
      ),
    )

    setCheckoutItems([])
    setStatusMessage(
      `Order placed successfully! Order ID: ${order.id}`,
    )

    goTo('home')
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
              emptyTitle={
                products.length === 0
                  ? 'No products yet'
                  : 'No products match that search'
              }
              emptyText={
                products.length === 0
                  ? 'When store owners add items, they will show up here.'
                  : 'Try a different name or choose another category.'
              }
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
            emptyTitle={
              products.length === 0
                ? 'No products yet'
                : 'No products match that search'
            }
            emptyText={
              products.length === 0
                ? 'Open a store and add your first rental item.'
                : 'Try a different name or choose another category.'
            }
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
            Store details are currently saved in this browser.
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

      {page === 'checkout' && (
        <CheckoutPage
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
          (store) => store.id === selectedItem?.storeId,
        )}
      />
    </div>
  )
}

export default App
