// src/components/ProductList.tsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Product } from '../services/productService'

interface ProductListProps {
  products: Product[]
  onAddToCart: (productId: number, quantity: number) => void
  error?: string
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onAddToCart,
  error,
}) => {
  return (
    <section className="products-section">
      <h2>Product List</h2>
      {error && <div className="error-message">{error}</div>}
      {products.length === 0 ? (
        <div>Loading products...</div>
      ) : (
        <ul className="products-grid">
          {products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

interface ProductItemProps {
  product: Product
  onAddToCart: (productId: number, quantity: number) => void
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState<number>(1)

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const handleAdd = () => {
    onAddToCart(product.id, quantity)
    setQuantity(1)
  }

  return (
    <li className="product-item">
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
      <div className="quantity-selector">
        <button onClick={decrementQuantity} className="quantity-button">
          -
        </button>
        <span className="quantity-value">{quantity}</span>
        <button onClick={incrementQuantity} className="quantity-button">
          +
        </button>
      </div>
      <button onClick={handleAdd} className="add-to-cart-button">
        🛒 Add to Cart
      </button>
      <Link to={`/product/${product.id}`} className="details-link">
        View Details
      </Link>
    </li>
  )
}

export default ProductList
