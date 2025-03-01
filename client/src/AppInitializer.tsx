// src/AppInitializer.tsx
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setUser, User } from './features/auth/authSlice'
import { AppDispatch } from './app/store'

interface AppInitializerProps {
  children: React.ReactNode
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Sử dụng generic <User> để xác định rằng response.data có kiểu User.
        // Ta dùng destructuring để lấy data, tránh sử dụng AxiosResponse.
        const { data } = await axios.get<User>('/api/users/profile')
        dispatch(setUser(data))
      } catch (error) {
        console.error('Failed to fetch user profile', error)
        // Nếu cần, có thể xử lý lỗi ở đây
      }
    }

    fetchUserProfile()
  }, [dispatch])

  return <>{children}</>
}

export default AppInitializer
