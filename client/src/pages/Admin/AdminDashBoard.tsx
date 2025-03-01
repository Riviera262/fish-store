// src/pages/AdminDashboard.tsx
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store'
import { Link, Outlet, Navigate } from 'react-router-dom'

const AdminDashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user)

  // Chỉ admin mới được truy cập dashboard
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link to="categories">Manage Categories</Link>
          </li>
          <li>
            <Link to="products">Manage Products</Link>
          </li>
        </ul>
      </nav>
      <hr />
      <Outlet />
    </div>
  )
}

export default AdminDashboard
