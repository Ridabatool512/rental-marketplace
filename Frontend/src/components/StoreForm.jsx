import { useState } from 'react'
import { STORE_CATEGORIES } from '../data/catalog'

function StoreForm({ initialStore, onSubmit, onCancel, submitLabel }) {
  const [name, setName] = useState(initialStore?.name || '')
  const [description, setDescription] = useState(initialStore?.description || '')
  const [category, setCategory] = useState(initialStore?.category || 'General')
  const [location, setLocation] = useState(initialStore?.location || '')
  const [coverImage, setCoverImage] = useState(initialStore?.coverImage || '')
  const [errors, setErrors] = useState({})

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}

    if (!name.trim()) {
      nextErrors.name = 'Please enter a store name.'
    }
    if (description.trim().length < 50) {
      nextErrors.description =
        'Description must be at least 50 characters long.'
    }
    
    if (!location.trim()) {
      nextErrors.location = 'Please enter your store location.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      coverImage: coverImage.trim(),
    })
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <label className="form-field">
        Store name
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="City Gear Co."
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </label>

      
<label className="form-field">
  Store description
  <textarea
    rows="4"
    value={description}
    onChange={(event) => setDescription(event.target.value)}
    placeholder="Describe your store and the products you offer (minimum 50 characters)"
    required
    minLength={50}
  />
  <small>
    {description.trim().length} / 50 characters minimum
  </small>
  {errors.description && (
    <span className="field-error">{errors.description}</span>
  )}
</label>


      <label className="form-field">
        Store category
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {STORE_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

     
<label className="form-field">
  Store location
  <input
    type="text"
    value={location}
    onChange={(event) => setLocation(event.target.value)}
    placeholder="Enter your city or store location"
    required
  />
  {errors.location && (
    <span className="field-error">{errors.location}</span>
  )}
</label>

      <label className="form-field">
        Logo or cover image URL (optional)
        <input
          type="url"
          value={coverImage}
          onChange={(event) => setCoverImage(event.target.value)}
          placeholder="https://..."
        />
      </label>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default StoreForm
