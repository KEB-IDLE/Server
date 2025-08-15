const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User, UserProfile, UserRecord, UserProfileIcon } = require('../models');
const asyncWrapper = require('../middlewares/asyncWrapper');

exports.register = asyncWrapper(async (req, res) => {
  const { email, password, nickname } = req.body;
  const t = await sequelize.transaction();

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error('Email already exists.');
      error.status = 409;
      throw error;
    }

    const existingProfile = await UserProfile.findOne({ where: { nickname } });
    if (existingProfile) {
      const error = new Error('Nickname already exists.');
      error.status = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword }, { transaction: t });
    const userId = user.id;

    await UserProfile.create({ user_id: userId, nickname }, { transaction: t });
    await UserRecord.create({ user_id: userId, last_login_at: new Date() }, { transaction: t });

    await UserProfileIcon.bulkCreate([
      { user_id: userId, icon_id: 1 },
      { user_id: userId, icon_id: 2 },
      { user_id: userId, icon_id: 3 }
    ], { transaction: t });

    await t.commit();

    res.status(201).json({ success: true, message: 'Register Success', userId });

  } catch (err) {
    await t.rollback();
    throw err; // 에러를 미들웨어로 넘김
  }
});

exports.login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error('User not found');
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Incorrect password');
    error.status = 401;
    throw error;
  }

  const payload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.json({ token });
});
