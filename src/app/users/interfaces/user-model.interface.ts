import { Model } from 'mongoose';

import { IUser } from './';
import { IUserDocument } from './user-document.interface';

export interface IUserModel extends Model<IUserDocument> {
  filterToObject(user: IUserDocument): IUser;
  paginate(...args: any): any;
  aggregate(...args: any): any;
  aggregatePaginate(...args: any): any;
  create(...args: any): any;
  findOne(...args: any): any;
  findById(...args: any): any;
  findOneAndUpdate(...args: any): any;
  findByIdAndDelete(...args: any): any;
  estimatedDocumentCount(...args: any): any;
}
