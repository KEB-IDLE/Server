module.exports = (sequelize, DataTypes) => {
  const UserDeck = sequelize.define('UserDeck', {
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    slot_number: { type: DataTypes.TINYINT, primaryKey: true },
    champion_ids: { type: DataTypes.JSON }
  }, {
    tableName: 'user_deck',
    timestamps: false
  });

  return UserDeck;
};
