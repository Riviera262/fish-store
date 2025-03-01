// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: number
  username: string
  email: string
  role: string // Thông tin role vẫn có nhưng chỉ lưu tạm trong bộ nhớ
}

interface AuthState {
  user: User | null
}

const initialState: AuthState = {
  user: null, // Không lấy từ localStorage để tránh lưu dữ liệu nhạy cảm trên FE
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      // Không lưu vào localStorage
    },
    clearUser: (state) => {
      state.user = null
    },
  },
})

export const { setUser, clearUser } = authSlice.actions
export default authSlice.reducer
