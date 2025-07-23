const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User, UserProfile, UserRecord, UserProfileIcon } = require('../models');

exports.register = async (req, res) => {
  const { email, password, nickname } = req.body;
  const t = await sequelize.transaction();

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists.' });
    }

    const existingProfile = await UserProfile.findOne({ where: { nickname } });
    if (existingProfile) {
      return res.status(409).json({ success: false, message: 'Nickname already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword }, { transaction: t });
    const userId = user.id;

    await UserProfile.create({ user_id: userId, nickname }, { transaction: t });

    await UserRecord.create({
      user_id: userId,
      last_login_at: new Date()
    }, { transaction: t });

    await UserProfileIcon.bulkCreate([
      { user_id: userId, icon_id: 1 },
      { user_id: userId, icon_id: 2 },
      { user_id: userId, icon_id: 3 }
    ], { transaction: t });

    await t.commit();
    res.status(201).json({ success: true, message: 'Register Success', userId });

  } catch (err) {
    await t.rollback();
    console.error('Registration failed:', err);
    res.status(500).json({ success: false, message: 'Register Failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.json({ token });

  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
