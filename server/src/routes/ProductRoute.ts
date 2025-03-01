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
import upload from '../middlewares/uploadMiddleware'

const router = express.Router()

// Admin CRUD cho product: sử dụng upload.array để cho phép upload nhiều ảnh (field 'images')
router.post(
  '/',
  authenticateToken,
  adminOnly,
  upload.array('images', 5),
  createProduct
)
router.put(
  '/:id',
  authenticateToken,
  adminOnly,
  upload.array('images', 5),
  updateProduct
)
router.delete('/:id', authenticateToken, adminOnly, deleteProduct)

// Public routes cho product
router.get('/', getAllProducts)
router.get('/:id', getProductById)

// Endpoints lọc sản phẩm theo category hoặc productType
router.get('/category/:categoryId', getProductsByCategory)
router.get('/type/:productType', getProductsByType)

export default router
