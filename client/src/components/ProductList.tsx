import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Product } from '../services/productService'
import './ProductList.css'

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
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  // Hiển thị tối đa 6 sản phẩm trong carousel
  const displayedProducts = products.slice(0, 6)

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <section className="products-section">
      <h2>Product List</h2>
      {error && <div className="error-message">{error}</div>}
      {products.length === 0 ? (
        <div>Loading products...</div>
      ) : (
        <div className="carousel-wrapper">
          {products.length > 6 && (
            <button className="arrow-button left" onClick={scrollLeft}>
              &#8249;
            </button>
          )}
          <div className="products-carousel" ref={containerRef}>
            {displayedProducts.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
          {products.length > 6 && (
            <button className="arrow-button right" onClick={scrollRight}>
              &#8250;
            </button>
          )}
        </div>
      )}
      {products.length > 6 && (
        <div className="view-all-container">
          <button
            className="view-all-button"
            onClick={() => navigate('/products')}
          >
            View All Products
          </button>
        </div>
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
  const navigate = useNavigate()

  const handleViewDetail = () => {
    navigate(`/product/${product.id}`)
  }

  const decrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation()
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const incrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation()
    setQuantity((prev) => prev + 1)
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart(product.id, quantity)
    setQuantity(1)
  }

  return (
    <div className="product-item-container" onClick={handleViewDetail}>
      {product.imageUrl && (
        <div className="product-image-container">
          <img
            src={`http://localhost:3001${product.imageUrl}`}
            alt={product.name}
            className="product-image"
          />
        </div>
      )}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price}Đ</p>
        {/* Container mới chứa quantity selector và Add to Cart */}
        <div
          className="quantity-add-container"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="quantity-selector">
            <button onClick={decrementQuantity} className="quantity-button">
              -
            </button>
            <span className="quantity-value">{quantity}</span>
            <button onClick={incrementQuantity} className="quantity-button">
              +
            </button>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAdd(e)
            }}
            className="add-to-cart-button"
          >
            🛒
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductList
