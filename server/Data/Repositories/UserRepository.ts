import { IRegisterUser } from "../../Services/Types/IRegisterUser";
import { IUser } from "../../Services/Types/IUser";
import { UserModel } from "../Entities/User";

export const getUsers = () => UserModel.find();

export const getUserByEmailAddress = (email: string): Promise<IUser | null> =>
  UserModel.findOne({ email }).select(
    "+authentification.salt +authentification.password"
  );

export const getUserByResetToken = (
  resetToken: string
): Promise<IUser | null> => UserModel.findOne({ resetToken });

export const getUserBySessionToken = (
  sessionToken: string
): Promise<IUser | null> =>
  UserModel.findOne({ "authentification.sessionToken": sessionToken });

export const getUserById = (id: string): Promise<IUser | null> =>
  UserModel.findById(id);

export const createUser = (values: IRegisterUser): Promise<IUser> =>
  new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string): Promise<IUser | null> =>
  UserModel.findByIdAndDelete(id);

export const updateUserById = (
  id: string,
  values: Record<string, any>
): Promise<IUser | null> => UserModel.findByIdAndUpdate(id, values);

export const getReadingProgressByBookId = (
  userId: string,
  bookId: string
): Promise<number> =>
  UserModel.findById(userId)
    .select("readingProgress")
    .then((user) => user!.readingProgress!.get(bookId) ?? 0);

export const getReadingProgressByUserId = (
  userId: string
): Promise<Map<string, number>> =>
  UserModel.findById(userId)
    .select("readingProgress")
    .then((user) => user!.readingProgress ?? 0);

export const addOrUpdateReadingProgress = (
  userId: string,
  bookId: string,
  progress: number
): Promise<Map<string, number>> =>
  UserModel.findById(userId).then((user) => {
    user!.readingProgress.set(bookId, progress);
    return user!.save().then(() => user!.readingProgress);
  });

export const getReviewsByUserId = (userId: string): Promise<string[]> =>
  UserModel.findById(userId)
    .select("reviews")
    .then((user) => user!.reviews);
