import { Module } from '@nestjs/common';

import { RolesModule } from '../../../roles/roles.module';
import * as providers from './providers';
import * as services from './services';

@Module({
  imports: [RolesModule],
  providers: [...Object.values(providers), ...Object.values(services)],
  exports: [...Object.values(providers), ...Object.values(services)],
})
export class AccessControlModule {}
