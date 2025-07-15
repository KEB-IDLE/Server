module.exports = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define('UserProfile', {
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    nickname: { type: DataTypes.STRING(50), unique: true, allowNull: true },
    profile_icon_id: { type: DataTypes.INTEGER, defaultValue: 0 },
    profile_char_id: { type: DataTypes.INTEGER, defaultValue: 0 },
    level: { type: DataTypes.INTEGER, defaultValue: 1 },
    exp: { type: DataTypes.INTEGER, defaultValue: 0 },
    gold: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    tableName: 'user_profile',
    timestamps: false
  });

  return UserProfile;
};
