import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'
import CartItem from './CartItem'

class Cart extends Model {
  public id!: number
  public userId!: number
}

Cart.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',
    underscored: true, // vẫn tự động map các trường timestamp
    timestamps: true,
  }
)

export default Cart
