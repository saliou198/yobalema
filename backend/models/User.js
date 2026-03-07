const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    profilePicture: { type: DataTypes.STRING },
    bio: { type: DataTypes.TEXT },
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    passwordResetToken: { type: DataTypes.STRING },
    passwordResetExpires: { type: DataTypes.DATE },
  },
  { timestamps: true }
);

module.exports = User;
