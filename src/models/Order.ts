import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/db'

class Order extends Model {
  public id!: number
  public userId!: number
  public totalAmount!: number
  public status!: string
  public shippingAddress!: string
}

Order.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      field: 'total_amount',
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'pending',
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      field: 'shipping_address',
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
    underscored: true,
  }
)

export default Order
