import express from 'express'
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/CategoryController'
import { authenticateToken, adminOnly } from '../middlewares/authMiddleware'

const router = express.Router()

// Các route admin CRUD cho category
router.post('/', authenticateToken, adminOnly, createCategory)
router.get('/', getAllCategories)
router.get('/:id', getCategoryById)
router.put('/:id', authenticateToken, adminOnly, updateCategory)
router.delete('/:id', authenticateToken, adminOnly, deleteCategory)

export default router
