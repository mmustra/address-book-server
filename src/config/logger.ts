export default {
  activateLog: process.env.LOG_ACTIVATE || false,
  folderName: process.env.LOG_FOLDER_NAME || 'logs',
  fileSize: process.env.LOG_FILE_SIZE || '10M',
  interval: process.env.LOG_INTERVAL || '1d',
  maxFiles: process.env.LOG_MAX_FILES || 30,
};
