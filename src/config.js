module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ORIGIN: 'https://food-share-client.wmq516.now.sh',
  DB_URL: process.env.DB_URL || 'postgresql://Mengqi89@localhost/food-share'
}