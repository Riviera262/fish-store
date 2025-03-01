import React, { useEffect, useState } from 'react'
import { getBanners } from '../services/bannerService'
import './Banner.css'

interface BannerType {
  id: number
  title: string
  description?: string
  imageUrl: string
  link?: string
}

const Banner: React.FC = () => {
  const [banners, setBanners] = useState<BannerType[]>([])
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bannerData = await getBanners()
        setBanners(bannerData)
      } catch (error) {
        console.error('Error fetching banners:', error)
        setError('Error fetching banners')
      }
    }
    fetchData()
  }, [])

  // Nếu không có banner nào, hiển thị hình mặc định và cho phép nhấn vào banner
  if (banners.length === 0) {
    return (
      <div className="banner">
        <a href="/default-link">
          <img src="/banners/nobanner.JPG" alt="No Banner" />
        </a>
      </div>
    )
  }

  // Hiển thị banner đầu tiên (có thể mở rộng thành carousel nếu cần)
  const banner = banners[0]
  return (
    <div className="banner">
      <a href={banner.link || '/default-link'}>
        <img src={banner.imageUrl} alt={banner.title} />
      </a>
    </div>
  )
}

export default Banner
