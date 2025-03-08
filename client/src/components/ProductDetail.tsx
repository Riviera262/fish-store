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
  status?: string
  productType?: string
  categoryId?: number
}

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  // Giả sử sản phẩm có mảng ảnh để carousel
  const [productImages, setProductImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)

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
          // Nếu có imageUrl, ta tạo mảng ảnh (có thể được thay bằng API lấy thêm ảnh sau này)
          if (response.data.imageUrl) {
            // Ở đây chỉ dùng ảnh chính; nếu có nhiều ảnh, bạn có thể thay đổi logic này
            setProductImages([response.data.imageUrl])
          }
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
      setQuantity(1)
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

  const previousImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : productImages.length - 1
    )
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) =>
      prev < productImages.length - 1 ? prev + 1 : 0
    )
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
      <div className="product-detail-content">
        <div className="product-images">
          {productImages.length > 0 && (
            <div className="carousel">
              <button className="carousel-arrow left" onClick={previousImage}>
                &#8249;
              </button>
              <img
                src={`http://localhost:3001${productImages[currentImageIndex]}`}
                alt={product.name}
                className="carousel-image"
              />
              <button className="carousel-arrow right" onClick={nextImage}>
                &#8250;
              </button>
            </div>
          )}
        </div>
        <div className="product-info">
          <h2 className="product-name">{product.name}</h2>
          <p className="product-price">{product.price}Đ</p>
          <div className="info-detail">
            {product.productType && <p>Type: {product.productType}</p>}
            {product.status && <p>status: {product.status}</p>}
          </div>
          <div className="quantity-section">
            <div className="quantity-label">QUANTITY:</div>
            <div className="quantity-selector">
              <button onClick={decrementQuantity} className="quantity-button">
                -
              </button>
              <span className="quantity-value">{quantity}</span>
              <button onClick={incrementQuantity} className="quantity-button">
                +
              </button>
            </div>
          </div>
          <div className="add-to-cart-wrapper">
            <button onClick={handleAddToCart} className="add-to-cart-button">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div className="product-description">
        <h3>Description</h3>
        {product.description ? (
          <p>{product.description}</p>
        ) : (
          <p>No description available.</p>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
