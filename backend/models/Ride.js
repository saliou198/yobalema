const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Ride = sequelize.define(
  'Ride',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    driverId: { type: DataTypes.UUID, allowNull: false },
    departureCity: { type: DataTypes.STRING, allowNull: false },
    departureLat: { type: DataTypes.FLOAT },
    departureLng: { type: DataTypes.FLOAT },
    arrivalCity: { type: DataTypes.STRING, allowNull: false },
    arrivalLat: { type: DataTypes.FLOAT },
    arrivalLng: { type: DataTypes.FLOAT },
    departureDate: { type: DataTypes.DATEONLY, allowNull: false },
    departureTime: { type: DataTypes.TIME, allowNull: false },
    seats: { type: DataTypes.INTEGER, allowNull: false },
    seatsAvailable: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    description: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.ENUM('active', 'cancelled', 'completed'),
      defaultValue: 'active',
    },
  },
  { timestamps: true }
);

module.exports = Ride;
