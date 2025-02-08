import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/db'
import User from './User'

class Cart extends Model {
  public id!: number
  public userId!: number
}

Cart.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',
    timestamps: true,
    underscored: true,
  }
)

export default Cart
