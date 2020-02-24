export default {
  cryptoSecret: process.env.AUTH_CRYPTO_SECRET || 'crypto-secret',
  jwtSecret: process.env.AUTH_JWT_SECRET || 'jwt-secret',
  tokenExpiresIn: process.env.AUTH_TOKEN_EXPIRES_IN || 8 * 3600,
};
