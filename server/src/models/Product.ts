import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/db'

class Product extends Model {
  public id!: number
  public name!: string
  public description!: string
  public price!: number
  public status!: string
  public imageUrl?: string
  public productType!: string
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
    imageUrl: {
      type: DataTypes.STRING(255),
      field: 'image_url',
    },
    productType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'active',
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
