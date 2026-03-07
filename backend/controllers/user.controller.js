const { User, Review, Ride } = require('../models');

const sanitizeUser = (user) => {
  const plain = user.get({ plain: true });
  delete plain.password;
  delete plain.passwordResetToken;
  delete plain.passwordResetExpires;
  return plain;
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] },
      include: [
        { model: Review, as: 'receivedReviews' },
        { model: Ride, as: 'driverRides' },
      ],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, data: user, message: 'User profile' });
  } catch (error) {
    return next(error);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const allowed = ['firstName', 'lastName', 'phone', 'bio'];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    if (req.file?.path) {
      req.user.profilePicture = req.file.path;
    }

    await req.user.save();

    return res.json({
      success: true,
      message: 'Profile updated',
      data: sanitizeUser(req.user),
    });
  } catch (error) {
    return next(error);
  }
};
