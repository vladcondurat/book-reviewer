import { BusinessError } from "../Exceptions/BusinessErrors";
import { HttpStatusCode } from "../Constants/HttpStatusCodes";
import { generatePasswordHash, random } from "../Utils/GeneratePasswordHash";
import { UserRole } from "../../Data/Constants/UserRole";
import {
  getUserByEmailAddress,
  createUser,
  getUserByResetToken,
} from "../../Data/Repositories/UserRepository";
import { generateResetToken } from "../Utils/GenerateResetToken";
import { AuthError } from "../Exceptions/AuthErrors";
import { EntityNotFoundError } from "../Exceptions/EntityNotFound";
import { IUser } from "../Types/IUser";

export async function registerUser(userData: IUser): Promise<IUser> {
  const { email, password, username, avatarUrl } = userData;

  if (!email || !password || !username || !avatarUrl) {
    throw new BusinessError("Bad Request", HttpStatusCode.BAD_REQUEST);
  }

  const existingUser = await getUserByEmailAddress(email);
  if (existingUser) {
    throw new BusinessError("Email already exists", HttpStatusCode.BAD_REQUEST);
  }

  const salt = random();
  const user = await createUser({
    email,
    username,
    role: UserRole.REGULAR,
    avatarUrl,
    favouriteBooks: [],
    reviews: [],
    readingProgress: new Map<string, number>(),
    authentification: {
      salt,
      password: generatePasswordHash(password, salt),
    },
    resetToken: null,
    resetTokenExpiry: null,
  });

  return user;
}

export async function loginUser(userData: IUser): Promise<IUser> {
  const { email, password } = userData;

  if (!email || !password) {
    throw new BusinessError("Bad Request", HttpStatusCode.BAD_REQUEST);
  }

  const user = await getUserByEmailAddress(email);

  if (!user) {
    throw new AuthError("Forbidden", HttpStatusCode.FORBIDDEN);
  }

  if (!user.authentification) {
    throw new AuthError("Forbidden", HttpStatusCode.FORBIDDEN);
  }

  const expectedHash = generatePasswordHash(
    password,
    user.authentification.salt!
  );

  if (user.authentification.password != expectedHash) {
    throw new BusinessError("Forbidden", HttpStatusCode.FORBIDDEN);
  }

  const salt = random();
  user.authentification.sessionToken = generatePasswordHash(
    salt,
    user._id.toString()
  );

  await user.save();
  return user;
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<void> {
  const user = await getUserByResetToken(token);

  if (!user) {
    throw new EntityNotFoundError("User not found", HttpStatusCode.NOT_FOUND);
  }

  if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
    throw new BusinessError("Token has expired", HttpStatusCode.BAD_REQUEST);
  }

  const newSalt = random();
  user.authentification!.password = generatePasswordHash(newPassword, newSalt);
  user.authentification!.salt = newSalt;

  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();
}

export async function getResetToken(email: string): Promise<string> {
  const user = await getUserByEmailAddress(email);

  if (!user) {
    throw new EntityNotFoundError("User not found", HttpStatusCode.NOT_FOUND);
  }

  const token = generateResetToken(email);
  user.resetToken = token;
  user.resetTokenExpiry = new Date(Date.now() + 3600000);

  await user.save();
  return token;
}
