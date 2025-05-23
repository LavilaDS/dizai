require('dotenv').config();

const env = {
  port: process.env.PORT || 3000,
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRATION,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION,
};

module.exports = env;
