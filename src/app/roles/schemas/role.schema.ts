import * as mongoose from 'mongoose';
import * as mongooseHidden from 'mongoose-hidden';
import * as mongooseUniqueValidator from 'mongoose-unique-validator';
import { ConfigService } from 'nestjs-config';

const roleSchema = {
  name: 'Role',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): mongoose.Schema => {
    const { schema: schemaConfig } = configService.get('mongoose');
    const roleMongooseSchema = new mongoose.Schema(
      {
        name: {
          type: String,
          required: true,
          index: true,
          unique: true,
          uniqueCaseInsensitive: true,
        },
        description: {
          type: String,
          default: '',
        },
      },
      schemaConfig.options,
    );

    roleMongooseSchema.plugin(mongooseUniqueValidator);
    roleMongooseSchema.plugin(mongooseHidden());

    return roleMongooseSchema;
  },
};

export { roleSchema };
