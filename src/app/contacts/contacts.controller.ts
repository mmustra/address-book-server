/* tslint:disable:no-shadowed-variable */
import * as _ from 'lodash';
import { ACGuard, UseRoles } from 'nest-access-control';

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ExceptionDto } from '../_common/dto';
import { Resource } from '../_common/modules/access-control/enums';
import {
    ContactsCreateGuard, ContactsReadAllGuard, ContactsSingleGuard, ContactsUpdateGuard,
} from '../_common/modules/access-control/guards';
import { AccessControlService } from '../_common/modules/access-control/services';
import { Role } from '../roles/enums';
import { User, UserIdsRole } from '../users/decorators';
import { UserDto } from '../users/dto';
import { IUserIdsRole } from '../users/interfaces';
import { ContactCreateDto, ContactDto, ContactFindAllResponseDto, ContactGetQueryDto, ContactUpdateDto } from './dto';
import { IContactDocument } from './interfaces';
import { IContactPaginationResponse } from './interfaces/contact-pagination-response.interface';
import { ContactService } from './services/contact.service';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly contactService: ContactService,
    private readonly accessControlServie: AccessControlService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all contacts',
    description:
      'If no query parameter is used, it will always return first page.',
  })
  @ApiResponse({
    status: 200,
    type: ContactFindAllResponseDto,
  })
  @ApiResponse({
    status: 400,
    type: ExceptionDto,
  })
  @UseGuards(AuthGuard(), ACGuard, ContactsReadAllGuard)
  @UseRoles({
    resource: Resource.Contacts,
    action: 'read',
    possession: 'own',
  })
  async getAll(
    @Query() options: ContactGetQueryDto,
    @User() user: UserDto,
    @UserIdsRole() userIdsRole: IUserIdsRole[],
  ): Promise<IContactPaginationResponse> {
    const roles = user.roles;
    let filter;

    if (options.any) {
      if (this.accessControlServie.hasRole(roles, Role.Admin)) {
        filter = {};
      } else if (this.accessControlServie.hasRole(roles, Role.Moderator)) {
        const { ids: adminIds } = _.find(userIdsRole, { role: Role.Admin });
        filter = {
          userId: { $nin: adminIds },
        };
      }
    } else {
      filter = {
        userId: user.id,
      };
    }

    if (options.textSearch) {
      filter = {
        $and: [{ $text: { $search: options.textSearch } }, filter],
      };
    }

    return this.contactService.findAll(filter, {
      page: options.page,
      limit: options.limit,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact by id' })
  @ApiResponse({
    status: 200,
    type: ContactDto,
  })
  @ApiResponse({
    status: 400,
    type: ExceptionDto,
  })
  @UseGuards(AuthGuard(), ACGuard, ContactsSingleGuard)
  @UseRoles({
    resource: Resource.Contacts,
    action: 'read',
    possession: 'own',
  })
  async getOne(@Param('id') id: string): Promise<IContactDocument> {
    return this.contactService.findOneById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new contact' })
  @ApiResponse({
    status: 201,
    type: ContactDto,
  })
  @ApiResponse({
    status: 400,
    type: ExceptionDto,
  })
  @UseGuards(AuthGuard(), ACGuard, ContactsCreateGuard)
  @UseRoles({
    resource: Resource.Contacts,
    action: 'create',
    possession: 'own',
  })
  async create(
    @Body() ContactDto: ContactCreateDto,
    @User() user: UserDto,
  ): Promise<IContactDocument> {
    return this.contactService.createForUser(user.id, ContactDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update contact' })
  @ApiResponse({
    status: 200,
    type: ContactDto,
  })
  @ApiResponse({
    status: 400,
    type: ExceptionDto,
  })
  @UseGuards(AuthGuard(), ACGuard, ContactsUpdateGuard, ContactsSingleGuard)
  @UseRoles({
    resource: Resource.Contacts,
    action: 'update',
    possession: 'own',
  })
  async update(
    @Param('id') id: string,
    @Body() updateData: ContactUpdateDto,
  ): Promise<IContactDocument> {
    return this.contactService.updateOneById(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contact by id' })
  @ApiResponse({
    status: 400,
    type: ExceptionDto,
  })
  @UseGuards(AuthGuard(), ACGuard, ContactsSingleGuard)
  @UseRoles({
    resource: Resource.Contacts,
    action: 'delete',
    possession: 'own',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.contactService.deleteOneById(id);
  }
}
