export interface ICreateNews {
  userId: string;
  type: string;
  bookId?: string;
  createdAt: Date;
}
