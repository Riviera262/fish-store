import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../app/store'
import { clearUser } from '../features/auth/authSlice'
import { fetchCart } from '../features/cart/cartSlice'
import axios from 'axios'
import './Header.css'

axios.defaults.withCredentials = true

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)
  const cartItems = useSelector((state: RootState) => state.cart.cartItems)
  const cartCount = cartItems ? cartItems.length : 0

  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = async () => {
    try {
      await axios.get('/api/users/logout')
      dispatch(clearUser())
      navigate('/login')
    } catch (err: any) {
      console.error('Error during logout:', err)
      alert('Failed to logout')
    }
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Xử lý logic search (ví dụ: navigate đến trang kết quả search)
    console.log('Search query:', searchQuery)
  }

  return (
    <header className="home-header">
      <div className="header-top">
        <h2>Welcome to Fish Store!</h2>
        {/* Thanh Search */}
        <form onSubmit={handleSearch} className="header-search">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <div className="header-links">
          {user ? (
            <>
              <span>Hello, {user.username}</span>
              <Link to="/cart" className="header-link">
                Cart ({cartCount})
              </Link>
              <button onClick={handleLogout} className="header-button">
                Logout
              </button>
              {user.role === 'admin' && (
                <Link to="/admin" className="header-link">
                  Admin Dashboard
                </Link>
              )}
            </>
          ) : (
            <nav>
              <ul className="nav-list">
                <li>
                  <Link to="/login" className="header-link">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="header-link">
                    Register
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
