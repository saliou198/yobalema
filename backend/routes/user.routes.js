const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const controller = require('../controllers/user.controller');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({ storage });

router.get('/:id', controller.getProfile);
router.put('/me', auth, upload.single('profilePicture'), controller.updateMe);

module.exports = router;
