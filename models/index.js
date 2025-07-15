const sequelize = require('../config/database');
const Sequelize = require('sequelize');

const db = {};

db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.UserProfile = require('./userprofile')(sequelize, Sequelize.DataTypes);
db.UserRecord = require('./userrecord')(sequelize, Sequelize.DataTypes);
db.Match = require('./match')(sequelize, Sequelize.DataTypes);
db.MatchParticipant = require('./matchparticipant')(sequelize, Sequelize.DataTypes);


db.User.hasOne(db.UserProfile, { foreignKey: 'user_id' ,onDelete: 'CASCADE'});
db.UserProfile.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasOne(db.UserRecord, { foreignKey: 'user_id' });
db.UserRecord.belongsTo(db.User, { foreignKey: 'user_id' });

db.Match.hasMany(db.MatchParticipant, { foreignKey: 'match_id' });
db.MatchParticipant.belongsTo(db.Match, { foreignKey: 'match_id' });

db.User.hasMany(db.MatchParticipant, { foreignKey: 'user_id' });
db.MatchParticipant.belongsTo(db.User, { foreignKey: 'user_id' });


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
