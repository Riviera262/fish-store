import { Request, Response } from 'express'
import Banner from '../models/Banner'
import path from 'path'
import fs from 'fs'

function sanitizeString(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-')
}

// CREATE BANNER
export const createBanner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, link, startDate, endDate, isActive } = req.body
    if (!title) {
      res.status(400).json({ error: 'Title is required' })
      return
    }

    const bannerName = sanitizeString(title)
    // Tạo folder theo banner name: /public/banners/<bannerName>
    const destFolder = path.join(__dirname, '../../public/banners', bannerName)
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true })
    }

    // Xử lý file upload (dùng upload.single('bannerImage'))
    let imageUrl = ''
    if (req.file) {
      const ext = path.extname(req.file.originalname)
      // Tạo tên file mới dựa trên bannerName và timestamp
      const newFileName = `${bannerName}-${Date.now()}${ext}`
      const destPath = path.join(destFolder, newFileName)
      fs.renameSync(req.file.path, destPath)
      imageUrl = `/banners/${bannerName}/${newFileName}`
    } else {
      res.status(400).json({ error: 'Banner image is required' })
      return
    }

    const banner = await Banner.create({
      title,
      description,
      imageUrl,
      link,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      isActive: isActive !== undefined ? isActive : true,
    })
    res.status(201).json(banner)
    return
  } catch (error) {
    console.error('Error creating banner:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// GET ALL BANNERS

export const getBanners = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const banners = await Banner.findAll()
    res.json(banners)
    return
  } catch (error) {
    console.error('Error fetching banners:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// GET BANNER BY ID
export const getBannerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const banner = await Banner.findByPk(id)
    if (!banner) {
      res.status(404).json({ error: 'Banner not found' })
      return
    }
    res.json(banner)
    return
  } catch (error) {
    console.error('Error fetching banner:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// UPDATE BANNER
export const updateBanner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const banner = await Banner.findByPk(id)
    if (!banner) {
      res.status(404).json({ error: 'Banner not found' })
      return
    }
    const { title, description, link, startDate, endDate, isActive } = req.body

    // Nếu có file mới upload, xử lý ảnh mới
    if (req.file) {
      const ext = path.extname(req.file.originalname)
      // Sử dụng tiêu đề mới nếu có, nếu không giữ tiêu đề cũ của banner
      const bannerName = title
        ? sanitizeString(title)
        : sanitizeString(banner.title)
      const destFolder = path.join(
        __dirname,
        '../../public/banners',
        bannerName
      )
      if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true })
      }
      const newFileName = `${bannerName}-${Date.now()}${ext}`
      const destPath = path.join(destFolder, newFileName)
      fs.renameSync(req.file.path, destPath)
      banner.imageUrl = `/banners/${bannerName}/${newFileName}`
    }
    banner.title = title || banner.title
    banner.description = description || banner.description
    banner.link = link || banner.link
    banner.startDate = startDate ? new Date(startDate) : banner.startDate
    banner.endDate = endDate ? new Date(endDate) : banner.endDate
    banner.isActive = isActive !== undefined ? isActive : banner.isActive
    await banner.save()
    res.json(banner)
    return
  } catch (error) {
    console.error('Error updating banner:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// DELETE BANNER
export const deleteBanner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const banner = await Banner.findByPk(id)
    if (!banner) {
      res.status(404).json({ error: 'Banner not found' })
      return
    }
    // Xóa file ảnh nếu tồn tại
    const imagePath = path.join(__dirname, '../../public', banner.imageUrl)
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath)
    }
    await banner.destroy()
    res.json({ message: 'Banner deleted successfully' })
    return
  } catch (error) {
    console.error('Error deleting banner:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}
