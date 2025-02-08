import { Request, Response } from 'express'
import Product from '../models/Product'
import Category from '../models/Category'

// Tạo product mới (admin)
// Yêu cầu: cần có các trường bắt buộc: name, price, productType, categoryId
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      price,
      stockQuantity,
      imageUrl,
      productType,
      categoryId,
    } = req.body
    if (!name || !price || !productType || !categoryId) {
      res
        .status(400)
        .json({
          error:
            'Missing required fields: name, price, productType, categoryId',
        })
      return
    }
    // Kiểm tra xem category có tồn tại không
    const category = await Category.findByPk(categoryId)
    if (!category) {
      res.status(400).json({ error: 'Invalid categoryId' })
      return
    }
    const product = await Product.create({
      name,
      description,
      price,
      stockQuantity,
      imageUrl,
      productType,
      categoryId,
    })
    res.status(201).json(product)
    return
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// Lấy danh sách sản phẩm
// Có thể lọc theo categoryId và/hoặc productType thông qua query parameters
export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { categoryId, productType } = req.query
    const whereClause: any = {}
    if (categoryId) {
      whereClause.categoryId = categoryId
    }
    if (productType) {
      whereClause.productType = productType
    }
    const products = await Product.findAll({ where: whereClause })
    res.json(products)
    return
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// Lấy thông tin product theo id
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id
    const product = await Product.findByPk(id)
    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }
    res.json(product)
    return
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// Cập nhật product (admin)
// Nếu cung cấp categoryId mới thì cần kiểm tra sự tồn tại của category đó.
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id
    const product = await Product.findByPk(id)
    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }
    const {
      name,
      description,
      price,
      stockQuantity,
      imageUrl,
      productType,
      categoryId,
    } = req.body
    if (categoryId) {
      const category = await Category.findByPk(categoryId)
      if (!category) {
        res.status(400).json({ error: 'Invalid categoryId' })
        return
      }
      product.categoryId = categoryId
    }
    product.name = name || product.name
    product.description = description || product.description
    product.price = price || product.price
    product.stockQuantity = stockQuantity || product.stockQuantity
    product.imageUrl = imageUrl || product.imageUrl
    product.productType = productType || product.productType
    await product.save()
    res.json(product)
    return
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// Xóa product (admin)
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id
    const product = await Product.findByPk(id)
    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }
    await product.destroy()
    res.json({ message: 'Product deleted successfully' })
    return
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// Lấy danh sách sản phẩm theo category (có thể sử dụng nếu không dùng query params)
export const getProductsByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categoryId = req.params.categoryId
    if (!categoryId) {
      res.status(400).json({ error: 'Category id is required' })
      return
    }
    const products = await Product.findAll({ where: { categoryId } })
    res.json(products)
    return
  } catch (error) {
    console.error('Error fetching products by category:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

// Lấy danh sách sản phẩm theo productType (có thể sử dụng nếu không dùng query params)
export const getProductsByType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productType = req.params.productType
    if (!productType) {
      res.status(400).json({ error: 'Product type is required' })
      return
    }
    const products = await Product.findAll({ where: { productType } })
    res.json(products)
    return
  } catch (error) {
    console.error('Error fetching products by type:', error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}
