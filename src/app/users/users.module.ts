import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ContactsModule } from '../contacts/contacts.module';
import * as schemas from './schemas';
import * as services from './services';
import { UsersController } from './users.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync(Object.values(schemas)),
    forwardRef(() => ContactsModule),
  ],
  providers: Object.values(services),
  controllers: [UsersController],
  exports: [
    services.UserService,
    MongooseModule.forFeatureAsync(Object.values(schemas)),
  ],
})
export class UsersModule {}
