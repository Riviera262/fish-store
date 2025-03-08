import React, { useState, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../services/authService'
import './Auth.css'

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>('')

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const dataForm = new FormData()
      dataForm.append('username', username)
      dataForm.append('email', email)
      dataForm.append('password', password)
      if (avatarFile) {
        dataForm.append('avatar', avatarFile)
      }
      await register(dataForm)
      navigate('/login')
    } catch (error: any) {
      console.error('Registration failed:', error)
      alert(
        'Registration failed: ' + (error.response?.data?.error || error.message)
      )
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0])
      setAvatarPreview(URL.createObjectURL(e.target.files[0]))
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form register-form">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="avatar-preview-container">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="avatar-preview"
              />
            ) : (
              <div className="avatar-placeholder">No Avatar</div>
            )}
          </div>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
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
          <label>
            Avatar:
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
          <button type="submit" className="auth-button">
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
