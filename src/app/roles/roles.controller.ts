import { ACGuard, UseRoles } from 'nest-access-control';

import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ExceptionDto } from '../_common/dto';
import { RoleDto } from './dto/role.dto';
import { IRoleDocument } from './interfaces';
import { RoleService } from './services';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    type: RoleDto,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    type: ExceptionDto,
  })
  @UseGuards(AuthGuard(), ACGuard)
  @UseRoles({
    resource: 'roles',
    action: 'read',
    possession: 'any',
  })
  async getAll(): Promise<IRoleDocument[]> {
    return this.roleService.getAll();
  }
}
