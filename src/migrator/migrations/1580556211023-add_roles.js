const mongoose = require('mongoose');
const { configService } = require('../services');
const { roleSchema } = require('../../app/roles/schemas');
const { Role } = require('../../app/roles/enums');
const roleMongooseSchema = roleSchema.useFactory(configService);
mongoose.models = {};
mongoose.model('role', roleMongooseSchema);

async function up() {
  userRights = 'Can manage resources in own possesion.';
  moderatorRights = 'Can read and update resources from role:user possesion.';
  adminRights = 'Can manage resources from role:all possesion.';

  const roles = [
    {
      name: Role.User,
      description: userRights,
    },
    {
      name: Role.Moderator,
      description: `${userRights} ${moderatorRights}`,
    },
    {
      name: Role.Admin,
      description: `${userRights} ${adminRights}`,
    },
  ];

  const promises = roles.map(async role => this('role').create(role));
  await Promise.all(promises);
}

async function down() {
  this('roles').collection.drop();
}

module.exports = { up, down };
