import * as foldToAscii from 'fold-to-ascii';
import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import * as aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import * as mongooseFuzzySearching from 'mongoose-fuzzy-searching';
import * as mongooseHidden from 'mongoose-hidden';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseUniqueValidator from 'mongoose-unique-validator';
import { ConfigService } from 'nestjs-config';

import { CryptoService } from '../../_common/services';
import { Role } from '../../roles/enums';
import { IUserDocument } from '../interfaces';

const userSchema = {
  name: 'User',
  inject: [ConfigService, CryptoService],
  useFactory: (
    configService: ConfigService,
    cryptoService: CryptoService,
  ): mongoose.Schema => {
    const { schema: schemaConfig } = configService.get('mongoose');
    const stringLengths = {
      firstName: 3,
      lastName: 3,
      email: 3,
    };
    const userMongooseSchema = new mongoose.Schema(
      {
        email: {
          type: String,
          required: true,
          index: true,
          unique: true,
          trim: true,
          uniqueCaseInsensitive: true,
          minlength: stringLengths.email,
        },
        password: {
          type: String,
          required: true,
          hide: true,
        },
        firstName: {
          type: String,
          required: true,
          minlength: stringLengths.firstName,
          trim: true,
        },
        lastName: {
          type: String,
          required: true,
          minlength: stringLengths.lastName,
          trim: true,
        },
        readonly: { type: Boolean, default: false },
        roles: {
          type: [String],
          enum: Object.values(Role),
          default: Role.User,
        },
        avatarUrl: { type: String, default: '', trim: true },
        contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
      },
      schemaConfig.options,
    );

    userMongooseSchema.virtual('fullName').get(function() {
      return `${this.firstName} ${this.lastName}`.trim();
    });

    userMongooseSchema.statics.filterToObject = (user: IUserDocument) => {
      const plainUser = user.toObject();

      plainUser.contactsCount = plainUser.contacts.length;
      delete plainUser.contacts;

      return plainUser;
    };

    userMongooseSchema.plugin(mongooseFuzzySearching, {
      fields: [
        {
          name: 'firstName',
          minSize: stringLengths.firstName,
          weight: 5,
        },
        {
          name: 'lastName',
          minSize: stringLengths.lastName,
          prefixOnly: true,
        },
        {
          name: 'email',
          minSize: stringLengths.email,
          escapeSpecialCharacters: false,
        },
      ],
    });
    userMongooseSchema.plugin(mongooseUniqueValidator);
    userMongooseSchema.plugin(mongoosePaginate);
    userMongooseSchema.plugin(aggregatePaginate);
    userMongooseSchema.plugin(mongooseHidden());
    userMongooseSchema.plugin(schema => {
      schema.pre('save', function(next) {
        const user = this as any;

        if (user.isModified('password')) {
          user.password = cryptoService.hash(user.password);
        }

        if (user.roles && !user.roles.length) {
          user.roles = [Role.User];
        }

        next();
      });

      schema.pre('findOne', function(next) {
        const query = this as any;
        const queryFilter = query.getFilter();

        if (queryFilter.password) {
          queryFilter.password = cryptoService.hash(queryFilter.password);
          query.setQuery(queryFilter);
        }

        next();
      });

      schema.post('findOne', function(error, doc, next) {
        const errorLogin = error && error.filter.email && error.filter.password;
        if (errorLogin) {
          error.message = 'Email or password are incorrect!';
        }
        next();
      });

      schema.pre('findOneAndUpdate', function(next) {
        const query = this as any;
        const update = query.getUpdate();

        if (update.password) {
          update.password = cryptoService.hash(update.password);
          query.setUpdate(update);
        }

        next();
      });

      schema.pre('aggregate', function() {
        const pipeline = this.pipeline();

        pipeline.unshift(
          {
            $addFields: {
              id: '$_id',
              fullName: {
                $trim: {
                  input: { $concat: ['$firstName', ' ', '$lastName'] },
                  chars: ' ',
                },
              },
              contactsCount: { $size: { $ifNull: ['$contacts', []] } },
            },
          },
          {
            $unset: [
              '_id',
              '__v',
              'password',
              'contacts',
              'firstName_fuzzy',
              'lastName_fuzzy',
              'email_fuzzy',
            ],
          },
        );

        const textSearchIndex = _.findIndex(pipeline, '$match.$text');

        if (textSearchIndex >= 0) {
          const textSearchPipe = pipeline.splice(textSearchIndex, 1)[0];
          const textValue = _.get(textSearchPipe, '$match.$text.$search');
          _.set(
            textSearchPipe,
            '$match.$text.$search',
            foldToAscii.foldReplacing(textValue),
          );
          pipeline.unshift({
            $sort: { confidenceScore: { $meta: 'textScore' } },
          });
          pipeline.unshift(textSearchPipe);
        }
      });
    });

    return userMongooseSchema;
  },
};

export { userSchema };
