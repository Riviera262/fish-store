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

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)

// Các route yêu cầu xác thực
router.get('/logout', authenticateToken, logout)

// Profile routes:
// Nếu gọi GET /users/profile hoặc GET /users/profile/:id, controller sẽ xử lý theo logic đã nêu.
router.get('/profile/:id?', authenticateToken, getUserProfileById)
// Nếu gọi PUT /users/profile hoặc PUT /users/profile/:id, controller sẽ xử lý cập nhật profile.
router.put('/profile/:id?', authenticateToken, updateUserProfileById)

// Các route admin CRUD (chỉ admin mới được phép)
// Lấy danh sách tất cả user
router.get('/', authenticateToken, adminOnly, getAllUsers)
// Lấy thông tin user theo id
router.get('/:id', authenticateToken, adminOnly, getUserById)
// Cập nhật user theo id
router.put('/:id', authenticateToken, adminOnly, updateUser)
// Xóa user theo id
router.delete('/:id', authenticateToken, adminOnly, deleteUser)

export default router
