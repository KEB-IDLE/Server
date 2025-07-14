module.exports = (sequelize, DataTypes) => {
  const UserChampion = sequelize.define('UserChampion', {
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    champion_id: { type: DataTypes.INTEGER, primaryKey: true }
  }, {
    tableName: 'user_champion',
    timestamps: false
  });

  return UserChampion;
};
