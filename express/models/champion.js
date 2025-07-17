module.exports = (sequelize, DataTypes) => {
  const Champion = sequelize.define('Champion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    type: { type: DataTypes.STRING(30) },
    cost: { type: DataTypes.TINYINT },
    base_hp: { type: DataTypes.INTEGER },
    base_attack: { type: DataTypes.INTEGER }
  }, {
    tableName: 'champion',
    timestamps: false
  });

  return Champion;
};
