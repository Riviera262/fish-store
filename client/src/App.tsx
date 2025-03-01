// src/App.tsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'

import CategoryProductsPage from './pages/CategoryProductsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage' // Trang giỏ hàng (ví dụ)
import AdminDashboard from './pages/Admin/AdminDashBoard'
import AdminCategories from './pages/Admin/AdminCategories'
import AdminProducts from './pages/Admin/AdminProducts'
import ProductDetail from './components/ProductDetail'
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/category/:categoryId" element={<CategoryProductsPage />} />
      <Route path="/product/:productId" element={<ProductDetail />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/admin" element={<AdminDashboard />}>
        <Route path="categories" element={<AdminCategories />} />
        <Route path="products" element={<AdminProducts />} />
      </Route>
    </Routes>
  )
}

export default App
