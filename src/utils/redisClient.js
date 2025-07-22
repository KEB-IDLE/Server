const redis = require('redis');

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  }
});

client.on('error', (err) => console.error('Redis Client Error', err));

client.connect();

module.exports = client;
