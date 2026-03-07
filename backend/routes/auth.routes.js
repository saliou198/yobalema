const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const controller = require('../controllers/auth.controller');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation error', data: errors.array() });
  }
  return next();
};

router.post(
  '/register',
  [
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
  ],
  validate,
  controller.register
);
router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validate, controller.login);
router.post('/logout', controller.logout);
router.get('/me', auth, controller.me);
router.post('/forgot-password', [body('email').isEmail()], validate, controller.forgotPassword);
router.post('/reset-password', [body('token').notEmpty(), body('password').isLength({ min: 8 })], validate, controller.resetPassword);

module.exports = router;
