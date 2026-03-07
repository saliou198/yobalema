const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const controller = require('../controllers/ride.controller');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation error', data: errors.array() });
  }
  return next();
};

router.get('/', controller.listRides);
router.get('/my/rides', auth, controller.getMyRides);
router.get('/:id', controller.getRideById);
router.post(
  '/',
  auth,
  [
    body('departureCity').notEmpty(),
    body('arrivalCity').notEmpty(),
    body('departureDate').isDate(),
    body('departureTime').notEmpty(),
    body('seats').isInt({ min: 1 }),
    body('price').isFloat({ min: 0 }),
  ],
  validate,
  controller.createRide
);
router.put('/:id', auth, controller.updateRide);
router.delete('/:id', auth, controller.deleteRide);

module.exports = router;
