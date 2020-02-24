const fs = require('fs');
const path = require('path');
const configFilePath = path.resolve(__dirname, '../config');
const { CryptoService } = require(path.resolve(
  __dirname,
  '../app/_common/services',
));

const configService = {
  get: function(key) {
    return this[key];
  },
};

fs.readdirSync(configFilePath).forEach(file => {
  const configKey = file
    .split('.')
    .slice(0, -1)
    .join('.');

  const isValidFile = /^.*(?<!\.d\.ts|\.map)$/.test(file);
  if (isValidFile) {
    configService[configKey] = require(`${configFilePath}/${file}`).default;
  }
});

const cryptoService = new CryptoService(configService);

module.exports = { configService, cryptoService };
