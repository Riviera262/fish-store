import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/db'

class OrderItem extends Model {
  public id!: number
  public orderId!: number
  public productId!: number
  public quantity!: number
  public unitPrice!: number
  public discount!: number
}

OrderItem.init(
  {
    orderId: {
      type: DataTypes.INTEGER,
      field: 'order_id',
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      field: 'product_id',
      references: {
        model: 'products',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      field: 'unit_price',
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
    timestamps: true,
    underscored: true,
  }
)

export default OrderItem
