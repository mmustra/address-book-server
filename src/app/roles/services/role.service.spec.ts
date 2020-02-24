import { Test, TestingModule } from '@nestjs/testing';

import { RoleService } from './role.service';

describe('AccessControlService', (): void => {
  let service: RoleService;

  beforeEach(
    async (): Promise<void> => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [RoleService],
      }).compile();

      service = module.get<RoleService>(RoleService);
    },
  );

  it('should be defined', (): void => {
    expect(service).toBeDefined();
  });
});
