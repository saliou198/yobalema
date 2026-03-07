const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');
const sendEmail = require('../utils/sendEmail');

const buildToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const sanitizeUser = (user) => {
  const plain = user.get({ plain: true });
  delete plain.password;
  delete plain.passwordResetToken;
  delete plain.passwordResetExpires;
  return plain;
};

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, bio } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
      phone,
      bio,
    });

    const token = buildToken(user);

    await sendEmail({
      to: user.email,
      subject: 'Bienvenue sur Yobalema',
      text: `Bienvenue ${user.firstName}, votre compte est prêt.`,
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { token, user: sanitizeUser(user) },
    });
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = buildToken(user);
    return res.json({
      success: true,
      message: 'Login successful',
      data: { token, user: sanitizeUser(user) },
    });
  } catch (error) {
    return next(error);
  }
};

exports.logout = async (req, res) => {
  return res.json({ success: true, message: 'Logout successful', data: null });
};

exports.me = async (req, res) => {
  return res.json({ success: true, data: sanitizeUser(req.user), message: 'Current user' });
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({ success: true, message: 'If account exists, reset email was sent', data: null });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${rawToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Réinitialisation du mot de passe',
      text: `Cliquez ici pour réinitialiser votre mot de passe: ${resetUrl}`,
    });

    return res.json({ success: true, message: 'Reset instructions sent', data: null });
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.password = await bcrypt.hash(password, 12);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return res.json({ success: true, message: 'Password reset successful', data: null });
  } catch (error) {
    return next(error);
  }
};
