import express from 'express'
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByType,
} from '../controllers/ProductController'
import { authenticateToken, adminOnly } from '../middlewares/authMiddleware'

const router = express.Router()

// Admin CRUD cho product (chỉ admin mới được phép tạo, cập nhật, xóa)
router.post('/', authenticateToken, adminOnly, createProduct)
router.put('/:id', authenticateToken, adminOnly, updateProduct)
router.delete('/:id', authenticateToken, adminOnly, deleteProduct)

// Public routes cho product
router.get('/', getAllProducts)
router.get('/:id', getProductById)

// Optional endpoints: lọc sản phẩm theo category và productType
router.get('/category/:categoryId', getProductsByCategory)
router.get('/type/:productType', getProductsByType)

export default router
