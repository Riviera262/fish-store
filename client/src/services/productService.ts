// src/services/productService.ts
import axios from 'axios'

export interface Product {
  id: number
  name: string
  price: number
  description?: string
  stockQuantity?: number
  productType?: string
  categoryId?: number
  imageUrl?: string
  details?: string
  createdAt?: string
  updatedAt?: string
}

// Lấy danh sách tất cả sản phẩm
export const getProducts = async (): Promise<Product[]> => {
  const { data } = await axios.get<Product[]>('/api/products')
  return data
}

// Lấy sản phẩm theo category
export const getProductsByCategory = async (
  categoryId: number
): Promise<Product[]> => {
  const { data } = await axios.get<Product[]>(
    `/api/products/category/${categoryId}`
  )
  return data
}

// Lấy sản phẩm theo productType
export const getProductsByType = async (
  productType: string
): Promise<Product[]> => {
  const { data } = await axios.get<Product[]>(
    `/api/products/type/${productType}`
  )
  return data
}

// Tạo sản phẩm mới
// Dữ liệu gửi lên được đóng gói trong FormData để hỗ trợ upload file (nhiều ảnh)
export const createProduct = async (formData: FormData): Promise<Product> => {
  const { data } = await axios.post<Product>('/api/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

// Cập nhật sản phẩm (admin)
// Dữ liệu gửi lên được đóng gói trong FormData để hỗ trợ upload file (nhiều ảnh)
export const updateProduct = async (
  id: number,
  formData: FormData
): Promise<Product> => {
  const { data } = await axios.put<Product>(`/api/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

// Xóa sản phẩm
export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`/api/products/${id}`)
}

// Lấy thông tin sản phẩm theo id
export const getProductById = async (id: number): Promise<Product> => {
  const { data } = await axios.get<Product>(`/api/products/${id}`)
  return data
}
