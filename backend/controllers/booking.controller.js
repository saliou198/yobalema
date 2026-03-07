const { Op } = require('sequelize');
const { Booking, Ride, User } = require('../models');
const sendEmail = require('../utils/sendEmail');

const recalculateSeats = async (ride) => {
  const reservedSeats = await Booking.sum('seatsReserved', {
    where: {
      rideId: ride.id,
      status: { [Op.in]: ['pending', 'confirmed'] },
    },
  });

  ride.seatsAvailable = ride.seats - Number(reservedSeats || 0);
  await ride.save();
};

exports.createBooking = async (req, res, next) => {
  try {
    const { rideId, seatsReserved = 1 } = req.body;

    const ride = await Ride.findByPk(rideId, {
      include: [{ model: User, as: 'driver' }],
    });

    if (!ride || ride.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Ride unavailable' });
    }

    if (ride.driverId === req.user.id) {
      return res.status(400).json({ success: false, message: 'Driver cannot book own ride' });
    }

    if (ride.seatsAvailable < Number(seatsReserved)) {
      return res.status(400).json({ success: false, message: 'Not enough seats available' });
    }

    const booking = await Booking.create({
      rideId,
      passengerId: req.user.id,
      seatsReserved,
      status: 'pending',
    });

    await recalculateSeats(ride);

    await sendEmail({
      to: ride.driver.email,
      subject: 'Nouvelle réservation',
      text: `Vous avez une nouvelle demande de réservation pour le trajet ${ride.departureCity} -> ${ride.arrivalCity}.`,
    });

    return res.status(201).json({ success: true, data: booking, message: 'Booking created' });
  } catch (error) {
    return next(error);
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      where: { passengerId: req.user.id },
      include: [{ model: Ride, as: 'ride' }],
      order: [['createdAt', 'DESC']],
    });

    return res.json({ success: true, data: bookings, message: 'My bookings' });
  } catch (error) {
    return next(error);
  }
};

exports.confirmBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: Ride,
          as: 'ride',
          include: [{ model: User, as: 'driver' }],
        },
        { model: User, as: 'passenger' },
      ],
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.ride.driverId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    booking.status = 'confirmed';
    await booking.save();
    await recalculateSeats(booking.ride);

    await sendEmail({
      to: booking.passenger.email,
      subject: 'Réservation confirmée',
      text: 'Votre réservation a été confirmée.',
    });

    return res.json({ success: true, data: booking, message: 'Booking confirmed' });
  } catch (error) {
    return next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Ride, as: 'ride' }],
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.passengerId !== req.user.id && booking.ride.driverId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    booking.status = 'cancelled';
    await booking.save();
    await recalculateSeats(booking.ride);

    return res.json({ success: true, data: booking, message: 'Booking cancelled' });
  } catch (error) {
    return next(error);
  }
};
