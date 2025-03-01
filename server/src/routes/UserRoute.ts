import express from 'express'
import {
  register,
  login,
  logout,
  getUserProfileById,
  updateUserProfileById,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/UserController'
import { authenticateToken, adminOnly } from '../middlewares/authMiddleware'
import upload from '../middlewares/uploadMiddleware'

const router = express.Router()

// Public routes
router.post('/register', upload.single('avatar'), register)
router.post('/login', login)

// Routes yêu cầu xác thực
router.get('/logout', authenticateToken, logout)
// Profile routes: nếu có hoặc không có id
router.get('/profile/:id?', authenticateToken, getUserProfileById)
router.put(
  '/profile/:id?',
  authenticateToken,
  upload.single('avatar'),
  updateUserProfileById
)

// Admin CRUD routes
router.get('/', authenticateToken, adminOnly, getAllUsers)
router.get('/:id', authenticateToken, adminOnly, getUserById)
router.put('/:id', authenticateToken, adminOnly, updateUser)
router.delete('/:id', authenticateToken, adminOnly, deleteUser)

export default router
