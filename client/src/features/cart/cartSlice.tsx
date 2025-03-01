// src/features/cart/cartSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { fetchCartAPI, addToCartAPI } from '../../services/cartService'

interface CartItem {
  id: number
  productId: number
  name: string
  price: number
  quantity: number
  total: number
}

interface CartState {
  cartItems: CartItem[]
  totalAmount: number
  status: 'idle' | 'loading' | 'failed'
}

const initialState: CartState = {
  cartItems: [],
  totalAmount: 0,
  status: 'idle',
}

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await fetchCartAPI()
  return response
})

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: number; quantity: number }) => {
    const response = await addToCartAPI(productId, quantity)
    return response
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartLocal: (state) => {
      state.cartItems = []
      state.totalAmount = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'idle'
        state.cartItems = action.payload.cartItems
        state.totalAmount = action.payload.totalAmount
      })
      .addCase(fetchCart.rejected, (state) => {
        state.status = 'failed'
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<any>) => {
        // Sau khi thêm thành công, bạn có thể refresh giỏ hàng bằng fetchCart
        // hoặc cập nhật state tại đây nếu muốn.
      })
  },
})

export const { clearCartLocal } = cartSlice.actions
export default cartSlice.reducer
