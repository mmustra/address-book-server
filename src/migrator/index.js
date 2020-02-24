const argv = require('minimist')(process.argv.slice(2), {
  alias: { up: 'UP', down: 'DOWN' },
});
const path = require('path');
const _ = require('lodash');
const mongoose = require('mongoose');
const migrateMongoose = require('migrate-mongoose');
const { configService } = require(path.resolve(__dirname, './services'));
const databaseConfgig = configService.get('mongodb');
const migrationsPath = path.resolve(__dirname, './migrations');
const { up: upMigrationName, down: downMigrationName } = argv;

if (_.isString(upMigrationName) && _.isString(downMigrationName)) {
  throw new Error("Can't use UP and DOWN at the same time!");
} else if (_.isBoolean(upMigrationName) || _.isBoolean(downMigrationName)) {
  throw new Error(
    `Missing migration fileName! (ex. --${
      upMigrationName ? 'up' : 'down'
    } add_users)`,
  );
}

const connection = mongoose.createConnection(databaseConfgig.uri, {
  ...databaseConfgig.options,
});

const migrator = new migrateMongoose({
  migrationsPath,
  connection,
  collectionName: '_migrations',
  cli: true,
  autosync: true,
});

process.on('SIGINT', () => {
  migrator.close().then(() => {
    process.exit(0);
  });
});

process.on('exit', () => {
  migrator.close();
});

let promise;
if (_.isString(upMigrationName)) {
  promise = migrator.run('up', upMigrationName);
} else if (_.isString(downMigrationName)) {
  promise = migrator.run('down', downMigrationName);
} else {
  promise = migrator.run('up');
}

promise
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.warn(err.message.yellow);
    process.exit(1);
  });
