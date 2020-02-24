import { Model } from 'mongoose';

import { IContactDocument } from './contact-document.interface';

export interface IContactModel extends Model<IContactDocument> {
  readonly id: string;
  paginate(...args: any): any;
  create(...args: any): any;
  findById(...args: any): any;
  findOneAndUpdate(...args: any): any;
  findByIdAndDelete(...args: any): any;
}
