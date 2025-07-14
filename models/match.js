module.exports = (sequelize, DataTypes) => {
  const Match = sequelize.define('Match', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    match_type: { type: DataTypes.STRING(20) },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    duration: { type: DataTypes.INTEGER }
  }, {
    tableName: 'match',
    timestamps: false
  });

  return Match;
};
