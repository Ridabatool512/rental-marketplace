import { useState } from 'react'
import { ROLES } from '../auth/demoAuth'

function SignupPage({ defaultRole, onSignup, onGoLogin, notice }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState(defaultRole || ROLES.CUSTOMER)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setSuccess('')
    const result = onSignup({
      name,
      email,
      password,
      confirmPassword,
      role,
    })

    if (!result.ok) {
      setErrors(result.errors)
      return
    }

    setErrors({})
    setSuccess('Account created. You are now signed in.')
  }

  return (
    <main className="page">
      <div className="section-heading">
        <p className="eyebrow">Demo accounts</p>
        <h2>Sign up</h2>
      </div>
      <p className="form-intro">
        This is demo authentication stored in this browser only. It is not
        secure production login and will be replaced by the backend API.
      </p>
      {notice && <p className="notice">{notice}</p>}
      {success && <p className="status-banner">{success}</p>}

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <label className="form-field">
          Full name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Maria Example"
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>

        <label className="form-field">
          Email address
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@email.com"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>

        <label className="form-field">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {errors.password && (
            <span className="field-error">{errors.password}</span>
          )}
        </label>

        <label className="form-field">
          Confirm password
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          {errors.confirmPassword && (
            <span className="field-error">{errors.confirmPassword}</span>
          )}
        </label>

        <fieldset className="form-field">
          <legend>Account role</legend>
          <label className="form-check">
            <input
              type="radio"
              name="role"
              checked={role === ROLES.CUSTOMER}
              onChange={() => setRole(ROLES.CUSTOMER)}
            />
            Customer
          </label>
          <label className="form-check">
            <input
              type="radio"
              name="role"
              checked={role === ROLES.STORE_OWNER}
              onChange={() => setRole(ROLES.STORE_OWNER)}
            />
            Store Owner
          </label>
          {errors.role && <span className="field-error">{errors.role}</span>}
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Create account
          </button>
          <button type="button" className="btn btn-ghost" onClick={onGoLogin}>
            I already have an account
          </button>
        </div>
      </form>
    </main>
  )
}

export default SignupPage
