import { Request, Response } from 'express'
import User from '../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import path from 'path'
import fs from 'fs'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'

// Hàm sanitize cho username và email
const sanitizeString = (str: string): string => {
  return str.toLowerCase().replace(/\s+/g, '-')
}

// REGISTER: Tạo user mới, hỗ trợ upload avatar (nếu có), nếu không có sẽ gán default
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role } = req.body

    // Kiểm tra nếu user đã tồn tại
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' })
      return
    }

    // Tạo user mới mà chưa gán avatar
    const user = await User.create({ username, email, password, role })

    if (req.file) {
      const ext = path.extname(req.file.originalname)
      const sanitizedUsername = sanitizeString(username)
      const sanitizedEmail = sanitizeString(email)
      // Tạo folder theo email: /public/avatars/<sanitizedEmail>
      const destFolder = path.join(
        __dirname,
        '../../public/avatars',
        sanitizedEmail
      )
      if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true })
      }
      // Tạo tên file theo cấu trúc: username+email-userId-timestamp.ext
      const newFileName = `${sanitizedUsername}+${sanitizedEmail}-${
        user.id
      }-${Date.now()}${ext}`
      const destPath = path.join(destFolder, newFileName)
      fs.renameSync(req.file.path, destPath)
      // Cập nhật avatar với URL: /avatars/<sanitizedEmail>/<newFileName>
      user.avatar = `/avatars/${sanitizedEmail}/${newFileName}`
      await user.save()
    } else {
      // Nếu không có file avatar, gán avatar default
      user.avatar = '/avatars/default.JPG'
      await user.save()
    }

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    })
    return
  } catch (error) {
    console.error('Error during registration:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// LOGIN: Đăng nhập, trả về token và set cookie HTTP-only
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    const user = await User.findOne({ where: { email } })
    if (!user) {
      res.status(400).json({ error: 'Invalid email or password' })
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid email or password' })
      return
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    })

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    })
    return
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// LOGOUT: Xóa cookie chứa token
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('token')
  res.json({ message: 'Logout successful' })
  return
}

// GET USER PROFILE BY ID
export const getUserProfileById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id || (req.user ? req.user.id : null)
    if (!id) {
      res.status(400).json({ error: 'User id is required' })
      return
    }
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json(user)
    return
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// UPDATE USER PROFILE BY ID
// Nếu có file avatar upload mới, lưu file với tên: username+email-userId-timestamp.ext và cập nhật avatar
export const updateUserProfileById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id || (req.user ? req.user.id : null)
    if (!id) {
      res.status(400).json({ error: 'User id is required' })
      return
    }
    const user = await User.findByPk(id)
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const { username, email, role } = req.body
    user.username = username || user.username
    user.email = email || user.email

    // Nếu cập nhật profile tự thân, không cho phép thay đổi role (trừ admin)
    if (req.params.id && req.user && req.user.role === 'admin' && role) {
      user.role = role
    }

    if (req.file) {
      const ext = path.extname(req.file.originalname)
      // Sử dụng thông tin cập nhật mới nhất
      const sanitizedUsername = sanitizeString(user.username)
      const sanitizedEmail = sanitizeString(user.email)
      // Tạo folder theo email
      const destFolder = path.join(
        __dirname,
        '../../public/avatars',
        sanitizedEmail
      )
      if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true })
      }
      const newFileName = `${sanitizedUsername}+${sanitizedEmail}-${
        user.id
      }-${Date.now()}${ext}`
      const destPath = path.join(destFolder, newFileName)
      fs.renameSync(req.file.path, destPath)
      user.avatar = `/avatars/${sanitizedEmail}/${newFileName}`
    }

    await user.save()
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    })
    return
  } catch (error) {
    console.error('Error updating user profile:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// ---------------------- ADMIN CRUD ----------------------

// GET ALL USERS (admin)
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } })
    res.json(users)
    return
  } catch (error) {
    console.error('Error fetching all users:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// GET USER BY ID (admin)
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id
    if (!id) {
      res.status(400).json({ error: 'User id is required' })
      return
    }
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json(user)
    return
  } catch (error) {
    console.error('Error fetching user by id:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// UPDATE USER (admin)
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id
    if (!id) {
      res.status(400).json({ error: 'User id is required' })
      return
    }
    const user = await User.findByPk(id)
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    const { username, email, role } = req.body
    user.username = username || user.username
    user.email = email || user.email
    user.role = role || user.role
    await user.save()
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    })
    return
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// DELETE USER (admin)
// Nếu avatar của user không phải là avatar mặc định, xóa luôn file ảnh tương ứng
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id
    if (!id) {
      res.status(400).json({ error: 'User id is required' })
      return
    }
    const user = await User.findByPk(id)
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    // Nếu avatar của user không phải là avatar mặc định, xóa file ảnh đó
    if (user.avatar && user.avatar !== '/avatars/default.JPG') {
      const avatarPath = path.join(__dirname, '../../public', user.avatar)
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath)
      }
    }
    await user.destroy()
    res.json({ message: 'User and associated avatar deleted successfully' })
    return
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}
