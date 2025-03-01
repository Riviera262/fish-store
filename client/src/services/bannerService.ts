import axios from 'axios'

export interface Banner {
  id: number
  title: string
  description?: string
  imageUrl: string
  link?: string
  startDate?: string
  endDate?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export const getBanners = async (): Promise<Banner[]> => {
  const { data } = await axios.get<Banner[]>('/api/banners')
  return data
}
