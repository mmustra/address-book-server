import * as _ from 'lodash';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { IUserModel } from '../../users/interfaces';
import { IContact, IContactDocument, IContactModel } from '../interfaces';
import { IContactPaginationOptions } from '../interfaces/contact-pagination-options.interface';
import { IContactPaginationResponse } from '../interfaces/contact-pagination-response.interface';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel('User')
    private readonly userModel: IUserModel,
    @InjectModel('Contact')
    private readonly contactModel: IContactModel,
  ) {}

  async findAll(
    filter: any = {},
    pagination: IContactPaginationOptions = {
      page: 1,
      limit: 10,
    },
  ): Promise<IContactPaginationResponse> {
    const isInvalidNumber = n => _.isNaN(n) || !_.isFinite(n) || n < 1;
    const options = {
      populate: { path: 'user', select: 'firstName lastName' },
      ..._.omitBy(pagination, isInvalidNumber),
    };
    return this.contactModel.paginate(filter, options);
  }

  async findOneById(id: string): Promise<IContactDocument> {
    return this.contactModel
      .findById(id)
      .populate({ path: 'user', select: 'firstName lastName' })
      .orFail()
      .exec();
  }

  async createForUser(
    userId: string,
    contactData: Omit<IContact, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  ): Promise<IContactDocument> {
    const user = await this.userModel
      .findById(userId)
      .orFail()
      .exec();
    const newContact = await this.contactModel.create({
      userId,
      ...contactData,
    });
    user.contacts.push(newContact);
    await user.save();
    return newContact
      .populate({ path: 'user', select: 'firstName lastName' })
      .execPopulate();
  }

  async updateOneById(
    id: string,
    updateData: Omit<IContact, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  ): Promise<IContactDocument> {
    return this.contactModel
      .findOneAndUpdate({ _id: id }, updateData, {
        new: true,
        runValidators: true,
      })
      .populate({ path: 'user', select: 'firstName lastName' })
      .orFail()
      .exec();
  }

  async deleteOneById(id: string): Promise<void> {
    const contact = await this.contactModel
      .findById(id)
      .orFail()
      .exec();

    await this.userModel
      .findOneAndUpdate({ _id: contact.userId }, { $pull: { contacts: id } })
      .orFail()
      .exec();

    await this.contactModel
      .findByIdAndDelete(id)
      .orFail()
      .exec();
  }
}
