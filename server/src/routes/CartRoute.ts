import express from 'express'
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from '../controllers/CartController'
import { authenticateToken } from '../middlewares/authMiddleware'

const router = express.Router()

router.post('/', authenticateToken, addToCart)
router.get('/', authenticateToken, getCart)
router.delete('/:cartItemId', authenticateToken, removeFromCart)
router.put('/item', authenticateToken, updateCartItem)
export default router
