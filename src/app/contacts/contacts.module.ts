import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { ContactsController } from './contacts.controller';
import * as schemas from './schemas';
import * as services from './services';

@Module({
  imports: [
    MongooseModule.forFeatureAsync(Object.values(schemas)),
    forwardRef(() => UsersModule),
  ],
  providers: Object.values(services),
  exports: [MongooseModule.forFeatureAsync(Object.values(schemas))],
  controllers: [ContactsController],
})
export class ContactsModule {}
