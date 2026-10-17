import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  loadCarts,
  loadPendingAction,
  loadSession,
  loadUsers,
  saveCarts,
  savePendingAction,
  saveSession,
  saveUsers,
} from '../data/storage'
import {
  authenticateUser,
  publicUser,
  registerUser,
} from './demoAuth'
import {
  addProductToCart,
  getUserCart,
  removeProductFromCart,
  updateCartQuantity,
} from './cart'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => loadUsers())
  const [currentUser, setCurrentUser] = useState(() => loadSession())
  const [pendingAction, setPendingActionState] = useState(() =>
    loadPendingAction(),
  )
  const [carts, setCarts] = useState(() => loadCarts())

  useEffect(() => {
    saveUsers(users)
  }, [users])

  useEffect(() => {
    saveSession(currentUser)
  }, [currentUser])

  useEffect(() => {
    savePendingAction(pendingAction)
  }, [pendingAction])

  useEffect(() => {
    saveCarts(carts)
  }, [carts])

  const value = useMemo(() => {
    function signup(form) {
      const result = registerUser(users, form)
      if (!result.ok) {
        return result
      }
      setUsers(result.users)
      setCurrentUser(publicUser(result.user))
      return { ok: true, user: publicUser(result.user) }
    }

    function login(form) {
      const result = authenticateUser(users, form)
      if (!result.ok) {
        return result
      }
      setCurrentUser(publicUser(result.user))
      return { ok: true, user: publicUser(result.user) }
    }

    function logout() {
      setCurrentUser(null)
      setPendingActionState(null)
    }

    function setPendingAction(action) {
      setPendingActionState(action)
    }

    function consumePendingAction() {
      const action = pendingAction
      setPendingActionState(null)
      return action
    }

    function addToCart(productId, userId) {
      const ownerId = userId || currentUser?.id
      if (!ownerId) {
        return { ok: false, reason: 'auth' }
      }
      setCarts((current) => addProductToCart(current, ownerId, productId))
      return { ok: true }
    }

    function setCartQuantity(productId, quantity) {
      if (!currentUser) {
        return
      }
      setCarts((current) =>
        updateCartQuantity(current, currentUser.id, productId, quantity),
      )
    }

    function removeFromCart(productId) {
      if (!currentUser) {
        return
      }
      setCarts((current) =>
        removeProductFromCart(current, currentUser.id, productId),
      )
    }

    return {
      users,
      currentUser,
      pendingAction,
      cartItems: currentUser ? getUserCart(carts, currentUser.id) : [],
      signup,
      login,
      logout,
      setPendingAction,
      consumePendingAction,
      addToCart,
      setCartQuantity,
      removeFromCart,
    }
  }, [users, currentUser, pendingAction, carts])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return value
}
