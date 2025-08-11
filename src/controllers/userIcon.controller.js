const { UserProfile, UserProfileIcon, sequelize } = require('../models');
const asyncWrapper = require('../middlewares/asyncWrapper');

exports.getOwnedIcons = asyncWrapper(async (req, res) => {
  const icons = await UserProfileIcon.findAll({
    where: { user_id: req.user.id },
    attributes: ['icon_id']
  });
  res.json(icons.map(i => i.icon_id));
});

exports.purchaseIcon = asyncWrapper(async (req, res) => {
  const userId = req.user.id;
  const { icon_id } = req.body;
  const iconPrice = 100;

  if (typeof icon_id !== 'number') {
    return res.status(400).json({ success: false, message: 'Invalid icon_id' });
  }

  await sequelize.transaction(async (t) => {
    const user = await UserProfile.findOne({ where: { user_id: userId }, transaction: t, lock: t.LOCK.UPDATE });
    if (!user) {
      const err = new Error('User not found');
      err.status = 400;
      throw err;
    }

    const owned = await UserProfileIcon.findOne({ where: { user_id: userId, icon_id }, transaction: t });
    if (owned) {
      const err = new Error('Already owned');
      err.status = 400;
      throw err;
    }

    if (user.gold < iconPrice) {
      const err = new Error('Not enough gold');
      err.status = 400;
      throw err;
    }

    user.gold -= iconPrice;
    await user.save({ transaction: t });

    await UserProfileIcon.create({ user_id: userId, icon_id }, { transaction: t });
  });

  const updatedUser = await UserProfile.findOne({ where: { user_id: userId } });
  res.json({ success: true, message: 'Icon purchased successfully', gold: updatedUser.gold });
});
