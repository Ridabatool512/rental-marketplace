function RoleMessage({ title, text, actions }) {
  return (
    <main className="page">
      <div className="sign-in-card">
        <p className="eyebrow">Account role</p>
        <h2>{title}</h2>
        <p>{text}</p>
        <div className="form-actions">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={action.primary ? 'btn btn-primary' : 'btn btn-ghost'}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}

export default RoleMessage
