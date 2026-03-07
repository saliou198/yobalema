const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Booking = sequelize.define(
  'Booking',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    rideId: { type: DataTypes.UUID, allowNull: false },
    passengerId: { type: DataTypes.UUID, allowNull: false },
    seatsReserved: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = Booking;
