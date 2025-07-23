const { UserProfile, UserProfileIcon, sequelize } = require('../models');

exports.getOwnedIcons = async (req, res) => {
  try {
    const icons = await UserProfileIcon.findAll({
      where: { user_id: req.user.id },
      attributes: ['icon_id']
    });
    res.json(icons.map(i => i.icon_id));
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch icons' });
  }
};

exports.purchaseIcon = async (req, res) => {
  const userId = req.user.id;
  const { icon_id } = req.body;
  const iconPrice = 100;

  if (typeof icon_id !== 'number') {
    return res.status(400).json({ success: false, message: 'Invalid icon_id' });
  }

  try {
    await sequelize.transaction(async (t) => {
      const user = await UserProfile.findOne({ where: { user_id: userId }, transaction: t, lock: t.LOCK.UPDATE });
      if (!user) throw new Error('User not found');

      const owned = await UserProfileIcon.findOne({ where: { user_id: userId, icon_id }, transaction: t });
      if (owned) throw new Error('Already owned');

      if (user.gold < iconPrice) throw new Error('Not enough gold');

      user.gold -= iconPrice;
      await user.save({ transaction: t });

      await UserProfileIcon.create({ user_id: userId, icon_id }, { transaction: t });
    });

    const updatedUser = await UserProfile.findOne({ where: { user_id: userId } });
    res.json({ success: true, message: 'Icon purchased successfully', gold: updatedUser.gold });

  } catch (err) {
    const messageMap = {
      'Already owned': 400,
      'Not enough gold': 400,
      'User not found': 400
    };
    const status = messageMap[err.message] || 500;
    res.status(status).json({ success: false, message: err.message || 'Server error' });
  }
};
