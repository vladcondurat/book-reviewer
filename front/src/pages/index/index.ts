import { getBookById, getFavouriteBooks, addBookToFavourites, removeBookFromFavourites, getBooks } from '@app/api/book-requests';
import { getReadingProgress } from '@app/api/reading-progress';
import { getCurrentUser } from '@app/api/user-requests';
import { showAlert } from '@app/components/alert/alert';

export const indexScript = async (): Promise<void> => {
  const myBooksContainer = document.querySelector('.my-books-cards-container');
  const latestBooksContainer = document.querySelector('.latest-books-cards');

  const latestBooks = await getBooks();
  let latestBooksHtml = '';
  const maxBooksToShow = 4;
  const latestBooksToShow = latestBooks.data.slice(0, maxBooksToShow);

  for (const book of latestBooksToShow) {
    const isFavourite = await checkIfFavourite(book._id);
    latestBooksHtml += `
      <div class="card" data-book-id="${book._id}">
        <a href="#bookpage/${book._id}">
          <div class="bookcover-wrapper">
            <div class="card-top-info">
              <div class="card-info-genre">${book.genre}</div>
              <div class="card-favourite">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1.17157 1.48291C2.73367 -0.0380843 5.26633 -0.0380843 6.82842 1.48291L7.99999 2.62365L9.17157 1.48291C10.7337 -0.0380843 13.2663 -0.0380843 14.8284 1.48291C16.3905 3.00389 16.3905 5.46991 14.8284 6.99089L7.99999 13.6396L1.17157 6.99089C-0.390524 5.46991 -0.390524 3.00389 1.17157 1.48291Z"
                    fill="${isFavourite ? '#BE123C' : '#222'}"
                  />
                </svg>
              </div>
            </div>
            <img src="${book.bookCoverImage}" alt="Book Cover" class="book-cover" />
          </div>
        </a>
        <div class="book-meta">${book.year} • ${book.edition} • ${book.publishingHouse}</div>
        <div class="book-title">${book.title}</div>
        <div class="author">by ${book.author}</div>
      </div>`;
  }

  if (latestBooksHtml === '') {
    latestBooksHtml = 'No books found!';
  }

  if (latestBooksContainer !== null) {
    latestBooksContainer.innerHTML = latestBooksHtml;

    const favouriteButtons = latestBooksContainer.querySelectorAll('.card-favourite');
    favouriteButtons.forEach(button => {
      button.addEventListener('click', async event => {
        event.preventDefault();
        const card = (event.target as HTMLElement).closest('.card');
        const bookId = card?.getAttribute('data-book-id');

        if (bookId != null) {
          const isFavourite = await checkIfFavourite(bookId);

          try {
            if (isFavourite) {
              await removeBookFromFavourites(bookId);
              showAlert('Success', 'Book removed from favourites.');
              if (card != null) card.querySelector('path')?.setAttribute('fill', '#222');
            } else {
              await addBookToFavourites(bookId);
              showAlert('Success', 'Book added to favourites.');
              if (card != null) card.querySelector('path')?.setAttribute('fill', '#BE123C');
            }
          } catch (error) {
            showAlert('Error', `Failed to ${isFavourite ? 'remove' : 'add'} book to favourites.`);
          }
        }
      });
    });
  }

  // Fetch and display my books
  const currentUser = await getCurrentUser();

  if (currentUser.data == null) {
    // showAlert('Error', 'You need to be logged in to view your books.');
    console.error('Error fetching user:', currentUser.error);
    return;
  }

  const myBooks = await getFavouriteBooks();

  if (myBooks.data == null) {
    console.error('Error fetching books:', myBooks.error);
    return;
  }

  let myBooksHtml = '';
  const booksToShow = myBooks.data.slice(0, maxBooksToShow);

  for (const bookId of booksToShow) {
    const book = await getBookById(bookId);

    if (book.data == null) {
      console.error('Error fetching book:', book.error);
      continue;
    }

    const isFavourite = myBooks.data?.includes(book.data._id) ?? false;
    const progress = (await getReadingProgress(book.data._id)).data;

    myBooksHtml += `
      <div class="card" data-book-id="${book.data?._id}">
        <a href="#bookpage/${book.data._id}">
          <div class="bookcover-wrapper">
            <div class="card-top-info">
              <div class="card-info-genre">${book.data.genre}</div>
              <div class="card-favourite">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1.17157 1.48291C2.73367 -0.0380843 5.26633 -0.0380843 6.82842 1.48291L7.99999 2.62365L9.17157 1.48291C10.7337 -0.0380843 13.2663 -0.0380843 14.8284 1.48291C16.3905 3.00389 16.3905 5.46991 14.8284 6.99089L7.99999 13.6396L1.17157 6.99089C-0.390524 5.46991 -0.390524 3.00389 1.17157 1.48291Z"
                    fill="${isFavourite ? '#BE123C' : '#222'}"
                  />
                </svg>
              </div>
            </div>
            <img src="${book.data.bookCoverImage}" alt="Book Cover" class="book-cover" />
          </div>
        </a>
        <div class="book-meta">${book.data.year} • ${book.data.edition} • ${book.data.publishingHouse}</div>
        <div class="book-title">${book.data.title}</div>
        <div class="author">by ${book.data.author}</div>
        <div class="progress-bar">
          <div class="progress" data-progress="${progress === -1 ? 0 : progress}"></div>
          <span class="progress-text">${progress === -1 ? 0 : progress}%</span>
        </div>
      </div>`;
  }

  if (myBooksHtml === '') {
    myBooksHtml = 'No books found!';
  }

  if (myBooksContainer !== null) {
    myBooksContainer.innerHTML = myBooksHtml;

    const progressBars = myBooksContainer.querySelectorAll('.progress');
    progressBars.forEach(progressBar => {
      const progress = progressBar.getAttribute('data-progress');
      if (progress !== null) {
        progressBar.style.width = `${progress}%`;
      }
    });

    const favouriteButtons = myBooksContainer.querySelectorAll('.card-favourite');
    favouriteButtons.forEach(button => {
      button.addEventListener('click', async event => {
        event.preventDefault();
        const card = (event.target as HTMLElement).closest('.card');
        const bookId = card?.getAttribute('data-book-id');

        if (bookId != null && currentUser.data?._id != null) {
          const isFavourite = myBooks.data?.includes(bookId) ?? false;

          try {
            if (isFavourite) {
              await removeBookFromFavourites(bookId);
              showAlert('Success', 'Book removed from favourites.');
              if (card != null) card.querySelector('path')?.setAttribute('fill', '#222');
            } else {
              await addBookToFavourites(bookId);
              showAlert('Success', 'Book added to favourites.');
              if (card != null) card.querySelector('path')?.setAttribute('fill', '#BE123C');
            }
            if (myBooks.data != null) myBooks.data = isFavourite ? myBooks.data?.filter(id => id !== bookId) : [...(myBooks.data || []), bookId];
          } catch (error) {
            showAlert('Error', `Failed to ${isFavourite ? 'remove' : 'add'} book to favourites.`);
          }
        }
      });
    });
  }
};

const checkIfFavourite = async (bookId: string): Promise<boolean> => {
  const currentUser = await getCurrentUser();
  if (currentUser.data == null) {
    return false;
  }

  const favouriteBooks = await getFavouriteBooks();
  return favouriteBooks.data?.includes(bookId) ?? false;
};

document.addEventListener('DOMContentLoaded', indexScript);
