import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/db'
import bcrypt from 'bcrypt'

class User extends Model {
  public id!: number
  public username!: string
  public email!: string
  public password!: string // Lưu mật khẩu đã băm
  public avatar?: string
  public role!: 'customer' | 'staff' | 'admin'
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

User.init(
  {
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('customer', 'staff', 'admin'),
      allowNull: false,
      defaultValue: 'customer',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeSave: async (user: User) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10)
        }
      },
    },
  }
)

export default User
