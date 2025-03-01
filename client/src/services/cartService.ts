// src/services/cartService.ts
import axios from 'axios'

export const fetchCartAPI = async () => {
  const response = await axios.get('/api/cart')
  return response.data
}

export const addToCartAPI = async (productId: number, quantity: number) => {
  const response = await axios.post('/api/cart', { productId, quantity })
  return response.data
}

export const removeFromCartAPI = async (cartItemId: number) => {
  const response = await axios.delete(`/api/cart/${cartItemId}`)
  return response.data
}

export const updateCartItemAPI = async (
  cartItemId: number,
  quantity: number
) => {
  const response = await axios.put('/api/cart/item', { cartItemId, quantity })
  return response.data
}
