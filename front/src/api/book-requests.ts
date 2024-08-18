import { type IBook } from '@app/types/api/IBook';
import { type ApiResponse, apiFetch } from './api';
import { uploadFile } from './firebase/storage-requests';

export const addBook = async (bookDetails: Omit<IBook, 'bookCoverImage'>, file: File): Promise<ApiResponse<IBook>> => {
  try {
    const bookCoverImage = await uploadFile(file);

    const response = await apiFetch<IBook>('books', {
      method: 'POST',

      body: JSON.stringify({
        ...bookDetails,
        bookCoverImage,
      }),
    });

    return response;
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

export const getFavouriteBooks = async (): Promise<ApiResponse<string[]>> => {
  return await apiFetch<string[]>('users/books', {
    method: 'GET',
  });
};

export const addBookToFavourites = async (bookId: string): Promise<ApiResponse<string>> => {
  return await apiFetch<string>('users/books', {
    method: 'POST',
    body: JSON.stringify({ bookId }),
  });
};

export const removeBookFromFavourites = async (bookId: string): Promise<ApiResponse<string[]>> => {
  return await apiFetch<string[]>('users/books', {
    method: 'DELETE',
    body: JSON.stringify({ bookId }),
  });
};

export const getBookById = async (bookId: string): Promise<ApiResponse<IBook>> => {
  return await apiFetch<IBook>(`books/${bookId}`, {
    method: 'GET',
  });
};

export const getBooks = async (): Promise<ApiResponse<IBook[]>> => {
  return await apiFetch<IBook[]>('books', {
    method: 'GET',
  });
};

export const getFilteredBooks = async (filter: string): Promise<ApiResponse<IBook[]>> => {
  return await apiFetch<IBook[]>(`books?filter=${filter}`, {
    method: 'GET',
  });
};

export const deleteBook = async (bookId: string): Promise<ApiResponse<string>> => {
  return await apiFetch<string>(`books/${bookId}`, {
    method: 'DELETE',
  });
};
