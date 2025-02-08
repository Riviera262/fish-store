import { Request, Response } from 'express'
import Category from '../models/Category'

// Tạo category mới (admin)
export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, status } = req.body
    if (!name) {
      res.status(400).json({ error: 'Category name is required' })
      return
    }
    const category = await Category.create({ name, description, status })
    res.status(201).json(category)
    return
  } catch (error) {
    console.error('Error creating category:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// Lấy danh sách tất cả category (public)
export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Category.findAll()
    res.json(categories)
    return
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// Lấy thông tin category theo id (public)
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
    return
  } catch (error) {
    console.error('Error fetching category by id:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// Cập nhật category (admin)
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
    const { name, description, status } = req.body
    category.name = name || category.name
    category.description = description || category.description
    category.status = status || category.status
    await category.save()
    res.json(category)
    return
  } catch (error) {
    console.error('Error updating category:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// Xóa category (admin)
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
    await category.destroy()
    res.json({ message: 'Category deleted successfully' })
    return
  } catch (error) {
    console.error('Error deleting category:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}
