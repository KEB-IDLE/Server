const { UserProfile, UserRecord } = require('../models');
const asyncWrapper = require('../middlewares/asyncWrapper');

exports.getGlobalRanking = asyncWrapper(async (req, res) => {
  const records = await UserRecord.findAll({
    order: [['rank_point', 'DESC']],
    limit: 10,
    include: [{
      model: UserProfile,
      attributes: ['nickname', 'profile_icon_id']
    }]
  });

  const result = records.map(r => ({
    rank: r.global_rank,
    nickname: r.UserProfile.nickname,
    profile_icon_id: r.UserProfile.profile_icon_id,
    rank_point: r.rank_point
  }));

  res.json({
    success: true,
    data: result
  });
});
