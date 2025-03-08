import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login, LoginResponse } from '../services/authService'
import { setUser } from '../features/auth/authSlice'
import { AppDispatch } from '../app/store'
import './Auth.css'

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const data: LoginResponse = await login(email, password)
      dispatch(setUser(data.user))
      console.log('Login successful:', data)
      navigate('/')
    } catch (error: any) {
      console.error('Login failed:', error)
      alert('Login failed: ' + (error.response?.data?.error || error.message))
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
