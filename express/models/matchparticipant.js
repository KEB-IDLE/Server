module.exports = (sequelize, DataTypes) => {
  const MatchParticipant = sequelize.define('MatchParticipant', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    match_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    is_winner: { type: DataTypes.BOOLEAN },
    rank_point_change: { type: DataTypes.INTEGER },
    deck_slot_used: { type: DataTypes.TINYINT }
  }, {
    tableName: 'match_participant',
    timestamps: false,
    indexes: [{ unique: true, fields: ['match_id', 'user_id'] }]
  });

  return MatchParticipant;
};
