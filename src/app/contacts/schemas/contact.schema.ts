import * as foldToAscii from 'fold-to-ascii';
import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import * as mongooseFuzzySearching from 'mongoose-fuzzy-searching';
import * as mongooseHidden from 'mongoose-hidden';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { ConfigService } from 'nestjs-config';

import { IContactDocument } from '../interfaces';

const contactSchema = {
  name: 'Contact',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): mongoose.Schema => {
    const { schema: schemaConfig } = configService.get('mongoose');
    const stringLengths = {
      firstName: 3,
      lastName: 3,
    };
    const contactMongooseSchema = new mongoose.Schema(
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
          index: true,
        },
        firstName: {
          type: String,
          default: '',
          required: true,
          trim: true,
          minlength: stringLengths.firstName,
        },
        lastName: {
          type: String,
          default: '',
          trim: true,
          validate: {
            validator(value) {
              return !value.length || value.length >= stringLengths.lastName;
            },
            message: () => `Needs to be empty or 3 charactres minimum.`,
          },
        },
        emails: [String],
        phones: [String],
        avatarUrl: { type: String, default: '', trim: true },
        notes: { type: String, default: '', trim: true },
      },
      schemaConfig.options,
    );

    contactMongooseSchema.virtual('user', {
      ref: 'User',
      localField: 'userId',
      foreignField: '_id',
      justOne: true,
    });

    contactMongooseSchema.virtual('fullName').get(function() {
      return `${this.firstName} ${this.lastName}`.trim();
    });

    contactMongooseSchema.plugin(mongooseFuzzySearching, {
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
      ],
    });
    contactMongooseSchema.plugin(schema => {
      schema.pre('save', function(next) {
        const contact = this as IContactDocument;

        contact.phones = _(contact.phones)
          .map(_.trim)
          .reject(_.isEmpty)
          .value();

        contact.emails = _(contact.emails)
          .map(_.trim)
          .reject(_.isEmpty)
          .value();

        next();
      });

      schema.pre('find', function(next) {
        const query = this as any;
        const filter = query.getFilter();

        const textSearchParse = (obj: any): boolean => {
          let result = false;

          _.forOwn(obj, (val, key) => {
            if (key === '$text') {
              const textValue = obj[key].$search;
              obj[key].$search = foldToAscii.foldReplacing(textValue);
              result = true;
            } else if (_.isArray(val)) {
              result = _.some(val, v => textSearchParse(v));
            } else if (_.isObjectLike(val)) {
              result = textSearchParse(val);
            }
          });

          return result;
        };

        if (textSearchParse(filter)) {
          const currentOptions = query.getOptions();
          currentOptions.projection = currentOptions.projection || {};
          currentOptions.projection.confidenceScore = { $meta: 'textScore' };
          currentOptions.sort = currentOptions.sort || {};
          currentOptions.sort.confidenceScore = { $meta: 'textScore' };
          query.setOptions(currentOptions);
        }

        next();
      });

      schema.pre('findOneAndUpdate', function(next) {
        const query = this as any;
        const update = query.getUpdate();

        update.phones = _(update.phones)
          .map(_.trim)
          .reject(_.isEmpty)
          .value();

        update.emails = _(update.emails)
          .map(_.trim)
          .reject(_.isEmpty)
          .value();

        query.setUpdate(update);

        next();
      });
    });
    contactMongooseSchema.plugin(mongoosePaginate);
    contactMongooseSchema.plugin(mongooseHidden());

    return contactMongooseSchema;
  },
};

export { contactSchema };
