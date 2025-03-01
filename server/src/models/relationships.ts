import User from './User'
import Category from './Category'
import Product from './Product'
import Order from './Order'
import OrderItem from './OrderItem'
import Cart from './Cart'
import CartItem from './CartItem'
import ProductImage from './ProductImage'

// Quan hệ giữa User và Cart
User.hasOne(Cart, { foreignKey: 'user_id', onDelete: 'CASCADE' })
Cart.belongsTo(User, { foreignKey: 'user_id' })

// Quan hệ giữa Cart và CartItem
Cart.hasMany(CartItem, { foreignKey: 'cart_id', onDelete: 'CASCADE' })
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' })

// Quan hệ giữa Product và CartItem
Product.hasMany(CartItem, { foreignKey: 'product_id', onDelete: 'CASCADE' })
CartItem.belongsTo(Product, { foreignKey: 'product_id' })

//Quan hệ giữa Product và ProductImage
Product.hasMany(ProductImage, { foreignKey: 'product_id', onDelete: 'CASCADE' })
ProductImage.belongsTo(Product, { foreignKey: 'product_id' })

// Quan hệ giữa User và Order
User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'CASCADE' })
Order.belongsTo(User, { foreignKey: 'user_id' })

// Quan hệ giữa Order và OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' })
OrderItem.belongsTo(Order, { foreignKey: 'order_id' })

// Quan hệ giữa Product và OrderItem
Product.hasMany(OrderItem, { foreignKey: 'product_id', onDelete: 'CASCADE' })
OrderItem.belongsTo(Product, { foreignKey: 'product_id' })

// Quan hệ giữa Category và Product
Category.hasMany(Product, { foreignKey: 'category_id', onDelete: 'SET NULL' })
Product.belongsTo(Category, { foreignKey: 'category_id' })

export { User, Category, Product, Order, OrderItem, Cart, CartItem }
