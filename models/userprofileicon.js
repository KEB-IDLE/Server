module.exports = (sequelize, DataTypes) => {
  const UserProfileIcon = sequelize.define('UserProfileIcon', {
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    icon_id: { type: DataTypes.INTEGER, primaryKey: true }
  }, {
    tableName: 'user_profile_icon',
    timestamps: false
  });

  return UserProfileIcon;
};