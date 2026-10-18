
function AuthForm({ mode, onSubmit, onSwitch, onCancel, isAdminLogin = false }) {
  const isSignUp = mode === 'sign-up'

 
function handleSubmit(event) {
  event.preventDefault()

  const formData = new FormData(event.currentTarget)

  const name = formData.get('name')?.toString().trim() || ''
  const email = formData.get('email')?.toString().trim().toLowerCase() || ''
  const password = formData.get('password')?.toString() || ''
  const confirmPassword =
    formData.get('confirmPassword')?.toString() || ''

  if (isSignUp && password !== confirmPassword) {
    alert('Passwords do not match. Please try again.')
    return
  }

  onSubmit({
    name,
    email,
    password,
  })
}

  return (
    <main className="auth-page">
      <section className="auth-layout">
        <aside className="auth-welcome">
          <button
            type="button"
            className="auth-brand"
            onClick={onCancel}
          >
            <span className="auth-brand-mark">R</span>
            Rentify
          </button>

          <div className="auth-welcome-content">
            <span className="auth-tagline">YOUR SPACE. YOUR WAY.</span>

            <h1>
              {isSignUp
                ? 'Make room for something new.'
                : 'Good to have you back.'}
            </h1>

            <p>
              {isSignUp
                ? 'Discover a smarter way to rent, share, and manage the things you love.'
                : (isAdminLogin ? 'Sign in with the authorized administrator account to manage rental requests.' : 'Your rentals, your stores, and your next great find are waiting for you.')}
            </p>

            <div className="auth-benefits">
              <div className="auth-benefit">
                <span className="auth-benefit-icon">↗</span>
                <div>
                  <strong>Discover more</strong>
                  <span>Find rentals that fit your needs.</span>
                </div>
              </div>

              <div className="auth-benefit">
                <span className="auth-benefit-icon">＋</span>
                <div>
                  <strong>Build your own store</strong>
                  <span>Share your products with others.</span>
                </div>
              </div>
            </div>
          </div>

          <p className="auth-welcome-footer">
            A little more access. A lot more possibility.
          </p>
        </aside>

        <section className="auth-form-side">
          <button
            type="button"
            className="auth-back-link"
            onClick={onCancel}
          >
            ← Back to home
          </button>

          <div className="auth-form-content">
            <div className="auth-mobile-brand">
              <span className="auth-brand-mark">R</span>
              Rentify
            </div>

            <p className="auth-eyebrow">
              {isSignUp ? 'GET STARTED FOR FREE' : (isAdminLogin ? 'SECURE ADMIN ACCESS' : 'WELCOME BACK')}
            </p>

            <h2>
              {isSignUp ? 'Create your account' : (isAdminLogin ? 'Admin sign in' : 'Sign in to Rentify')}
            </h2>

            <p className="auth-description">
              {isSignUp
                ? 'Join Rentify and start exploring a better way to rent.'
                : (isAdminLogin ? 'Only an existing administrator account can sign in here. Customer accounts cannot access the admin panel.' : 'Enter your details to continue to your account.')}
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              {isSignUp && (
                <label className="auth-field">
                  <span>Full name</span>
                  <input
                    name="name"
                    type="text"
                    placeholder="e.g. Maria Aslam"
                    autoComplete="name"
                    required
                  />
                </label>
              )}

              <label className="auth-field">
                <span>Email address</span>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>

             
<label className="auth-field">
  <span>Password</span>
  <input
    name="password"
    type="password"
    placeholder="At least 8 characters"
    autoComplete={isSignUp ? 'new-password' : 'current-password'}
    minLength={8}
    required
  />
</label>

{isSignUp && (
  <label className="auth-field">
    <span>Confirm Password</span>
    <input
      name="confirmPassword"
      type="password"
      placeholder="Re-enter your password"
      autoComplete="new-password"
      minLength={6}
      required
    />
  </label>
)}


              <button className="auth-submit" type="submit">
                {isSignUp ? 'Create account' : (isAdminLogin ? 'Sign in as admin' : 'Sign in')}
                <span>→</span>
              </button>
            </form>

            {!isAdminLogin && (
              <p className="auth-switch">
                {isSignUp
                  ? 'Already have an account?'
                  : "Don't have an account?"}
                {' '}
                <button type="button" onClick={onSwitch}>
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            )}

            <p className="auth-terms">
              By continuing, you agree to use Rentify responsibly.
            </p>
          </div>
        </section>
      </section>
    </main>
  )
}

export default AuthForm
