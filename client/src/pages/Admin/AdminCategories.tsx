import React, { useEffect, useState, ChangeEvent } from 'react'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category,
} from '../../services/categoryService'

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      console.log('Fetched categories:', data)
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Error fetching categories')
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Sử dụng FormData để gửi file nếu có
      const dataForm = new FormData()
      dataForm.append('name', formData.name)
      dataForm.append('description', formData.description)
      if (imageFile) {
        dataForm.append('image', imageFile)
      }
      if (editingCategory) {
        await updateCategory(editingCategory.id, dataForm)
      } else {
        await createCategory(dataForm)
      }
      setFormData({ name: '', description: '' })
      setImageFile(null)
      setPreviewUrl('')
      setEditingCategory(null)
      fetchCategories()
    } catch (err) {
      console.error('Error saving category:', err)
      setError('Error saving category')
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
    })
    // Nếu có imageUrl, set previewUrl
    setPreviewUrl(category.imageUrl || '')
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id)
      fetchCategories()
    } catch (err) {
      console.error('Error deleting category:', err)
      setError('Error deleting category')
    }
  }

  return (
    <div>
      <h2>Manage Categories</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={formData.name}
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
        <label>
          Upload Image:
          <input type="file" onChange={handleFileChange} accept="image/*" />
        </label>
        <br />
        {previewUrl && (
          <img src={previewUrl} alt="Preview" style={{ maxWidth: '150px' }} />
        )}
        <br />
        <button type="submit">
          {editingCategory ? 'Update Category' : 'Create Category'}
        </button>
        {editingCategory && (
          <button
            type="button"
            onClick={() => {
              setEditingCategory(null)
              setFormData({ name: '', description: '' })
              setImageFile(null)
              setPreviewUrl('')
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <hr />
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>
            <strong>{cat.name}</strong> — {cat.description}
            {cat.imageUrl && (
              <img
                src={cat.imageUrl}
                alt={cat.name}
                style={{ maxWidth: '100px', marginLeft: '10px' }}
              />
            )}
            <button onClick={() => handleEdit(cat)}>Edit</button>
            <button onClick={() => handleDelete(cat.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminCategories
