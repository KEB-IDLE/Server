module.exports = (sequelize, DataTypes) => {
  const MatchParticipant = sequelize.define('MatchParticipant', {
    match_id: { type: DataTypes.INTEGER, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    is_winner: { type: DataTypes.BOOLEAN },
    rank_point_change: { type: DataTypes.INTEGER },
    deck_slot_used: { type: DataTypes.TINYINT }
  }, {
    tableName: 'match_participant',
    timestamps: false
  });

  return MatchParticipant;
};
