import { useState } from 'react'
import { PRODUCT_CATEGORIES } from '../data/catalog'

function ProductForm({ initialProduct, onSubmit, onCancel, submitLabel }) {
  const [name, setName] = useState(initialProduct?.name || '')
  const [description, setDescription] = useState(initialProduct?.description || '')
  const [category, setCategory] = useState(
    initialProduct?.category || PRODUCT_CATEGORIES[0],
  )
  const [pricePerDay, setPricePerDay] = useState(
    initialProduct?.pricePerDay?.toString() || '',
  )
  const [quantity, setQuantity] = useState(
    String(initialProduct?.quantity ?? 1),
  )
  const [images, setImages] = useState(
    initialProduct?.images ||
      (initialProduct?.image ? [initialProduct.image] : []),
  )
  const [available, setAvailable] = useState(
    initialProduct ? initialProduct.available : true,
  )
  const [errors, setErrors] = useState({})
   
async function handleImageChange(event) {
  const files = Array.from(event.target.files || [])

  if (files.length < 1 || files.length > 3) {
    setErrors((current) => ({
      ...current,
      images: 'Please select between 1 and 3 images.',
    }))
    event.target.value = ''
    return
  }

  if (files.some((file) => !file.type.startsWith('image/'))) {
    setErrors((current) => ({
      ...current,
      images: 'Please select image files only.',
    }))
    event.target.value = ''
    return
  }

  try {
    const convertedImages = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader()

            reader.onload = () => resolve(reader.result)
            reader.onerror = () => reject(new Error('Image upload failed.'))

            reader.readAsDataURL(file)
          }),
      ),
    )

    setImages(convertedImages)
    setErrors((current) => {
      const next = { ...current }
      delete next.images
      return next
    })
  } catch {
    setErrors((current) => ({
      ...current,
      images: 'Could not read the selected images. Please try again.',
    }))
  }
}

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    const price = Number(pricePerDay)
    const stockQuantity = Number(quantity)

    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      nextErrors.quantity = 'Stock quantity must be a whole number of zero or more.'
    }

    if (!name.trim()) {
      nextErrors.name = 'Please enter a product name.'
    }
    if (!description.trim()) {
      nextErrors.description = 'Please add a product description.'
    }
    if (!pricePerDay || Number.isNaN(price) || price <= 0) {
      nextErrors.pricePerDay = 'Price per day must be a number greater than zero.'
    }
    // Require at least 1 and at most 3 product images
    if (images.length < 1 || images.length > 3) {
    nextErrors.images =
      'Please upload at least 1 and at most 3 images.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      category,
      pricePerDay: price,
      quantity: stockQuantity,
      images,
      image: images[0] || '',
      available,
    })
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <label className="form-field">
        Product name
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Camera, bike, drill..."
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </label>

      <label className="form-field">
        Product description
        <textarea
          rows="4"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What is included, and who would rent this?"
        />
        {errors.description && (
          <span className="field-error">{errors.description}</span>
        )}
      </label>

      <label className="form-field">
        Category
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {PRODUCT_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="form-field">
        Number of units in stock
        <input
          type="number"
          min="0"
          step="1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          placeholder="1"
        />
        <small>When all units are rented, the listing becomes Out of Stock. Update this number when you restock.</small>
        {errors.quantity && <span className="field-error">{errors.quantity}</span>}
      </label>

      <label className="form-field">
        Price per day
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={pricePerDay}
          onChange={(event) => setPricePerDay(event.target.value)}
          placeholder="25"
        />
        {errors.pricePerDay && (
          <span className="field-error">{errors.pricePerDay}</span>
        )}
      </label>

     
<label className="form-field">
  Product images (1–3 required)

  <input
    type="file"
    accept="image/*"
    multiple
    onChange={handleImageChange}
    required={images.length === 0}
  />

  <small>
    Select 1 to 3 photos from your computer.
  </small>

  {images.length > 0 && (
    <div className="product-image-previews">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Product preview ${index + 1}`}
          style={{
            width: '100px',
            height: '80px',
            objectFit: 'cover',
            borderRadius: '8px',
            margin: '6px',
          }}
        />
      ))}
    </div>
  )}

  {errors.images && (
    <span className="field-error">{errors.images}</span>
  )}
</label>


      <label className="form-check">
        <input
          type="checkbox"
          checked={available}
          onChange={(event) => setAvailable(event.target.checked)}
        />
        Available for rent
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

export default ProductForm
