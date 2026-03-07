const { Op } = require('sequelize');
const { Ride, User, Booking } = require('../models');
const { geocodePlace } = require('../utils/geoapify');

exports.listRides = async (req, res, next) => {
  try {
    const {
      from,
      to,
      date,
      seats,
      maxPrice,
      page = 1,
      limit = 10,
      minDriverRating,
    } = req.query;

    const where = { status: 'active' };

    if (from) where.departureCity = { [Op.iLike]: `%${from}%` };
    if (to) where.arrivalCity = { [Op.iLike]: `%${to}%` };
    if (date) where.departureDate = date;
    if (seats) where.seatsAvailable = { [Op.gte]: Number(seats) };
    if (maxPrice) where.price = { [Op.lte]: Number(maxPrice) };

    const offset = (Number(page) - 1) * Number(limit);

    const { rows, count } = await Ride.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'driver',
        attributes: ['id', 'firstName', 'lastName', 'rating', 'profilePicture'],
        ...(minDriverRating ? { where: { rating: { [Op.gte]: Number(minDriverRating) } } } : {}),
      }],
      order: [['departureDate', 'ASC'], ['departureTime', 'ASC']],
      limit: Number(limit),
      offset,
    });

    return res.json({
      success: true,
      message: 'Rides list',
      data: {
        items: rows,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.getRideById = async (req, res, next) => {
  try {
    const ride = await Ride.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'firstName', 'lastName', 'rating', 'profilePicture', 'bio'],
        },
        {
          model: Booking,
          as: 'bookings',
        },
      ],
    });

    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    return res.json({ success: true, data: ride, message: 'Ride details' });
  } catch (error) {
    return next(error);
  }
};

exports.createRide = async (req, res, next) => {
  try {
    const {
      departureCity,
      arrivalCity,
      departureDate,
      departureTime,
      seats,
      price,
      description,
    } = req.body;

    const [depGeo, arrGeo] = await Promise.all([
      geocodePlace(departureCity),
      geocodePlace(arrivalCity),
    ]);

    const ride = await Ride.create({
      driverId: req.user.id,
      departureCity: depGeo?.formatted || departureCity,
      departureLat: depGeo?.lat || null,
      departureLng: depGeo?.lng || null,
      arrivalCity: arrGeo?.formatted || arrivalCity,
      arrivalLat: arrGeo?.lat || null,
      arrivalLng: arrGeo?.lng || null,
      departureDate,
      departureTime,
      seats,
      seatsAvailable: seats,
      price,
      description,
    });

    return res.status(201).json({ success: true, data: ride, message: 'Ride created' });
  } catch (error) {
    return next(error);
  }
};

exports.updateRide = async (req, res, next) => {
  try {
    const ride = await Ride.findByPk(req.params.id);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    if (ride.driverId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const updatableFields = [
      'departureCity',
      'arrivalCity',
      'departureDate',
      'departureTime',
      'seats',
      'price',
      'description',
      'status',
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        ride[field] = req.body[field];
      }
    });

    if (req.body.seats !== undefined) {
      const reservedSeats = await Booking.sum('seatsReserved', {
        where: { rideId: ride.id, status: { [Op.in]: ['pending', 'confirmed'] } },
      });
      ride.seatsAvailable = Number(req.body.seats) - Number(reservedSeats || 0);
      if (ride.seatsAvailable < 0) {
        return res.status(400).json({ success: false, message: 'Seats less than reserved seats' });
      }
    }

    await ride.save();
    return res.json({ success: true, data: ride, message: 'Ride updated' });
  } catch (error) {
    return next(error);
  }
};

exports.deleteRide = async (req, res, next) => {
  try {
    const ride = await Ride.findByPk(req.params.id);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    if (ride.driverId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    ride.status = 'cancelled';
    await ride.save();

    return res.json({ success: true, message: 'Ride cancelled', data: ride });
  } catch (error) {
    return next(error);
  }
};

exports.getMyRides = async (req, res, next) => {
  try {
    const rides = await Ride.findAll({
      where: { driverId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    return res.json({ success: true, data: rides, message: 'My rides' });
  } catch (error) {
    return next(error);
  }
};
