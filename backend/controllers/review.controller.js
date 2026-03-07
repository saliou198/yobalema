const { Review, User } = require('../models');

const refreshUserRating = async (userId) => {
  const reviews = await Review.findAll({ where: { reviewedUserId: userId } });
  const avg = reviews.length
    ? reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length
    : 0;

  await User.update({ rating: Number(avg.toFixed(2)) }, { where: { id: userId } });
};

exports.createReview = async (req, res, next) => {
  try {
    const { reviewedUserId, rideId, rating, comment } = req.body;

    const review = await Review.create({
      reviewerId: req.user.id,
      reviewedUserId,
      rideId,
      rating,
      comment,
    });

    await refreshUserRating(reviewedUserId);

    return res.status(201).json({ success: true, data: review, message: 'Review added' });
  } catch (error) {
    return next(error);
  }
};

exports.getReviewsByUser = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { reviewedUserId: req.params.id },
      include: [{ model: User, as: 'reviewer', attributes: ['id', 'firstName', 'lastName'] }],
      order: [['createdAt', 'DESC']],
    });

    return res.json({ success: true, data: reviews, message: 'User reviews' });
  } catch (error) {
    return next(error);
  }
};
