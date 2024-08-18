export interface LoginResponse {
  authentification: {
    password: string;
    salt: string;
    sessionToken: string;
  };
  _id: string;
  username: string;
  email: string;
  role: string;
  favouriteBooks: string[];
  readingProgress: Record<string, unknown>;
  __v: number;
}
