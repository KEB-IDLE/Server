module.exports = (sequelize, DataTypes) => {
  const UserProfileIcon = sequelize.define('UserProfileIcon', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    icon_id: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'user_profile_icon',
    timestamps: false
  });

  return UserProfileIcon;
};
