import { PRODUCT_CATEGORIES } from '../data/catalog'

function CategoryFilter({ selectedCategory, onSelectCategory }) {
  const options = ['All', ...PRODUCT_CATEGORIES]

  return (
    <div className="category-row" role="group" aria-label="Filter by category">
      {options.map((category) => (
        <button
          key={category}
          type="button"
          className={
            selectedCategory === category
              ? 'category-chip active'
              : 'category-chip'
          }
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
