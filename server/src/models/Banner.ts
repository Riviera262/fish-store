import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/db'

class Banner extends Model {
  public id!: number
  public title!: string
  public description?: string
  public imageUrl!: string
  public link?: string
  public startDate?: Date
  public endDate?: Date
  public isActive!: boolean
}

Banner.init(
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'image_url',
    },
    link: {
      type: DataTypes.STRING(255),
    },
    startDate: {
      type: DataTypes.DATE,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATE,
      field: 'end_date',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    modelName: 'Banner',
    tableName: 'banners',
    timestamps: true,
    underscored: true,
  }
)

export default Banner
