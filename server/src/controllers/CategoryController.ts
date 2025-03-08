import { Request, Response } from 'express'
import Category from '../models/Category'
import path from 'path'
import fs from 'fs'

function sanitizeFolderName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

// Tạo category mới (admin)
// Nếu có file ảnh upload (req.file), xử lý upload và gắn tên file có chứa tên category
export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body
    if (!name) {
      res.status(400).json({ error: 'Category name is required' })
      return
    }

    // Tạo category mới (chưa có imageUrl)
    let category = await Category.create({ name, description })

    // Tạo folder cho category dựa trên tên đã sanitize
    const folderName = sanitizeFolderName(name)
    const categoryFolder = path.join(
      __dirname,
      '../../public/categories',
      folderName
    )
    if (!fs.existsSync(categoryFolder)) {
      fs.mkdirSync(categoryFolder, { recursive: true })
    }

    // Nếu có file được upload, xử lý file và cập nhật imageUrl cho category
    if (req.file) {
      const ext = path.extname(req.file.originalname)
      const fileName = `${folderName}-${Date.now()}${ext}`
      const destPath = path.join(categoryFolder, fileName)
      fs.renameSync(req.file.path, destPath)
      const imageUrl = `/categories/${folderName}/${fileName}`
      category.imageUrl = imageUrl
      await category.save()
    }

    res.status(201).json(category)
  } catch (error) {
    console.error('Error creating category:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Category.findAll({ raw: true })
    res.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id
    const category = await Category.findByPk(id)
    if (!category) {
      res.status(404).json({ error: 'Category not found' })
      return
    }
    res.json(category)
  } catch (error) {
    console.error('Error fetching category by id:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id
    const category = await Category.findByPk(id)
    if (!category) {
      res.status(404).json({ error: 'Category not found' })
      return
    }
    const { name, description } = req.body
    category.name = name || category.name
    category.description = description || category.description

    // Nếu có file mới upload, xử lý và cập nhật imageUrl
    if (req.file) {
      const folderName = sanitizeFolderName(category.name)
      const categoryFolder = path.join(
        __dirname,
        '../../public/categories',
        folderName
      )
      if (!fs.existsSync(categoryFolder)) {
        fs.mkdirSync(categoryFolder, { recursive: true })
      }
      const ext = path.extname(req.file.originalname)
      const fileName = `${folderName}-${Date.now()}${ext}`
      const destPath = path.join(categoryFolder, fileName)
      fs.renameSync(req.file.path, destPath)
      const imageUrl = `/categories/${folderName}/${fileName}`
      category.imageUrl = imageUrl
    }

    await category.save()
    res.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id
    const category = await Category.findByPk(id)
    if (!category) {
      res.status(404).json({ error: 'Category not found' })
      return
    }

    // Lấy folder của category trước khi xóa
    const folderName = sanitizeFolderName(category.name)
    const categoryFolder = path.join(
      __dirname,
      '../../public/categories',
      folderName
    )

    await category.destroy()

    // Xóa folder nếu tồn tại
    if (fs.existsSync(categoryFolder)) {
      fs.rmSync(categoryFolder, { recursive: true, force: true })
    }
    res.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
