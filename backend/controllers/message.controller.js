const { Op, fn, col, literal } = require('sequelize');
const { Message, User } = require('../models');

exports.listConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const rows = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      attributes: [
        [literal(`CASE WHEN "senderId" = '${userId}' THEN "receiverId" ELSE "senderId" END`), 'otherUserId'],
        [fn('MAX', col('createdAt')), 'lastMessageAt'],
      ],
      group: [literal('"otherUserId"')],
      order: [[literal('"lastMessageAt"'), 'DESC']],
      raw: true,
    });

    const users = await User.findAll({
      where: { id: rows.map((row) => row.otherUserId) },
      attributes: ['id', 'firstName', 'lastName', 'profilePicture'],
    });

    const byId = Object.fromEntries(users.map((u) => [u.id, u]));
    const data = rows.map((row) => ({
      user: byId[row.otherUserId] || null,
      lastMessageAt: row.lastMessageAt,
    }));

    return res.json({ success: true, data, message: 'Conversations' });
  } catch (error) {
    return next(error);
  }
};

exports.getMessagesWithUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.userId;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      order: [['createdAt', 'ASC']],
    });

    await Message.update(
      { isRead: true },
      {
        where: {
          senderId: otherUserId,
          receiverId: userId,
          isRead: false,
        },
      }
    );

    return res.json({ success: true, data: messages, message: 'Messages list' });
  } catch (error) {
    return next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, rideId, content } = req.body;

    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      rideId,
      content,
    });

    const io = req.app.get('io');
    io.to(receiverId).emit('message:new', message);

    return res.status(201).json({ success: true, data: message, message: 'Message sent' });
  } catch (error) {
    return next(error);
  }
};
