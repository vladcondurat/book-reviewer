import { getBooks } from "../../Data/Repositories/BookRepository";
import { ISearchResults } from "../Types/ISearchResults";

export async function getSearchResults(input: string): Promise<ISearchResults> {
  const books = await getBooks();

  const lowerCaseInput = input.toLowerCase();

  const titleMatches = books.filter((book) =>
    book.title.toLowerCase().includes(lowerCaseInput)
  );
  const authorMatches = books.filter(
    (book) =>
      !titleMatches.includes(book) &&
      book.author.toLowerCase().includes(lowerCaseInput)
  );
  const genreMatches = books.filter(
    (book) =>
      !titleMatches.includes(book) &&
      !authorMatches.includes(book) &&
      book.genre.toLowerCase().includes(lowerCaseInput)
  );
  const yearMatches = books.filter(
    (book) =>
      !titleMatches.includes(book) &&
      !authorMatches.includes(book) &&
      !genreMatches.includes(book) &&
      book.year.toString().includes(lowerCaseInput)
  );
  const descriptionMatches = books.filter(
    (book) =>
      !titleMatches.includes(book) &&
      !authorMatches.includes(book) &&
      !genreMatches.includes(book) &&
      !yearMatches.includes(book) &&
      book.description.toLowerCase().includes(lowerCaseInput)
  );

  const prioritizedBooks = [
    ...titleMatches,
    ...authorMatches,
    ...genreMatches,
    ...yearMatches,
    ...descriptionMatches,
  ];

  return { books: prioritizedBooks };
}
