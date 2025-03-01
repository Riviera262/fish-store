// src/pages/CategoryProductsPage.tsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductsByCategory } from '../services/productService'
import './CategoryProductsPage.css'

interface Product {
  id: number
  name: string
  price: number
  description?: string
  imageUrl?: string
  stockQuantity?: number
  productType?: string
  categoryId?: number
}

const CategoryProductsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>()
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId) {
        setError('Category ID not provided')
        setLoading(false)
        return
      }
      console.log('Fetching products for categoryId:', categoryId)
      try {
        const data = await getProductsByCategory(parseInt(categoryId, 10))
        console.log('Products fetched:', data)
        setProducts(data)
      } catch (err: any) {
        console.error('Error fetching products:', err)
        setError('Error fetching products')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [categoryId])

  return (
    <div className="category-products-container">
      <header className="category-header">
        <h2>Products in Category {categoryId}</h2>
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
      </header>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div>Loading products...</div>
      ) : products.length === 0 ? (
        <div>No products found in this category.</div>
      ) : (
        <ul className="products-grid">
          {products.map((product) => (
            <li key={product.id} className="product-item">
              {product.imageUrl && (
                <img
                  src={`http://localhost:3001${product.imageUrl}`}
                  alt={product.name}
                  className="product-image"
                />
              )}
              <h3>{product.name}</h3>
              <p className="product-price">${product.price}</p>
              {product.description && <p>{product.description}</p>}
              <Link to={`/product/${product.id}`} className="details-link">
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CategoryProductsPage
