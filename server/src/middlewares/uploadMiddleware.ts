// src/middlewares/uploadMiddleware.ts
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const baseUploadFolder = path.join(__dirname, '../../public/uploads')

// Hàm đảm bảo thư mục tồn tại
const ensureDirExists = (folder: string) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true })
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = baseUploadFolder
    // Phân chia folder theo fieldname
    if (file.fieldname === 'avatar') {
      folder = path.join(baseUploadFolder, 'avatars')
    } else if (file.fieldname === 'image') {
      // Dành cho category (một ảnh duy nhất)
      folder = path.join(baseUploadFolder, 'categories')
    } else if (file.fieldname === 'images') {
      // Dành cho product (nhiều ảnh)
      folder = path.join(baseUploadFolder, 'products')
    } else if (file.fieldname === 'bannerImage') {
      folder = path.join(baseUploadFolder, 'banners')
    }
    ensureDirExists(folder)
    cb(null, folder)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    let baseName = file.originalname.replace(ext, '')
    baseName = baseName.toLowerCase().replace(/\s+/g, '-')
    // Thêm timestamp để tránh trùng lặp
    const fileName = `${baseName}-${Date.now()}${ext}`
    cb(null, fileName)
  },
})

const upload = multer({ storage })

export default upload
