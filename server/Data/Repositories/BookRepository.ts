import { IBook } from "../../Services/Types/IBook";
import { BookModel } from "../Entities/Book";
import { UserModel } from "../Entities/User";

export const getBooks = (): Promise<IBook[]> =>
  BookModel.find().then((books) => books.reverse());

export const getBooksHorror = () =>
  BookModel.find({ genre: "Horror" }).then((books) => books.reverse());
export const getBooksComedy = () =>
  BookModel.find({ genre: "Comedy" }).then((books) => books.reverse());
export const getBooksRomance = () =>
  BookModel.find({ genre: "Romance" }).then((books) => books.reverse());
export const getBooksScienceFiction = () =>
  BookModel.find({ genre: "Science Fiction" }).then((books) => books.reverse());
export const getBooksClassics = () =>
  BookModel.find({ genre: "Classics" }).then((books) => books.reverse());

export const getBookById = (id: string): Promise<IBook | null> =>
  BookModel.findById(id);

export const createBook = (values: IBook): Promise<IBook> =>
  new BookModel(values).save().then((book) => book.toObject());

export const deleteBookById = (id: string) => BookModel.findByIdAndDelete(id);

export const updateBookById = (
  id: string,
  values: IBook
): Promise<IBook | null> => BookModel.findByIdAndUpdate(id, values);

export const getFavouriteBooksByUserId = (id: string): Promise<string[]> =>
  UserModel.findById(id)
    .select("favouriteBooks")
    .then((user) => user!.favouriteBooks);

export const deleteFavouriteBookByBookId = (
  userId: string,
  bookId: string
): Promise<string[]> =>
  UserModel.findByIdAndUpdate(
    userId,
    { $pull: { favouriteBooks: bookId } },
    { new: true }
  ).then((user) => user!.favouriteBooks);

export const addFavouriteBookByBookId = (
  userId: string,
  bookId: string
): Promise<string[]> =>
  UserModel.findByIdAndUpdate(
    userId,
    { $addToSet: { favouriteBooks: bookId } },
    { new: true }
  ).then((user) => user!.favouriteBooks);
