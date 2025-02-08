import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/db'

class Product extends Model {
  public id!: number
  public name!: string
  public description!: string
  public price!: number
  public stockQuantity!: number
  public imageUrl!: string
  public productType!: 'fish' | 'accessory'
  public categoryId!: number
}

Product.init(
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'stock_quantity',
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      field: 'image_url',
    },
    productType: {
      type: DataTypes.ENUM('fish', 'accessory'),
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      field: 'category_id',
      references: {
        model: 'categories',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    underscored: true,
  }
)

export default Product
