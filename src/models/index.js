const sequelize = require('../config/database');
const Sequelize = require('sequelize');

const db = {};

// 모델 정의: 각 테이블을 Sequelize 모델로 불러와서 초기화
db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.UserProfile = require('./userprofile')(sequelize, Sequelize.DataTypes);
db.UserRecord = require('./userrecord')(sequelize, Sequelize.DataTypes);
db.Match = require('./match')(sequelize, Sequelize.DataTypes);
db.MatchParticipant = require('./matchparticipant')(sequelize, Sequelize.DataTypes);
db.UserProfileIcon = require('./userprofileicon')(sequelize, Sequelize.DataTypes);  

// 모델 관계 설정 (Association)

// User 1:1 UserProfile (사용자 프로필 정보)
db.User.hasOne(db.UserProfile, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.UserProfile.belongsTo(db.User, { foreignKey: 'user_id' });

// User 1:1 UserRecord (사용자 기록 정보)
db.User.hasOne(db.UserRecord, { foreignKey: 'user_id' });
db.UserRecord.belongsTo(db.User, { foreignKey: 'user_id' });

// User 1:N UserProfileIcon (사용자가 보유한 프로필 아이콘 여러 개)
db.User.hasMany(db.UserProfileIcon, { foreignKey: 'user_id', onDelete: 'CASCADE' }); 
db.UserProfileIcon.belongsTo(db.User, { foreignKey: 'user_id' });                     

// UserRecord N:1 UserProfile (UserRecord는 UserProfile의 외래키 user_id를 참조, user_id를 기준으로 연결)
db.UserRecord.belongsTo(db.UserProfile, { foreignKey: 'user_id', targetKey: 'user_id' });

// Match 1:N MatchParticipant (하나의 매치에 여러 참가자)
db.Match.hasMany(db.MatchParticipant, { foreignKey: 'match_id' });
db.MatchParticipant.belongsTo(db.Match, { foreignKey: 'match_id' });

// User 1:N MatchParticipant (사용자는 여러 매치 참가자 기록을 가질 수 있음)
db.User.hasMany(db.MatchParticipant, { foreignKey: 'user_id' });
db.MatchParticipant.belongsTo(db.User, { foreignKey: 'user_id' });

// Sequelize 인스턴스 및 라이브러리 export
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
