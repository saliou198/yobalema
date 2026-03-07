const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const controller = require('../controllers/review.controller');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation error', data: errors.array() });
  }
  return next();
};

router.post(
  '/',
  auth,
  [
    body('reviewedUserId').notEmpty(),
    body('rideId').notEmpty(),
    body('rating').isInt({ min: 1, max: 5 }),
  ],
  validate,
  controller.createReview
);
router.get('/user/:id', controller.getReviewsByUser);

module.exports = router;
