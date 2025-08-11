const { UserProfile } = require('../models');
const asyncWrapper = require('../middlewares/asyncWrapper');

exports.getProfile = asyncWrapper(async (req, res) => {
  const profile = await UserProfile.findOne({ where: { user_id: req.user.id } });
  res.json(profile);
});

exports.updateProfileIcon = asyncWrapper(async (req, res) => {
  const userId = req.user.id;
  const { profile_icon_id } = req.body;

  await UserProfile.update({ profile_icon_id }, { where: { user_id: userId } });
  const updated = await UserProfile.findOne({ where: { user_id: userId } });

  res.json({ success: true, message: 'Profile icon updated', data: updated });
});

exports.updateProfileCharacter = asyncWrapper(async (req, res) => {
  const userId = req.user.id;
  const { profile_char_id } = req.body;

  await UserProfile.update({ profile_char_id }, { where: { user_id: userId } });
  const updated = await UserProfile.findOne({ where: { user_id: userId } });

  res.json({ success: true, message: 'Profile character updated', data: updated });
});

exports.updateProfileLevel = asyncWrapper(async (req, res) => {
  const userId = req.user.id;
  const { level } = req.body;

  await UserProfile.update({ level }, { where: { user_id: userId } });
  const updated = await UserProfile.findOne({ where: { user_id: userId } });

  res.json({ success: true, message: 'Profile level updated', data: updated });
});

exports.updateProfileExp = asyncWrapper(async (req, res) => {
  const userId = req.user.id;
  const { exp } = req.body;

  await UserProfile.update({ exp }, { where: { user_id: userId } });
  const updated = await UserProfile.findOne({ where: { user_id: userId } });

  res.json({ success: true, message: 'Profile exp updated', data: updated });
});

exports.updateProfileGold = asyncWrapper(async (req, res) => {
  const userId = req.user.id;
  const { gold } = req.body;

  await UserProfile.update({ gold }, { where: { user_id: userId } });
  const updated = await UserProfile.findOne({ where: { user_id: userId } });

  res.json({ success: true, message: 'Profile gold updated', data: updated });
});
