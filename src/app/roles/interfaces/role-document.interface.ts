import { Document } from 'mongoose';

export interface IRoleDocument extends Document {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
