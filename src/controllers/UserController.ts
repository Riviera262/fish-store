import { Request, Response } from 'express'
import User from '../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'

// REGISTER: Tạo user mới
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, passwordHash, role } = req.body

    // Kiểm tra nếu user đã tồn tại
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' })
      return
    }

    // Tạo user mới (passwordHash sẽ được băm qua hook trong model nếu cấu hình sẵn)
    const user = await User.create({ username, email, passwordHash, role })
    res.status(201).json(user)
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
    const { email, passwordHash } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) {
      res.status(400).json({ error: 'Invalid email or password' })
      return
    }

    // So sánh mật khẩu (ở đây passwordHash trong request chứa password dạng text)
    const isMatch = await bcrypt.compare(passwordHash, user.passwordHash)
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid email or password' })
      return
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    })

    // Set token vào cookie (HTTP-only, secure nếu production)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 giờ
    })

    res.json({ token, user })
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

// GET USER PROFILE BY ID:
// Nếu có id trong URL (GET /users/profile/:id) thì trả về profile của user đó.
// Nếu không có id, lấy thông tin của người gọi từ req.user (đã được middleware authenticateToken gắn)
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
      attributes: { exclude: ['passwordHash'] },
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

// UPDATE USER PROFILE BY ID:
// Nếu có id trong URL (PUT /users/profile/:id) thì cập nhật profile của user đó (cho admin/staff).
// Nếu không có id, cập nhật profile của chính người gọi và không cho phép tự cập nhật role.
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

    // Nếu người dùng tự cập nhật profile (không truyền id hoặc id trùng với req.user.id),
    // thì không cho phép cập nhật role. Nếu có id và người gọi có quyền admin, role có thể được cập nhật.
    if (req.params.id && req.user && req.user.role === 'admin' && role) {
      user.role = role
    }

    await user.save()
    res.json(user)
    return
  } catch (error) {
    console.error('Error updating user profile:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// ---------------------- ADMIN CRUD ----------------------

// GET ALL USERS (admin): Lấy danh sách tất cả user
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] },
    })
    res.json(users)
    return
  } catch (error) {
    console.error('Error fetching all users:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// GET USER BY ID (admin): Lấy thông tin user theo id
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
      attributes: { exclude: ['passwordHash'] },
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

// UPDATE USER (admin): Cập nhật thông tin user theo id (cho admin, cập nhật toàn bộ các trường, bao gồm role)
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
    res.json(user)
    return
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// DELETE USER (admin): Xóa user theo id
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
    await user.destroy()
    res.json({ message: 'User deleted successfully' })
    return
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}
