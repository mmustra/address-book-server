import * as packageJson from '../../package.json';

export default {
  uri: process.env.MONGODB_URI || `mongodb://localhost/`,
  options: {
    user: process.env.MONGODB_USER || '',
    pass: process.env.MONGODB_PASS || '',
    dbName: process.env.MONGODB_DB_NAME || packageJson.name,
    useNewUrlParser: process.env.MONGODB_USE_NEW_URL_PARSER || true,
    useUnifiedTopology: process.env.MONGODB_USE_UNIFIED_TOPOLOGY || true,
    useCreateIndex: process.env.MONGODB_USE_CREATE_INDEX || true,
    useFindAndModify: process.env.MONGODB_USE_FIND_AND_MODIFY || false,
  },
};
