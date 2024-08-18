import { UserRole } from "../../Data/Constants/UserRole";

export interface IRegisterUser {
  email: string;
  username: string;
  role: UserRole;
  avatarUrl: string;
  favouriteBooks: string[];
  reviews: string[];
  readingProgress: Map<string, number>;
  authentification: {
    salt: string;
    password: string;
  };
  resetToken: string | null;
  resetTokenExpiry: Date | null;
}
