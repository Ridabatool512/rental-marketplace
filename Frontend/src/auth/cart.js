export function getUserCart(carts, userId) {
  return carts[userId] || []
}

export function addProductToCart(carts, userId, productId) {
  const current = getUserCart(carts, userId)
  const existing = current.find((item) => item.productId === productId)

  const nextItems = existing
    ? current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
    : [...current, { productId, quantity: 1 }]

  return {
    ...carts,
    [userId]: nextItems,
  }
}

export function updateCartQuantity(carts, userId, productId, quantity) {
  const nextItems =
    quantity <= 0
      ? getUserCart(carts, userId).filter((item) => item.productId !== productId)
      : getUserCart(carts, userId).map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        )

  return {
    ...carts,
    [userId]: nextItems,
  }
}

export function removeProductFromCart(carts, userId, productId) {
  return {
    ...carts,
    [userId]: getUserCart(carts, userId).filter(
      (item) => item.productId !== productId,
    ),
  }
}
