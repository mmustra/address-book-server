import { Global, Module } from '@nestjs/common';

import * as modules from './modules';
import * as services from './services';

@Global()
@Module({
  imports: Object.values(modules),
  providers: Object.values(services),
  exports: [...Object.values(modules), ...Object.values(services)],
})
export class CommonModule {}
