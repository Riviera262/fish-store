import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'
import Product from './Product'

class CartItem extends Model {
  public id!: number
  public cartId!: number
  public productId!: number
  public quantity!: number
  public price!: number
}

CartItem.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'cart_id',
      references: {
        model: 'carts',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'products', key: 'id' },
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'CartItem', // Nên dùng tên model PascalCase
    tableName: 'cart_items', // Sử dụng tên bảng chính xác như trong DB của bạn
    underscored: true, // Nếu bạn muốn các cột được đặt tên theo kiểu snake_case
  }
)

export default CartItem
