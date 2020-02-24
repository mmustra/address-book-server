import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { IRoleDocument } from '../interfaces';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel('Role')
    private readonly roleModel: Model<IRoleDocument>,
  ) {}

  async getAll(): Promise<IRoleDocument[]> {
    return this.roleModel.find().exec();
  }
}
