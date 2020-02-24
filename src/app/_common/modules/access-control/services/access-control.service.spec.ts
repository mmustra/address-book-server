import { Test, TestingModule } from '@nestjs/testing';

import { AccessControlService } from './access-control.service';

describe('AccessControlService', (): void => {
  let service: AccessControlService;

  beforeEach(
    async (): Promise<void> => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [AccessControlService],
      }).compile();

      service = module.get<AccessControlService>(AccessControlService);
    },
  );

  it('should be defined', (): void => {
    expect(service).toBeDefined();
  });
});
