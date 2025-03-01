import express from 'express'
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/CategoryController'
import { authenticateToken, adminOnly } from '../middlewares/authMiddleware'
import upload from '../middlewares/uploadMiddleware'

const router = express.Router()

// Tạo category mới: dùng upload.single('image')
router.post(
  '/',
  authenticateToken,
  adminOnly,
  upload.single('image'),
  createCategory
)
router.get('/', getAllCategories)
router.get('/:id', getCategoryById)
router.put(
  '/:id',
  authenticateToken,
  adminOnly,
  upload.single('image'),
  updateCategory
)
router.delete('/:id', authenticateToken, adminOnly, deleteCategory)

export default router
