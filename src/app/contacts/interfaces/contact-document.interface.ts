import { Document } from 'mongoose';

import { IContact } from './contact.interface';

export interface IContactDocument extends IContact, Document {
  readonly id: string;
}
