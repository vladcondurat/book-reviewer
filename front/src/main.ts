/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import { search } from './api/search';
import { getCurrentUser } from './api/user-requests';
import { type ISearchResults } from './types/api/ISearchResults';

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
const modalButton = document.getElementById('modal-button');
const modal = document.getElementById('modal');
const modalCloseButton = document.getElementById('modal-close');
const navLinks = document.querySelectorAll('.nav-link');

const fetchResults = async (searchInput: string): Promise<ISearchResults> => {
  try {
    const results = await search(searchInput);
    return results.data ?? { books: [] };
  } catch (error) {
    console.error('Error fetching search results:', error);
    return { books: [] };
  }
};

const handleSearchBar = (): void => {
  const searchInput = document.querySelector('.search-input') as HTMLInputElement | null;
  const searchResults = document.querySelector('.search-results-container') as HTMLDivElement | null;

  if (!searchInput || !searchResults) {
    console.error('Search input or results container not found');
    return;
  }

  searchInput.addEventListener('focus', () => {
    searchResults.style.display = 'flex';
  });

  searchInput.addEventListener('blur', () => {
    setTimeout(() => {
      searchResults.style.display = 'none';
    }, 200);
  });

  searchInput.addEventListener('input', async () => {
    const results: ISearchResults = await fetchResults(searchInput.value);

    searchResults.innerHTML = '';

    if (results.books.length > 0) {
      results.books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('result-container');
        bookElement.innerHTML = `       
          <a href="#bookpage/${book._id}" class="result-anchor">
            <img src="${book.bookCoverImage}" alt="Book Cover" class="result-cover" />
            <div class="result-info">
              <div class="result-title">${book.title}</div>
              <div class="result-author">by ${book.author}</div>
            </div>
          </a>
        `;
        searchResults.appendChild(bookElement);
      });
    } else {
      searchResults.innerHTML = '<div class="no-results-found">No results found</div>';
    }
  });
};

const initializeModal = (): void => {
  modalButton?.addEventListener('click', () => {
    if (modal) {
      modal.style.visibility = 'visible';
      modal.style.height = '100%';
    }
  });

  window.addEventListener('hashchange', () => {
    if (modal) {
      modal.style.visibility = 'hidden';
      modal.style.height = '0';
    }
  });

  navLinks.forEach(navLink => {
    navLink.addEventListener('click', () => {
      if (modal) {
        modal.style.visibility = 'hidden';
        modal.style.height = '0';
      }
    });
  });

  modalCloseButton?.addEventListener('click', () => {
    if (modal) {
      modal.style.visibility = 'hidden';
      modal.style.height = '0';
    }
  });
};

const handleAdminPanel = async (): Promise<void> => {
  const currentUser = await getCurrentUser();

  if (currentUser?.data == null) {
    console.error('Error fetching current user');
    return;
  }

  if (currentUser.data.role !== 'admin') {
    console.error('User is not an admin');
    return;
  }

  const navLinks = document.querySelector('.nav-links');
  const navModalLinks = document.querySelector('.nav-modal-links');

  if (currentUser.data.role === 'admin' && navLinks != null) {
    navLinks.innerHTML += '<a type="button" href="#addBookForm" class="nav-add-a-book">+ Add book</a>';
  }

  if (currentUser.data.role === 'admin' && navModalLinks != null) {
    navModalLinks.innerHTML += '<a type="button" href="#addBookForm" class="nav-add-a-book">+ Add book</a>';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  void handleAdminPanel();
  initializeModal();
  handleSearchBar();
});
