import { ACGuard, UseRoles, UserRoles } from 'nest-access-control';

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ExceptionDto } from '../_common/dto';
import { Resource } from '../_common/modules/access-control/enums';
import {
    UsersCreateGuard, UsersDeleteGuard, UsersEditGuard, UsersSingleGuard,
} from '../_common/modules/access-control/guards';
import { AccessControlService } from '../_common/modules/access-control/services';
import { Role } from '../roles/enums';
import { User } from './decorators';
import { UserCreateDto, UserDto, UserGetQueryDto, UserUpdateDto } from './dto';
import { IUser } from './interfaces';
import { UserService } from './services/user.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly accessControlServie: AccessControlService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description:
      'If no query parameter is used, it will always return first page.',
  })
  @ApiResponse({
    status: 200,
    type: UserDto,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    type: ExceptionDto,
  })
  @UseGuards(AuthGuard(), ACGuard)
  @UseRoles({
    resource: Resource.Users,
    action: 'read',
    possession: 'any',
  })
  async getAll(
    @Query() options: UserGetQueryDto,
    @UserRoles() roles: Role[],
  ): Promise<IUser[]> {
    const pipeline = [];
    if (!this.accessControlServie.hasRole(roles, Role.Admin)) {
      pipeline.push({ $match: { roles: { $ne: Role.Admin } } });
    }
    if (options.textSearch) {
      pipeline.push({ $match: { $text: { $search: options.textSearch } } });
    }
    return this.userService.findAll(pipeline, options);
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    type: ExceptionDto,
  })
  @UseGuards(AuthGuard())
  async getCurrent(@User() user: IUser): Promise<IUser> {
    return user;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    type: ExceptionDto,
  })
  @UseGuards(AuthGuard(), ACGuard, UsersSingleGuard)
  @UseRoles({
    resource: Resource.Users,
    action: 'read',
    possession: 'own',
  })
  async getOne(@Param('id') id: string): Promise<IUser> {
    return this.userService.findOneById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({
    status: 201,
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    type: ExceptionDto,
  })
  @UseGuards(AuthGuard(), ACGuard, UsersCreateGuard)
  @UseRoles({
    resource: Resource.Users,
    action: 'create',
    possession: 'own',
  })
  async create(@Body() userData: UserCreateDto): Promise<IUser> {
    return this.userService.create(userData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    type: ExceptionDto,
  })
  @UseGuards(AuthGuard(), ACGuard, UsersEditGuard, UsersSingleGuard)
  @UseRoles({
    resource: Resource.Users,
    action: 'update',
    possession: 'own',
  })
  async update(
    @Param('id') id: string,
    @Body() updateData: UserUpdateDto,
  ): Promise<IUser> {
    return this.userService.updateOneById(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({
    status: 400,
    type: ExceptionDto,
  })
  @UseGuards(AuthGuard(), ACGuard, UsersDeleteGuard, UsersSingleGuard)
  @UseRoles({
    resource: Resource.Users,
    action: 'delete',
    possession: 'own',
  })
  async delete(@Param('id') id: string, @User() user: IUser): Promise<void> {
    return this.userService.deleteOneById(id);
  }
}
