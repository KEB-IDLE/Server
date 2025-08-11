const { UserRecord } = require('../models');
const asyncWrapper = require('../middlewares/asyncWrapper');

exports.getRecord = asyncWrapper(async (req, res) => {
  const record = await UserRecord.findOne({ where: { user_id: req.user.id } });
  res.json(record);
});

exports.updateRecord = asyncWrapper(async (req, res) => {
  const { rank_match_count, rank_wins, rank_losses, rank_point } = req.body;
  const user_id = req.user.id;

  const record = await UserRecord.findOne({ where: { user_id } });
  if (!record) {
    const err = new Error('User record not found');
    err.status = 404;
    throw err;
  }

  record.rank_match_count = rank_match_count;
  record.rank_wins = rank_wins;
  record.rank_losses = rank_losses;
  record.rank_point = rank_point;
  record.tier = calculateTier(rank_point);

  await record.save();

  // 글로벌 랭킹 순위 재조정
  const allRecords = await UserRecord.findAll({ order: [['rank_point', 'DESC']] });
  for (let i = 0; i < allRecords.length; i++) {
    allRecords[i].global_rank = i + 1;
    await allRecords[i].save();
  }

  const updated = await UserRecord.findOne({ where: { user_id } });

  res.json({ success: true, message: 'User record and global rank updated', data: updated });
});

function calculateTier(rank_point) {
  if (rank_point >= 500) return 'Challenger';
  if (rank_point >= 400) return 'Master';
  if (rank_point >= 300) return 'Diamond';
  if (rank_point >= 200) return 'Gold';
  if (rank_point >= 100) return 'Silver';
  if (rank_point >= 10) return 'Bronze';
  return 'Iron';
}
