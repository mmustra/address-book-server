const mongoose = require('mongoose');
const faker = require('faker');
const { configService, cryptoService } = require('../services');
const { userSchema } = require('../../app/users/schemas');
const { Role } = require('../../app/roles/enums');
const userMongooseSchema = userSchema.useFactory(configService, cryptoService);
mongoose.models = {};
mongoose.model('user', userMongooseSchema);
faker.seed(configService.get('faker').seed);

async function up() {
  const coreUsers = [
    {
      email: 'admin@admin.com',
      password: 'admin',
      firstName: 'Admin',
      lastName: '___',
      readonly: true,
      roles: [Role.Admin],
      avatarUrl:
        'https://s.gravatar.com/avatar/47cf75e67b7c68d437ec0dc9067a81f7?s=128',
    },
    {
      email: 'moderator@moderator.com',
      password: 'moderator',
      firstName: 'Moderator',
      lastName: '___',
      readonly: true,
      roles: [Role.Moderator],
      avatarUrl: faker.image.avatar(),
    },
    {
      email: 'user@user.com',
      password: 'user',
      firstName: 'User',
      lastName: '___',
      readonly: true,
      roles: [Role.User],
      avatarUrl: faker.image.avatar(),
    },
  ];

  const coreUsersPromises = coreUsers.map(async user =>
    this('user').create(user),
  );

  await Promise.all(coreUsersPromises).then(() => {
    const otherUsersCount = 96;
    const otherUsersPromises = Array(otherUsersCount)
      .fill()
      .map(async () => {
        let firstName = '';
        let lastName = '';

        while (firstName.length < 3 || lastName.length < 3) {
          firstName = faker.name.firstName();
          lastName = faker.name.lastName();
        }

        return this('user').create({
          firstName,
          lastName,
          email: faker.internet.email(),
          password: faker.lorem.words(),
          avatarUrl: faker.image.avatar(),
        });
      });

    return Promise.all(otherUsersPromises);
  });
}

async function down() {
  this('user').collection.drop();
}

module.exports = { up, down };
