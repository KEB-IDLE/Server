const dotenv = require('dotenv');
const fs = require('fs');

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
  console.log('Loaded env.local');
} else {
  dotenv.config();
  console.log('Loaded .env');
}

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.sync({ alter: true });
    console.log('DB connection and synchronization successful');

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    process.on('SIGINT', async () => {
      console.log('Shutting down server...');
      process.exit(0);
    });
  } catch (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
}

startServer();
