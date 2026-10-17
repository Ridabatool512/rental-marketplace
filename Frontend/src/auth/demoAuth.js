// Demo authentication only. Passwords are stored in this browser so the
// frontend can be tested without a backend. Replace this module with real
// API calls. Do not treat this as secure production authentication.

import { createId } from '../data/catalog'

export const ROLES = {
  CUSTOMER: 'customer',
  STORE_OWNER: 'store-owner',
}

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

export function validateSignup({
  name,
  email,
  password,
  confirmPassword,
  role,
}) {
  const errors = {}

  if (!name.trim()) {
    errors.name = 'Please enter your full name.'
  }
  if (!email.trim()) {
    errors.email = 'Please enter an email address.'
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Please enter a valid email address, such as name@email.com.'
  }
  if (!password) {
    errors.password = 'Please create a password.'
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }
  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.'
  }
  if (role !== ROLES.CUSTOMER && role !== ROLES.STORE_OWNER) {
    errors.role = 'Please choose Customer or Store Owner.'
  }

  return errors
}

export function validateLogin({ email, password }) {
  const errors = {}

  if (!email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!password) {
    errors.password = 'Please enter your password.'
  }

  return errors
}

export function registerUser(users, form) {
  const errors = validateSignup(form)
  const email = form.email.trim().toLowerCase()

  if (users.some((user) => user.email === email)) {
    errors.email = 'An account with this email already exists. Please log in.'
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  const user = {
    id: createId('user'),
    name: form.name.trim(),
    email,
    password: form.password,
    role: form.role,
  }

  return { ok: true, user, users: [...users, user] }
}

export function authenticateUser(users, form) {
  const errors = validateLogin(form)
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  const email = form.email.trim().toLowerCase()
  const user = users.find(
    (item) => item.email === email && item.password === form.password,
  )

  if (!user) {
    return {
      ok: false,
      errors: { form: 'No account matched that email and password.' },
    }
  }

  return { ok: true, user }
}

export function publicUser(user) {
  if (!user) {
    return null
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export function isStoreOwner(user) {
  return user?.role === ROLES.STORE_OWNER
}

export function isCustomer(user) {
  return user?.role === ROLES.CUSTOMER
}
