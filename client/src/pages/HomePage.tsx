import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../app/store'
import { fetchCart } from '../features/cart/cartSlice'
import { getProducts } from '../services/productService'
import Banner from '../components/Banner'
import FilterControls from '../components/FilterControls'
import ProductList from '../components/ProductList'
import './HomePage.css'

axios.defaults.withCredentials = true

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

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('') // có thể dùng để filter nếu cần
  const [selectedType, setSelectedType] = useState<string>('')

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts()
        setProducts(productsData)
      } catch (err: any) {
        console.error('Error fetching data:', err)
        setError('Error fetching data')
      }

      if (user) {
        dispatch(fetchCart())
      }
    }
    fetchData()
  }, [dispatch, user])

  const handleAddToCart = async (productId: number, quantity: number) => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      await axios.post('/api/cart', { productId, quantity })
      dispatch(fetchCart())
      alert('Product added to cart!')
    } catch (err: any) {
      console.error('Error adding product to cart:', err)
      alert('Failed to add product to cart')
    }
  }

  const productTypes = Array.from(
    new Set(products.map((p) => p.productType).filter(Boolean))
  ) as string[]

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.categoryId === parseInt(selectedCategory, 10)
      : true
    const matchesType = selectedType
      ? product.productType === selectedType
      : true
    return matchesCategory && matchesType
  })

  return (
    <div className="home-container">
      <Banner />
      <FilterControls
        categories={[]} // Không hiển thị danh mục ở đây nữa vì đã có trong Navbar
        productTypes={productTypes}
        selectedCategory={selectedCategory}
        selectedType={selectedType}
        onCategoryChange={setSelectedCategory}
        onTypeChange={setSelectedType}
      />
      <ProductList
        products={filteredProducts}
        onAddToCart={handleAddToCart}
        error={error}
      />
    </div>
  )
}

export default HomePage
