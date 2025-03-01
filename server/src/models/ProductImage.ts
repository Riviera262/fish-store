// src/models/ProductImage.ts
import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/db'

class ProductImage extends Model {
  public id!: number
  public productId!: number
  public imageUrl!: string
}

ProductImage.init(
  {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id',
      references: {
        model: 'products',
        key: 'id',
      },
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'image_url',
    },
  },
  {
    sequelize,
    modelName: 'ProductImage',
    tableName: 'product_images',
    timestamps: true,
    underscored: true,
  }
)

export default ProductImage
