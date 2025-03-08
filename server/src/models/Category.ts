import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/db'

class Category extends Model {
  public id!: number
  public name!: string
  public description!: string
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
