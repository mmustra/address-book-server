import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RolesController } from './roles.controller';
import * as schemas from './schemas';
import * as services from './services';

@Module({
  imports: [MongooseModule.forFeatureAsync(Object.values(schemas))],
  controllers: [RolesController],
  providers: Object.values(services),
  exports: [
    ...Object.values(services),
    MongooseModule.forFeatureAsync(Object.values(schemas)),
  ],
})
export class RolesModule {}
