// Temporary demo storage. This is not a shared database and is not
// production-secure. Later, replace these helpers with backend API calls.

const STORES_KEY = 'rentify.stores'
const PRODUCTS_KEY = 'rentify.products'
const USERS_KEY = 'rentify.users'
const SESSION_KEY = 'rentify.session'
const CARTS_KEY = 'rentify.carts'
const PENDING_KEY = 'rentify.pendingAction'

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) {
      return fallback
    }
    return JSON.parse(raw)
  } catch (error) {
    console.warn('Could not read saved Rentify data.', error)
    return fallback
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

function readList(key) {
  const parsed = readJson(key, [])
  return Array.isArray(parsed) ? parsed : []
}

export function loadStores() {
  return readList(STORES_KEY)
}

export function loadProducts() {
  return readList(PRODUCTS_KEY)
}

export function saveStores(stores) {
  writeJson(STORES_KEY, stores)
}

export function saveProducts(products) {
  writeJson(PRODUCTS_KEY, products)
}

export function loadUsers() {
  return readList(USERS_KEY)
}

export function saveUsers(users) {
  writeJson(USERS_KEY, users)
}

export function loadSession() {
  return readJson(SESSION_KEY, null)
}

export function saveSession(session) {
  if (!session) {
    window.localStorage.removeItem(SESSION_KEY)
    return
  }
  writeJson(SESSION_KEY, session)
}

export function loadCarts() {
  const parsed = readJson(CARTS_KEY, {})
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    ? parsed
    : {}
}

export function saveCarts(carts) {
  writeJson(CARTS_KEY, carts)
}

export function loadPendingAction() {
  return readJson(PENDING_KEY, null)
}

export function savePendingAction(action) {
  if (!action) {
    window.localStorage.removeItem(PENDING_KEY)
    return
  }
  writeJson(PENDING_KEY, action)
}
