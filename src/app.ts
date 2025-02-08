import express from 'express'
import dotenv from 'dotenv'
import sequelize from './config/db'
import userRoutes from './routes/UserRoute'
import categoryRoutes from './routes/CategoryRoute'
import productRoutes from './routes/ProductRoute'
import './models/relationships'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express()

// Middleware parse JSON
app.use(express.json())
app.use(cookieParser())
// Định nghĩa route cho user
app.use('/users', userRoutes)
app.use('/categories', categoryRoutes)
app.use('/products', productRoutes)

const PORT = process.env.PORT || 3000
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
