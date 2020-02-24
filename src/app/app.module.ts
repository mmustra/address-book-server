import { ConfigModule } from 'nestjs-config';
import * as path from 'path';

import { Module } from '@nestjs/common';

import { CommonModule } from './_common/common.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.load(
      path.resolve(__dirname, '../config', '**', '!(*.d).{ts,js}'),
    ),
    CommonModule,
    AuthModule,
    UsersModule,
    ContactsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
