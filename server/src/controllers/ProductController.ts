import { Request, Response } from 'express'
import Product from '../models/Product'
import ProductImage from '../models/ProductImage'
import Category from '../models/Category'
import path from 'path'
import fs from 'fs'

function sanitizeFolderName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

// Tạo product mới (admin)
// Nếu có nhiều file ảnh (req.files), di chuyển các file từ public/uploads đến
// public/categories/{categoryFolderName}/products/{productFolderName}
// Lưu ảnh đầu tiên làm ảnh chính (Product.imageUrl) và tất cả ảnh vào bảng product_images.
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log('createProduct - Request body:', req.body)
    console.log('createProduct - Request files:', req.files)

    const { name, description, price, stockQuantity, productType, categoryId } =
      req.body

    if (!name || !price || !productType || !categoryId) {
      res.status(400).json({
        error: 'Missing required fields: name, price, productType, categoryId',
      })
      return
    }

    // Kiểm tra xem category có tồn tại không
    const category = await Category.findByPk(categoryId)
    if (!category) {
      res.status(400).json({ error: 'Invalid categoryId' })
      return
    }

    // Tạo folder cho category dựa trên tên đã sanitize
    const categoryFolderName = sanitizeFolderName(category.name)
    const baseCategoryFolder = path.join(
      __dirname,
      '../../public/categories',
      categoryFolderName
    )
    if (!fs.existsSync(baseCategoryFolder)) {
      fs.mkdirSync(baseCategoryFolder, { recursive: true })
    }

    // Tạo folder cho product bên trong category: /categories/{categoryFolderName}/products/{productFolderName}
    const productFolderName = sanitizeFolderName(name)
    const productFolder = path.join(
      baseCategoryFolder,
      'products',
      productFolderName
    )
    if (!fs.existsSync(productFolder)) {
      fs.mkdirSync(productFolder, { recursive: true })
    }

    let mainImageUrl: string | null = null
    let imageUrls: string[] = []
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      // Sử dụng tên sản phẩm đã sanitize để tạo tên file mới cho mỗi file
      req.files.forEach((file, index) => {
        const ext = path.extname(file.originalname)
        const newFileName = `${productFolderName}-${Date.now()}-${index}${ext}`
        const destPath = path.join(productFolder, newFileName)
        console.log(`Moving file from ${file.path} to ${destPath}`)
        fs.renameSync(file.path, destPath)
        // Đường dẫn URL mới theo cấu trúc yêu cầu
        const url = `/categories/${categoryFolderName}/products/${productFolderName}/${newFileName}`
        imageUrls.push(url)
      })
      mainImageUrl = imageUrls[0]
    } else {
      console.log('No file uploaded.')
    }

    // Tạo sản phẩm
    const product = await Product.create({
      name,
      description,
      price,
      stockQuantity,
      imageUrl: mainImageUrl,
      productType,
      categoryId,
    })

    // Lưu tất cả ảnh vào bảng product_images nếu có
    if (imageUrls.length > 0) {
      for (const url of imageUrls) {
        await ProductImage.create({
          productId: product.id,
          imageUrl: url,
        })
      }
    }

    console.log('Product created successfully:', product)
    res.status(201).json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Cập nhật product (admin)
// Nếu có file ảnh mới (nhiều file), xử lý tương tự như createProduct với đường dẫn mới
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

    const { name, description, price, stockQuantity, productType, categoryId } =
      req.body

    // Nếu thay đổi category hoặc có file mới, cập nhật folder dựa trên category hiện tại
    let category = null
    if (categoryId) {
      category = await Category.findByPk(categoryId)
      if (!category) {
        res.status(400).json({ error: 'Invalid categoryId' })
        return
      }
      product.categoryId = categoryId
    } else {
      category = await Category.findByPk(product.categoryId)
    }

    if (
      category &&
      req.files &&
      Array.isArray(req.files) &&
      req.files.length > 0
    ) {
      // Xác định folder cho category
      const categoryFolderName = sanitizeFolderName(category.name)
      const baseCategoryFolder = path.join(
        __dirname,
        '../../public/categories',
        categoryFolderName
      )
      if (!fs.existsSync(baseCategoryFolder)) {
        fs.mkdirSync(baseCategoryFolder, { recursive: true })
      }

      // Dùng tên mới nếu có, nếu không giữ nguyên tên cũ của product
      const productFolderName = name
        ? sanitizeFolderName(name)
        : sanitizeFolderName(product.name)
      const productFolder = path.join(
        baseCategoryFolder,
        'products',
        productFolderName
      )
      if (!fs.existsSync(productFolder)) {
        fs.mkdirSync(productFolder, { recursive: true })
      }

      let imageUrls: string[] = []
      req.files.forEach((file, index) => {
        const ext = path.extname(file.originalname)
        const newFileName = `${productFolderName}-${Date.now()}-${index}${ext}`
        const destPath = path.join(productFolder, newFileName)
        fs.renameSync(file.path, destPath)
        const url = `/categories/${categoryFolderName}/products/${productFolderName}/${newFileName}`
        imageUrls.push(url)
      })
      if (imageUrls.length > 0) {
        product.imageUrl = imageUrls[0]
        for (const url of imageUrls) {
          await ProductImage.create({
            productId: product.id,
            imageUrl: url,
          })
        }
      }
    }

    // Cập nhật các trường khác
    product.name = name || product.name
    product.description = description || product.description
    product.price = price || product.price
    product.stockQuantity = stockQuantity || product.stockQuantity
    product.productType = productType || product.productType

    await product.save()
    res.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

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
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

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
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getProductsByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categoryIdParam = req.params.categoryId
    if (!categoryIdParam) {
      res.status(400).json({ error: 'Category id is required' })
      return
    }
    const categoryId = parseInt(categoryIdParam, 10)
    const products = await Product.findAll({ where: { categoryId } })
    res.json(products)
  } catch (error) {
    console.error('Error fetching products by category:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

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
  } catch (error) {
    console.error('Error fetching products by type:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Xóa sản phẩm (admin)
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

    // Lấy thông tin category để xây dựng đường dẫn folder ảnh
    const category = await Category.findByPk(product.categoryId)
    if (category) {
      const categoryFolderName = sanitizeFolderName(category.name)
      const productFolderName = sanitizeFolderName(product.name)
      const productFolderPath = path.join(
        __dirname,
        '../../public/categories',
        categoryFolderName,
        'products',
        productFolderName
      )
      // Nếu folder sản phẩm tồn tại, xóa folder đó cùng với tất cả ảnh bên trong
      if (fs.existsSync(productFolderPath)) {
        fs.rmSync(productFolderPath, { recursive: true, force: true })
        console.log(`Deleted folder: ${productFolderPath}`)
      }
    }

    // Xóa các dòng ảnh liên quan đến product trong bảng product_images
    await ProductImage.destroy({ where: { productId: product.id } })

    // Xóa sản phẩm
    await product.destroy()
    res.json({ message: 'Product and associated images deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
