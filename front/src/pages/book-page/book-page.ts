import { deleteBook, getBookById } from '@app/api/book-requests';
import { getReadingProgress, setReadingProgress } from '@app/api/reading-progress';
import { addReviewToBook, getReviewsForBook } from '@app/api/review';
import { getCurrentUser, getUserById } from '@app/api/user-requests';
import { showAlert } from '@app/components/alert/alert';

const handleAdminInterface = async (role: string, bookId: string): Promise<void> => {
  if (role === 'admin') {
    const moreInfoContainer = document.querySelector('.more-info-container');
    if (moreInfoContainer != null) {
      moreInfoContainer.innerHTML = '<button type="button" class="delete-book-button">Delete book</button>';
    }

    const deleteBookButton = document.querySelector('.delete-book-button');

    deleteBookButton?.addEventListener('click', async () => {
      const response = await deleteBook(bookId);

      if (response.error == null) {
        showAlert('Success', 'Book deleted successfully.');
        window.location.href = '#';
      } else {
        showAlert('Error', 'Failed to delete book.');
      }
    });
  }
};

export const bookPageScript = async (): Promise<void> => {
  const bookId = window.location.hash.replace('#', '').split('/')[1];

  const bookInfoContainer = document.querySelector('.book-info-container');
  const bookCoverWrapper = document.querySelector('.book-cover-wrapper');
  const reviewsSection = document.getElementById('reviews-section');
  const addReviewForm = document.getElementById('add-review-form');
  const addAReviewProgress = document.getElementById('add-a-review-progress');
  const currentProgressForm = document.getElementById('current-progress-form');
  const currentProgressInput = document.getElementById('current-progress-input') as HTMLInputElement;

  try {
    if (bookId != null) {
      const book = (await getBookById(bookId)).data;
      if (bookInfoContainer != null && book != null) {
        bookInfoContainer.innerHTML = `
        <div class="book-page-tags">
          <span class="book-page-tag">${book.genre}</span>
          <span class="book-page-tag">Year: ${book.year}</span>
          <span class="book-page-tag">${book.publishingHouse}</span>
        </div>
        <h1 class="book-page-title">${book.title}</h1>
        <h2 class="book-page-author">by ${book.author}</h2>
        <p class="book-page-description">${book.description}</p>
      `;
      }
      if (bookCoverWrapper != null && book != null) {
        bookCoverWrapper.innerHTML = `<img src="${book.bookCoverImage}" alt="Book Cover" class="book-page-book-cover" />`;
      }

      const reviews = await getReviewsForBook(bookId);
      if (reviewsSection != null && reviews.data != null) {
        const reviewsHtml = await Promise.all(
          reviews.data.map(async review => {
            const user = (await getUserById(review.userId)).data;
            return `
                  <div class="review-container">
                    <div class="review-header">
                      <img class="review-profile-picture" src="${user?.avatarUrl}" />
                      <div class="review-header-details">
                        <div class="review-username">${user?.username}</div>
                        <div class="review-header-numbers-container">
                          <div class="review-header-rating">${getRatingStars(review.rating)}</div>
                          <div class="review-header-percentage">${review.readingProgress}%</div>
                        </div>
                      </div>
                    </div>
                    <div class="review-content">${review.description}</div>
                  </div>
                `;
          }),
        );

        reviewsSection.innerHTML = reviewsHtml.join('');
      }

      if (addReviewForm != null) {
        addReviewForm.addEventListener('submit', async event => {
          event.preventDefault();
          const description = (document.getElementById('review-description') as HTMLTextAreaElement).value;
          const ratingElement = document.querySelector('input[name="rating"]:checked')!;
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          const rating = ratingElement ? ratingElement.value : null;
          if (description.length === 0 || rating == null) {
            showAlert('Error', 'Please provide both a description and a rating.');
            return;
          }
          try {
            const response = await addReviewToBook(bookId, description, rating);
            if (response.data == null) {
              return;
            }
            showAlert('Success', 'Review added successfully.');

            const updatedReviews = await getReviewsForBook(bookId);
            if (reviewsSection != null && updatedReviews.data != null) {
              const updatedReviewsHtml = await Promise.all(
                updatedReviews.data.map(async review => {
                  const user = (await getUserById(review.userId)).data;
                  return `
                  <div class="review-container">
                    <div class="review-header">
                      <img class="review-profile-picture" src="${user?.avatarUrl}" />
                      <div class="review-header-details">
                        <div class="review-username">${user?.username}</div>
                        <div class="review-header-numbers-container">
                          <div class="review-header-rating">${getRatingStars(review.rating)}</div>
                          <div class="review-header-percentage">${review.readingProgress}%</div>
                        </div>
                      </div>
                    </div>
                    <div class="review-content">${review.description}</div>
                  </div>
                `;
                }),
              );

              reviewsSection.innerHTML = updatedReviewsHtml.join('');
            }
          } catch (error) {
            showAlert('Error', 'Failed to add review.');
          }
        });
      }

      const currentUser = await getCurrentUser();

      void handleAdminInterface(currentUser.data?.role, bookId);

      if (currentUser.data?._id != null) {
        const readingProgress = await getReadingProgress(bookId);
        if (addAReviewProgress != null) {
          addAReviewProgress.innerHTML = `Reading progress: ${readingProgress.data === -1 ? 0 : readingProgress.data}%`;
          const currentProgressNumber = document.querySelector('.current-progress-number');
          if (currentProgressNumber != null) {
            currentProgressNumber.textContent = `${readingProgress.data === -1 ? 0 : readingProgress.data}%`;
          }
          const currentProgressFilledBar = document.querySelector('.current-progress-filled-bar');
          if (currentProgressFilledBar != null) {
            currentProgressFilledBar.style.width = `${readingProgress.data === -1 ? 0 : readingProgress.data}%`;
          }
        }

        if (currentProgressForm != null) {
          currentProgressForm.addEventListener('submit', async event => {
            event.preventDefault();
            const progress = parseInt(currentProgressInput.value);
            if (isNaN(progress) || progress < 0 || progress > 100) {
              showAlert('Error', 'Please provide a valid progress percentage between 0 and 100.');
              return;
            }
            try {
              const response = await setReadingProgress(currentUser.data._id, bookId, progress);
              if (response.error) {
                showAlert('Error', response.error);
                return;
              }
              showAlert('Success', 'Reading progress updated successfully.');
              addAReviewProgress.innerHTML = `Reading progress: ${progress}%`;
              const currentProgressNumber = document.querySelector('.current-progress-number');
              if (currentProgressNumber != null) {
                currentProgressNumber.textContent = `${progress}%`;
              }
              const currentProgressFilledBar = document.querySelector('.current-progress-filled-bar');
              if (currentProgressFilledBar != null) {
                currentProgressFilledBar.style.width = `${progress}%`;
              }
            } catch (error) {
              showAlert('Error', 'Failed to update reading progress.');
            }
          });
        }
      }
    }
  } catch (error) {
    console.error('Error getting book:', error);
  }
};

