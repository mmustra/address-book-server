export default {
  environment: process.env.EXPRESS_ENVIRONMENT || 'development',
  port: process.env.PORT || process.env.EXPRESS_PORT || 3000,
  apiPrefix: process.env.EXPRESS_API_PREFIX || 'api',
  servePublic: process.env.EXPRESS_SERVE_PUBLIC || false,
  publicFolderPath:
    process.env.EXPRESS_PUBLIC_FOLDER_PATH ||
    (process.env.EXPRESS_ENVIRONMENT === 'production'
      ? '../client/dist/client'
      : './dist'),
  isProduction() {
    return this.get('express.environment') === 'production';
  },
};
