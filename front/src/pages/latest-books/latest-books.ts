import { addBookToFavourites, removeBookFromFavourites, getBooks, getFavouriteBooks, getFilteredBooks } from '@app/api/book-requests';
import { showAlert } from '@app/components/alert/alert';

export const latestBooksScript = async (): Promise<void> => {
  const latestBooksContainer = document.querySelector('.latest-books-cards');

  const filters = document.querySelectorAll('.single-filter-container');
  const checks = document.querySelectorAll('.filter-checkbox-container');

  let selectedFilter = 'all';

  const filtersIconWrapper = document.querySelector('.filters-icon-wrapper');
  const filtersPopup = document.querySelector('.filters-popup');

  filtersIconWrapper?.addEventListener('click', () => {
    filtersPopup?.classList.toggle('show-filters');
  });

  const fetchAndDisplayBooks = async (filter: string) => {
    try {
      let latestBooks;
      if (filter !== 'all') {
        latestBooks = await getFilteredBooks(filter);
      } else {
        latestBooks = await getBooks();
      }

      const favouriteBooks = await getFavouriteBooks();

      if (latestBooks.data == null) {
        latestBooksContainer.innerHTML = 'No books found!';
        return;
      }

      let latestBooksHtml = '';

      latestBooks.data.forEach(book => {
        const isFavourite = favouriteBooks.data?.includes(book._id) ?? false;
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
                <img src="${book.bookCoverImage}" alt="Book Cover" class="latest-books-book-cover" />
              </div>
            </a>
            <div class="latest-books-book-meta">${book.year} • ${book.edition} • ${book.publishingHouse}</div>
            <div class="latest-books-book-title">${book.title}</div>
            <div class="latest-books-author">by ${book.author}</div>
          </div>`;
      });

      latestBooksContainer.innerHTML = latestBooksHtml;

      const favouriteButtons = latestBooksContainer.querySelectorAll('.card-favourite');
      favouriteButtons.forEach(button => {
        button.addEventListener('click', async event => {
          event.preventDefault();
          const card = (event.target as HTMLElement).closest('.card');
          const bookId = card?.getAttribute('data-book-id');

          if (bookId != null) {
            const isFavourite = favouriteBooks.data?.includes(bookId) ?? false;

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
              if (favouriteBooks.data != null) favouriteBooks.data = isFavourite ? favouriteBooks.data.filter(id => id !== bookId) : [...(favouriteBooks.data || []), bookId];
            } catch (error) {
              showAlert('Error', `Failed to ${isFavourite ? 'remove' : 'add'} book to favourites.`);
              console.error('Error updating favourites:', error);
            }
          }
        });
      });
    } catch (error) {
      console.error('Error fetching books or favourites:', error);
      showAlert('Error', 'Failed to load books.');
    }
  };

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      checks.forEach(check => {
        check.innerHTML = '';
      });

      const check = filter.querySelector('.filter-checkbox-container');

      if (check != null) {
        check.innerHTML = '<div class="filter-check"></div>';
      }

      selectedFilter = filter.querySelector('.filter-label').textContent?.toLowerCase() ?? 'all';
      selectedFilter = selectedFilter.replace(' ', '-');

      void fetchAndDisplayBooks(selectedFilter);
    });
  });

  void fetchAndDisplayBooks(selectedFilter);
};
