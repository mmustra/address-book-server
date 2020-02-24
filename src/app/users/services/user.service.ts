import * as _ from 'lodash';
import * as mongoose from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { IContactDocument } from '../../contacts/interfaces';
import { IUser, IUserIdsRole, IUserPaginationOptions } from '../interfaces';
import { IUserModel } from '../interfaces/user-model.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: IUserModel,
    @InjectModel('Contact')
    private readonly contactModel: mongoose.Model<IContactDocument>,
  ) {}

  async getUserIdsByRoles(): Promise<IUserIdsRole[]> {
    return this.userModel
      .aggregate([
        { $project: { id: 1, roles: 1 } },
        { $unwind: '$roles' },
        { $group: { _id: '$roles', ids: { $push: { $toString: '$id' } } } },
        { $project: { _id: 0, role: '$_id', ids: 1 } },
      ])
      .exec();
  }

  async findAll(
    pipeline: any[] = [],
    pagination: IUserPaginationOptions = {
      page: 1,
      limit: 10,
    },
  ): Promise<IUser[]> {
    const aggregate = this.userModel.aggregate(pipeline);
    return this.userModel.aggregatePaginate(
      aggregate,
      _.omitBy(pagination, _.isNil),
    );
  }

  async findOneById(id: string): Promise<IUser> {
    const user = await this.userModel
      .findOne({ _id: id })
      .orFail()
      .exec();

    return this.userModel.filterToObject(user);
  }

  async findOneByCredentials(
    userCredentials: Pick<IUser, 'email' | 'password'>,
  ): Promise<IUser> {
    const user = await this.userModel
      .findOne(userCredentials)
      .orFail()
      .exec();

    return this.userModel.filterToObject(user);
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    const newUser = await this.userModel.create(userData);

    return this.userModel.filterToObject(newUser);
  }

  async updateOneById(id: string, updateData: Partial<IUser>): Promise<IUser> {
    const user = await this.userModel
      .findOneAndUpdate({ _id: id }, updateData, {
        new: true,
        runValidators: true,
        context: 'query',
      })
      .orFail()
      .exec();

    return this.userModel.filterToObject(user);
  }

  async deleteOneById(id: string): Promise<void> {
    await this.contactModel.deleteMany({ userId: id });
    await this.userModel
      .findByIdAndDelete(id)
      .orFail()
      .exec();
  }
}
