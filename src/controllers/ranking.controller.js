const { UserProfile, UserRecord } = require('../models');

exports.getGlobalRanking = async (req, res) => {
  try {
    const records = await UserRecord.findAll({
      order: [['rank_point', 'DESC']],
      limit: 5,
      include: [{
        model: UserProfile,
        attributes: ['nickname', 'profile_icon_id']
      }]
    });

    const result = records.map((r) => ({
      rank: r.global_rank,
      nickname: r.UserProfile.nickname,
      profile_icon_id: r.UserProfile.profile_icon_id,
      rank_point: r.rank_point
    }));

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch global ranking',
      error: err.message
    });
  }
};
