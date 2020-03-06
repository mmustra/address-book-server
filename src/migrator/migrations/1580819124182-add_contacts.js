const mongoose = require('mongoose');
const faker = require('faker');
const pLimit = require('p-limit');
const { configService, cryptoService } = require('../services');
const { userSchema } = require('../../app/users/schemas');
const { contactSchema } = require('../../app/contacts/schemas');
const limit = pLimit(1000);
const userMongooseSchema = userSchema.useFactory(configService, cryptoService);
const contactMongooseSchema = contactSchema.useFactory(configService);
mongoose.models = {};
mongoose.model('user', userMongooseSchema);
mongoose.model('contact', contactMongooseSchema);
faker.seed(configService.get('faker').seed);

async function up() {
  const users = await this('user')
    .find()
    .exec();

  const promises = users.map(async user => {
    const contactsCount = faker.random.number({ min: 3, max: 333 });
    const contactPromises = Array(contactsCount)
      .fill()
      .map(async () => {
        const emailsCount = faker.random.number({ min: 1, max: 3 });
        const emails = Array(emailsCount)
          .fill()
          .map(() => faker.internet.email());

        const phonesCount = faker.random.number({ min: 1, max: 3 });
        const phones = Array(phonesCount)
          .fill()
          .map(() => faker.phone.phoneNumberFormat());

        let firstName = '';
        let lastName = '';

        while (firstName.length < 3 || lastName.length < 3) {
          firstName = faker.name.firstName();
          lastName = faker.name.lastName();
        }

        return limit(() =>
          this('contact')
            .create({
              userId: user.id,
              firstName,
              lastName,
              emails,
              phones,
              avatarUrl: faker.image.avatar(),
              notes: faker.lorem.sentences(),
            })
            .then(contact => user.contacts.push(contact)),
        );
      });

    await Promise.all(contactPromises);

    return user.save();
  });

  await Promise.all(promises);
}

async function down() {
  await this('user')
    .updateMany({}, { $set: { contacts: [] } })
    .exec();

  await this('contact').collection.drop();
}

module.exports = { up, down };
