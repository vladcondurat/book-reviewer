import { addBook } from '@app/api/book-requests';
import { showAlert } from '@app/components/alert/alert';

export const addBookFormScript = (): void => {
  const bookCoverElement = document.getElementById('book-cover');
  if (bookCoverElement !== null) {
    bookCoverElement.addEventListener('change', function (event) {
      const input = event.target;
      const file = (input as HTMLInputElement).files?.[0];
      if (file !== null) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = document.getElementById('file-input-preview') as HTMLImageElement;
          const svg = document.getElementById('file-input-svg');
          if (e.target?.result !== null && e.target !== null) {
            img.src = e.target.result as string;
            img.classList.add('active');
            if (svg != null) {
              svg.style.display = 'none';
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const form = document.getElementById('add-book-form');
  const bookTitle = document.getElementById('book-title') as HTMLInputElement;
  const bookAuthor = document.getElementById('book-author') as HTMLInputElement;
  const publishingHouse = document.getElementById('publishing-house') as HTMLInputElement;
  const bookEdition = document.getElementById('book-edition') as HTMLInputElement;
  const launchYear = document.getElementById('launch-year') as HTMLInputElement;
  const bookGenres = document.getElementById('book-genres') as HTMLSelectElement;
  const bookDescription = document.getElementById('book-description') as HTMLTextAreaElement;
  const bookCover = document.getElementById('book-cover') as HTMLInputElement;

  if (form !== null) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const bookDetails = {
        title: bookTitle.value,
        description: bookDescription.value,
        author: bookAuthor.value,
        genre: bookGenres.value,
        publishingHouse: publishingHouse.value,
        edition: bookEdition.value,
        year: parseInt(launchYear.value, 10),
      };

      if (
        bookDetails.title === '' ||
        bookDetails.description === '' ||
        bookDetails.author === '' ||
        bookDetails.genre === '' ||
        bookDetails.publishingHouse === '' ||
        bookDetails.edition === '' ||
        isNaN(bookDetails.year)
      ) {
        showAlert('Error', 'Please fill in all fields.');
        return;
      }

      const file = bookCover.files?.[0];
      if (file != null) {
        try {
          const response = await addBook(bookDetails, file);
          showAlert('Success', 'Book added successfully.');
          window.location.href = '#';
          console.log('Book added successfully:', response);
        } catch (error) {
          showAlert('Error', 'Failed to add book.');
          console.error('Error adding book:', error);
        }
      } else {
        console.error('No file selected');
      }
    });
  }
};
