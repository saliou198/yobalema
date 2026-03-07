const User = require('./User');
const Ride = require('./Ride');
const Booking = require('./Booking');
const Review = require('./Review');
const Message = require('./Message');

User.hasMany(Ride, { foreignKey: 'driverId', as: 'driverRides' });
Ride.belongsTo(User, { foreignKey: 'driverId', as: 'driver' });

Ride.hasMany(Booking, { foreignKey: 'rideId', as: 'bookings' });
Booking.belongsTo(Ride, { foreignKey: 'rideId', as: 'ride' });

User.hasMany(Booking, { foreignKey: 'passengerId', as: 'passengerBookings' });
Booking.belongsTo(User, { foreignKey: 'passengerId', as: 'passenger' });

User.hasMany(Review, { foreignKey: 'reviewerId', as: 'writtenReviews' });
User.hasMany(Review, { foreignKey: 'reviewedUserId', as: 'receivedReviews' });
Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });
Review.belongsTo(User, { foreignKey: 'reviewedUserId', as: 'reviewedUser' });
Review.belongsTo(Ride, { foreignKey: 'rideId', as: 'ride' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
Message.belongsTo(Ride, { foreignKey: 'rideId', as: 'ride' });

module.exports = {
  User,
  Ride,
  Booking,
  Review,
  Message,
};
