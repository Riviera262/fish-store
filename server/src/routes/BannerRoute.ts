import express from 'express'
import {
  createBanner,
  getBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from '../controllers/BannerController'
import { authenticateToken, adminOnly } from '../middlewares/authMiddleware'
import upload from '../middlewares/uploadMiddleware'

const router = express.Router()

// Admin CRUD for banners; sử dụng upload.single('bannerImage') để xử lý ảnh banner.
router.post(
  '/',
  authenticateToken,
  adminOnly,
  upload.single('bannerImage'),
  createBanner
)
router.get('/', getBanners)
router.get('/:id', getBannerById)
router.put(
  '/:id',
  authenticateToken,
  adminOnly,
  upload.single('bannerImage'),
  updateBanner
)
router.delete('/:id', authenticateToken, adminOnly, deleteBanner)

export default router
