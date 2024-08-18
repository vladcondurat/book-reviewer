export interface IUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatarUrl: string;
  favouriteBooks: string[];
  readingProgress: Record<string, number>;
  __v: number;
}
