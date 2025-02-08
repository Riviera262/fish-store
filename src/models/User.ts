import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/db'
import bcrypt from 'bcrypt'

class User extends Model {
  public id!: number
  public username!: string
  public email!: string
  public passwordHash!: string
  public role!: 'customer' | 'staff' | 'admin'
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
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash',
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
        if (user.changed('passwordHash')) {
          user.passwordHash = await bcrypt.hash(user.passwordHash, 10)
        }
      },
    },
  }
)

export default User
