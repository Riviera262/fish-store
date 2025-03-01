// src/pages/ProductDetail.tsx
import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../app/store'
import { fetchCart } from '../features/cart/cartSlice'
import './ProductDetail.css'

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

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (productId) {
          const response = await axios.get<Product>(
            `/api/products/${productId}`
          )
          setProduct(response.data)
        }
      } catch (err: any) {
        console.error('Error fetching product:', err)
        setError('Error fetching product')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      await axios.post('/api/cart', { productId: product?.id, quantity })
      dispatch(fetchCart())
      alert('Product added to cart!')
      setQuantity(1) // reset quantity
    } catch (err: any) {
      console.error('Error adding product to cart:', err)
      alert('Failed to add product to cart')
    }
  }

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  if (loading) return <div>Loading product...</div>
  if (error) return <div>{error}</div>
  if (!product) return <div>Product not found</div>

  return (
    <div className="product-detail-container">
      <header className="product-detail-header">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
      </header>
      <div className="product-detail">
        {product.imageUrl && (
          <img
            src={`http://localhost:3001${product.imageUrl}`}
            alt={product.name}
            className="product-detail-image"
          />
        )}
        <div className="product-detail-info">
          <h2>{product.name}</h2>
          <p className="product-detail-price">${product.price}</p>
          {product.description && (
            <p className="product-detail-description">{product.description}</p>
          )}
          <div className="quantity-selector">
            <button onClick={decrementQuantity} className="quantity-button">
              -
            </button>
            <span className="quantity-value">{quantity}</span>
            <button onClick={incrementQuantity} className="quantity-button">
              +
            </button>
          </div>
          <button onClick={handleAddToCart} className="add-to-cart-button">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
