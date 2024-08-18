export interface RegisterResponse {
  authentification: {
    password: string;
    salt: string;
    sessionToken: string;
  };
  _id: string;
  username: string;
  email: string;
  role: string;
  avatarUrl: string;
  favouriteBooks: string[];
  readingProgress: Record<string, unknown>;
  __v: number;
}
