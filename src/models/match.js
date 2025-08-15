// models/match.js
module.exports = (sequelize, DataTypes) => {
  const Match = sequelize.define('Match', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    match_type: { type: DataTypes.STRING(20), allowNull: false },
    duration: { type: DataTypes.INTEGER, allowNull: false },  // 경기 시간(초)
    map_name: { type: DataTypes.STRING(50), allowNull: true }, // 맵 이름
    winner_id: { type: DataTypes.INTEGER, allowNull: true },  // 승자 FK
    loser_id: { type: DataTypes.INTEGER, allowNull: true },   // 패자 FK
  }, {
    tableName: 'match',
    timestamps: false
  });

  return Match;
};
