import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/db'

class CartItem extends Model {
  public id!: number
  public cartId!: number
  public productId!: number
  public quantity!: number
  public price!: number // Giá được lưu tại thời điểm thêm sản phẩm vào giỏ
}

CartItem.init(
  {
    cartId: {
      type: DataTypes.INTEGER,
      field: 'cart_id',
      references: {
        model: 'carts',
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
      defaultValue: 1,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'CartItem',
    tableName: 'cart_items',
    timestamps: true,
    underscored: true,
  }
)

export default CartItem
