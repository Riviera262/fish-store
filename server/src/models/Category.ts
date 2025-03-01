import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/db'

class Category extends Model {
  public id!: number
  public name!: string
  public description!: string
  public status!: 'active' | 'inactive'
  public imageUrl?: string
}

Category.init(
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      field: 'image_url',
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
    underscored: true,
  }
)

export default Category
