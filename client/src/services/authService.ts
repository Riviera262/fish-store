import axios from 'axios'

export interface LoginResponse {
  user: {
    id: number
    avatar: string
    username: string
    email: string
    role: string
    // các trường khác nếu cần
  }
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>('/api/users/login', {
    email,
    password,
  })
  return response.data
}

export interface RegisterResponse {
  id: number
  avatar: string
  username: string
  email: string
  role: string
}

export const register = async (data: FormData): Promise<RegisterResponse> => {
  const response = await axios.post<RegisterResponse>(
    '/api/users/register',
    data,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  )
  return response.data
}
