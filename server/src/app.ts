import express from 'express'
import dotenv from 'dotenv'
import sequelize from './config/db'
import userRoutes from './routes/UserRoute'
import categoryRoutes from './routes/CategoryRoute'
import productRoutes from './routes/ProductRoute'
import cartRoutes from './routes/CartRoute'
import bannerRoutes from './routes/BannerRoute'
import './models/relationships'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()
const app = express()
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
// Middleware parse JSON
app.use(express.json())
// Cấu hình phục vụ file tĩnh từ thư mục public
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
// Định nghĩa route cho user
app.use('/api/users', userRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/banners', bannerRoutes)
const PORT = process.env.PORT || 3001
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('✅ Database connected and synced!')
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ Unable to connect to the database:', err)
  })

export default app
