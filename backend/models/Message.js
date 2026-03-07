const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Message = sequelize.define(
  'Message',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    senderId: { type: DataTypes.UUID, allowNull: false },
    receiverId: { type: DataTypes.UUID, allowNull: false },
    rideId: { type: DataTypes.UUID },
    content: { type: DataTypes.TEXT, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { timestamps: true }
);

module.exports = Message;
