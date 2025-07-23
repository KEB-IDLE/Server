const { UserProfile } = require('../models');

exports.getProfile = async (req, res) => {
  const profile = await UserProfile.findOne({ where: { user_id: req.user.id } });
  res.json(profile);
};

exports.updateProfileIcon = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profile_icon_id } = req.body;
    await UserProfile.update({ profile_icon_id }, { where: { user_id: userId } });
    const updated = await UserProfile.findOne({ where: { user_id: userId } });
    res.json({ success: true, message: 'Profile icon updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update icon', error: err.message });
  }
};

exports.updateProfileCharacter = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profile_char_id } = req.body;
    await UserProfile.update({ profile_char_id }, { where: { user_id: userId } });
    const updated = await UserProfile.findOne({ where: { user_id: userId } });
    res.json({ success: true, message: 'Profile character updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update character', error: err.message });
  }
};

exports.updateProfileLevel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { level } = req.body;
    await UserProfile.update({ level }, { where: { user_id: userId } });
    const updated = await UserProfile.findOne({ where: { user_id: userId } });
    res.json({ success: true, message: 'Profile level updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update level', error: err.message });
  }
};

exports.updateProfileExp = async (req, res) => {
  try {
    const userId = req.user.id;
    const { exp } = req.body;
    await UserProfile.update({ exp }, { where: { user_id: userId } });
    const updated = await UserProfile.findOne({ where: { user_id: userId } });
    res.json({ success: true, message: 'Profile exp updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update exp', error: err.message });
  }
};

exports.updateProfileGold = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gold } = req.body;
    await UserProfile.update({ gold }, { where: { user_id: userId } });
    const updated = await UserProfile.findOne({ where: { user_id: userId } });
    res.json({ success: true, message: 'Profile gold updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update gold', error: err.message });
  }
};
