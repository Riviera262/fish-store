import React from 'react'

interface FilterControlsProps {
  categories: { id: number; name: string }[]
  productTypes: string[]
  selectedCategory: string
  selectedType: string
  onCategoryChange: (value: string) => void
  onTypeChange: (value: string) => void
}

const FilterControls: React.FC<FilterControlsProps> = ({
  categories,
  productTypes,
  selectedCategory,
  selectedType,
  onCategoryChange,
  onTypeChange,
}) => {
  return (
    <section className="filter-section">
      <h2>Filter Products</h2>
      <div className="filter-controls">
        <div>
          <label htmlFor="category-filter" className="filter-label">
            Category:
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="filter-select"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="type-filter" className="filter-label">
            Type:
          </label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="filter-select"
          >
            <option value="">All</option>
            {productTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  )
}

export default FilterControls
