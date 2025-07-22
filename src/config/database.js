const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const fs = require('fs');

// .env 또는 .env.local 로드
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
  console.log('env.local 로딩됨 (from config/database.js)');
} else {
  dotenv.config();
  console.log('.env 로딩됨 (from config/database.js)');
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;
