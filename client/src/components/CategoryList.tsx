import React from 'react'
import { Link } from 'react-router-dom'
import { Category } from '../services/categoryService'

interface CategoryListProps {
  categories: Category[]
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  return (
    <section className="categories-section">
      <h2>Categories</h2>
      {categories.length === 0 ? (
        <div>Loading categories...</div>
      ) : (
        <ul className="categories-list">
          {categories.map((cat) => (
            <li key={cat.id} className="category-item">
              <Link to={`/category/${cat.id}`} className="category-link">
                <strong>{cat.name}</strong>
                {cat.description && <span> - {cat.description}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default CategoryList
