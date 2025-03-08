import axios from 'axios'

export interface Category {
  id: number
  name: string
  description?: string
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get<Category[]>('/api/categories')
  return data
}

// Sử dụng FormData nếu có file upload
export const createCategory = async (
  categoryData: FormData
): Promise<Category> => {
  const { data } = await axios.post<Category>('/api/categories', categoryData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const updateCategory = async (
  id: number,
  categoryData: FormData
): Promise<Category> => {
  const { data } = await axios.put<Category>(
    `/api/categories/${id}`,
    categoryData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  )
  return data
}

export const deleteCategory = async (id: number): Promise<void> => {
  await axios.delete(`/api/categories/${id}`)
}
