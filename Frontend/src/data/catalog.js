// Shared catalog helpers. Stores and products live in application state
// and localStorage. Later, replace storage.js with backend API calls
// and keep these object shapes the same.

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Vehicles',
  'Tools',
  'Home Essentials',
]

export const STORE_CATEGORIES = [
  'General',
  'Electronics',
  'Vehicles',
  'Tools',
  'Home Essentials',
]

export const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'

export function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function filterProducts(products, searchText, category) {
  const query = searchText.trim().toLowerCase()

  return products.filter((item) => {
    const haystack = `${item.name} ${item.storeName || ''}`.toLowerCase()
    const matchesSearch = haystack.includes(query)
    const matchesCategory = category === 'All' || item.category === category
    return matchesSearch && matchesCategory
  })
}


export function productsWithStoreInfo(products, stores) {
  return products.map((product) => {
    const store = stores.find(
      (item) => item.id === product.storeId
    )

    return {
      ...product,
      storeName: store ? store.name : 'Unknown store',
      location: store ? store.location : '',
    }
  })
}

