import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories } from '../services/categoryService'
import { getProducts } from '../services/productService'
import './Navbar.css'

interface Category {
  id: number
  name: string
}

interface Product {
  id: number
  name: string
  productType?: string
  categoryId?: number
}

const Navbar: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [productTypes, setProductTypes] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await getCategories()
        setCategories(categoriesData)
        const productsData = await getProducts()
        const types = Array.from(
          new Set(
            productsData.map((p: Product) => p.productType).filter(Boolean)
          )
        ) as string[]
        setProductTypes(types)
      } catch (error) {
        console.error('Error fetching navbar data', error)
      }
    }
    fetchData()
  }, [])

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <Link to="/">Trang chủ</Link>
        </li>
        <li>
          <Link to="/about">Giới thiệu</Link>
        </li>
        <li className="dropdown">
          <span>Sản phẩm</span>
          <div className="dropdown-content">
            {categories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`}>
                {category.name}
              </Link>
            ))}
            {categories.length > 5 && <Link to="/products">Thêm</Link>}
          </div>
        </li>
        <li className="dropdown">
          <span>Loại sản phẩm</span>
          <div className="dropdown-content">
            {productTypes.map((type, index) => (
              <Link
                key={index}
                to={`/products/type/${encodeURIComponent(type)}`}
              >
                {type}
              </Link>
            ))}
            {productTypes.length > 5 && <Link to="/products">Thêm</Link>}
          </div>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
