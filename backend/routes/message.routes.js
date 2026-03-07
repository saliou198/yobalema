const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const controller = require('../controllers/message.controller');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation error', data: errors.array() });
  }
  return next();
};

router.get('/conversations', auth, controller.listConversations);
router.get('/:userId', auth, controller.getMessagesWithUser);
router.post('/', auth, [body('receiverId').notEmpty(), body('content').notEmpty()], validate, controller.sendMessage);

module.exports = router;
