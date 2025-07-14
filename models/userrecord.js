module.exports = (sequelize, DataTypes) => {
  const UserRecord = sequelize.define('UserRecord', {
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    last_login_at: { type: DataTypes.DATE },
    rank_match_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    rank_wins: { type: DataTypes.INTEGER, defaultValue: 0 },
    rank_losses: { type: DataTypes.INTEGER, defaultValue: 0 },
    rank_point: { type: DataTypes.INTEGER, defaultValue: 0 },
    tier: { type: DataTypes.STRING(30) },
    global_rank: { type: DataTypes.INTEGER }
  }, {
    tableName: 'user_record',
    timestamps: false
  });

  return UserRecord;
};
