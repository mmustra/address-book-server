export interface IContact {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  emails?: string[];
  phones?: string[];
  avatarUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
