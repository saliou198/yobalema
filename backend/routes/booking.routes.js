const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const controller = require('../controllers/booking.controller');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation error', data: errors.array() });
  }
  return next();
};

router.post('/', auth, [body('rideId').notEmpty(), body('seatsReserved').optional().isInt({ min: 1 })], validate, controller.createBooking);
router.get('/my', auth, controller.getMyBookings);
router.put('/:id/confirm', auth, controller.confirmBooking);
router.put('/:id/cancel', auth, controller.cancelBooking);

module.exports = router;
