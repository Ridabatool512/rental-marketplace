import { useState } from 'react'

function LoginPage({ onLogin, onGoSignup, notice }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  function handleSubmit(event) {
    event.preventDefault()
    const result = onLogin({ email, password })
    if (!result.ok) {
      setErrors(result.errors)
      return
    }
    setErrors({})
  }

  return (
    <main className="page">
      <div className="section-heading">
        <p className="eyebrow">Demo accounts</p>
        <h2>Log in</h2>
      </div>
      <p className="form-intro">
        Demo login checks accounts saved in this browser. This is not
        production-secure authentication.
      </p>
      {notice && <p className="notice">{notice}</p>}
      {errors.form && <p className="error-banner">{errors.form}</p>}

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <label className="form-field">
          Email address
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Log in
          </button>
          <button type="button" className="btn btn-ghost" onClick={onGoSignup}>
            Create an account
          </button>
        </div>
      </form>
    </main>
  )
}

export default LoginPage
