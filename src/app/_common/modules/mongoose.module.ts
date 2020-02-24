import { ConfigService } from 'nestjs-config';

import { MongooseModule as MongooseModuleConfig } from '@nestjs/mongoose';

const MongooseModule = MongooseModuleConfig.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const mongodbConfig = configService.get('mongodb');

    return {
      uri: mongodbConfig.uri,
      ...mongodbConfig.options,
    };
  },
});

export { MongooseModule };