function getRatingStars(rating: number): string {
  const starSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
      <path
        d="M5.04894 0.927049C5.3483 0.00573826 6.6517 0.00573993 6.95106 0.927051L7.5716 2.83688C7.70547 3.2489 8.08943 3.52786 8.52265 3.52786H10.5308C11.4995 3.52786 11.9023 4.76748 11.1186 5.33688L9.49395 6.51722C9.14347 6.77187 8.99681 7.22323 9.13068 7.63525L9.75122 9.54508C10.0506 10.4664 8.9961 11.2325 8.21238 10.6631L6.58778 9.48278C6.2373 9.22813 5.7627 9.22814 5.41221 9.48278L3.78761 10.6631C3.0039 11.2325 1.94942 10.4664 2.24878 9.54508L2.86932 7.63526C3.00319 7.22323 2.85653 6.77186 2.50604 6.51722L0.881445 5.33688C0.0977311 4.76748 0.500508 3.52786 1.46923 3.52786H3.47735C3.91057 3.52786 4.29453 3.2489 4.4284 2.83688L5.04894 0.927049Z"
        fill="#E4A70A"
      />
    </svg>`;
  const emptyStarSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
      <path
        d="M5.04894 0.927049C5.3483 0.00573826 6.6517 0.00573993 6.95106 0.927051L7.5716 2.83688C7.70547 3.2489 8.08943 3.52786 8.52265 3.52786H10.5308C11.4995 3.52786 11.9023 4.76748 11.1186 5.33688L9.49395 6.51722C9.14347 6.77187 8.99681 7.22323 9.13068 7.63525L9.75122 9.54508C10.0506 10.4664 8.9961 11.2325 8.21238 10.6631L6.58778 9.48278C6.2373 9.22813 5.7627 9.22814 5.41221 9.48278L3.78761 10.6631C3.0039 11.2325 1.94942 10.4664 2.24878 9.54508L2.86932 7.63526C3.00319 7.22323 2.85653 6.77186 2.50604 6.51722L0.881445 5.33688C0.0977311 4.76748 0.500508 3.52786 1.46923 3.52786H3.47735C3.91057 3.52786 4.29453 3.2489 4.4284 2.83688L5.04894 0.927049Z"
        fill="#D1D5DB"
      />
    </svg>`;

  return `${starSVG.repeat(rating)}${emptyStarSVG.repeat(5 - rating)}`;
}

document.addEventListener('DOMContentLoaded', bookPageScript);
