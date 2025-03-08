import React, { useEffect, useState, ChangeEvent } from 'react'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
} from '../../services/productService'
import { getCategories, Category } from '../../services/categoryService'

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string>('')

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    productType: '',
    categoryId: '',
    status: 'active', // Trường status mới, mặc định là 'active'
  })
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [imageFiles, setImageFiles] = useState<FileList | null>(null)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const fetchProducts = async () => {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      console.error(err)
      setError('Error fetching products')
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      console.error(err)
      setError('Error fetching categories')
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFiles(e.target.files)
      const urls = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      )
      setPreviewUrls(urls)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const dataForm = new FormData()
      dataForm.append('name', formData.name)
      dataForm.append('price', formData.price)
      dataForm.append('description', formData.description)
      dataForm.append('productType', formData.productType)
      dataForm.append('categoryId', formData.categoryId)
      dataForm.append('status', formData.status) // Gắn trường status vào formData
      if (imageFiles) {
        Array.from(imageFiles).forEach((file) => {
          dataForm.append('images', file)
        })
      }
      if (editingProduct) {
        await updateProduct(editingProduct.id, dataForm)
      } else {
        await createProduct(dataForm)
      }
      setFormData({
        name: '',
        price: '',
        description: '',
        productType: '',
        categoryId: '',
        status: 'active',
      })
      setImageFiles(null)
      setPreviewUrls([])
      setEditingProduct(null)
      fetchProducts()
    } catch (err) {
      console.error(err)
      setError('Error saving product')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: String(product.price),
      description: product.description || '',
      productType: product.productType || '',
      categoryId: product.categoryId ? String(product.categoryId) : '',
      status: product.status || 'active',
    })
    setImageFiles(null)
    setPreviewUrls([])
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id)
      fetchProducts()
    } catch (err) {
      console.error(err)
      setError('Error deleting product')
    }
  }

  // Các option mặc định cho productType (có thể mở rộng sau này)
  const productTypeOptions = ['fish', 'accessory', 'decoration']

  return (
    <div>
      <h2>Manage Products</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <br />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <br />
        {/* Bỏ stockQuantity */}
        <label htmlFor="productType">Product Type:</label>
        <input
          list="productTypeOptions"
          id="productType"
          name="productType"
          value={formData.productType}
          onChange={handleInputChange}
          required
        />
        <datalist id="productTypeOptions">
          {productTypeOptions.map((type) => (
            <option key={type} value={type} />
          ))}
        </datalist>
        <br />
        <label htmlFor="categoryId">Category:</label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleInputChange}
          required
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <br />
        <label>
          Images:
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*"
          />
        </label>
        <br />
        {/* Preview các ảnh đã chọn */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          {previewUrls.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`preview-${idx}`}
              style={{ maxWidth: '100px' }}
            />
          ))}
        </div>
        <br />
        <button type="submit">
          {editingProduct ? 'Update Product' : 'Create Product'}
        </button>
        {editingProduct && (
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null)
              setFormData({
                name: '',
                price: '',
                description: '',
                productType: '',
                categoryId: '',
                status: 'active',
              })
              setImageFiles(null)
              setPreviewUrls([])
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <hr />
      <ul>
        {products.map((prod) => (
          <li key={prod.id}>
            <strong>{prod.name}</strong> - ${prod.price} - {prod.productType} -{' '}
            Status: {prod.status}{' '}
            {prod.imageUrl && (
              <img
                src={`http://localhost:3000${prod.imageUrl}`}
                alt={prod.name}
                style={{ maxWidth: '100px', marginLeft: '10px' }}
              />
            )}
            <button onClick={() => handleEdit(prod)}>Edit</button>
            <button onClick={() => handleDelete(prod.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminProducts
