import { IUser } from './';

export interface IUserPaginationResponse {
  docs: IUser[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean | null;
  hasNextPage: boolean | null;
  prevPage: number | null;
  nextPage: number | null;
}
