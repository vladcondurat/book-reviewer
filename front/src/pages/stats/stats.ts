import { getStats } from '@app/api/stats';
import { getFavouriteBooks, getBooks } from '@app/api/book-requests';
import { showAlert } from '@app/components/alert/alert';
import { type IStats } from '@app/types/api/IStats';

export const statsScript = async (): Promise<void> => {
  const stats = await getStats();

  if (stats.error != null && window.location.href.includes('stats')) {
    showAlert('Error', stats.error);
    console.error(stats.error);
    return;
  }

  const statsContainer = document.getElementById('stats-grid');

  if (statsContainer === null) {
    console.error('Stats container not found.');
    return;
  }

  statsContainer.innerHTML = `
    <div class="stat-item">
      <div class="stat-title">Books Read</div>
      <div class="stat-number">${stats.data?.booksRead}</div>
    </div>
    <div class="stat-item">
      <div class="stat-title">Favourite Genre</div>
      <div class="stat-number">${stats.data?.favouriteGenre}</div>
    </div>
    <div class="stat-item">
      <div class="stat-title">Favourite Author</div>
      <div class="stat-number">${stats.data?.favouriteAuthor}</div>
    </div>
    <div class="stat-item">
      <div class="stat-title">Reading Now</div>
      <div class="stat-number">${stats.data?.readingNow}</div>
    </div>
    <div class="stat-item">
      <div class="stat-title">Reviews Left</div>
      <div class="stat-number">${stats.data?.reviewsLeft}</div>
    </div>
    <div class="stat-item">
      <div class="stat-title">Average Progress</div>
      <div class="stat-number">${stats.data?.averageProgress}%</div>
    </div>
  `;

  const exportDocBookButton = document.querySelector('.docbook-export-button');
  const exportCSVButton = document.querySelector('.export-btn');

  if (exportDocBookButton !== null) {
    exportDocBookButton.addEventListener('click', async () => {
      await exportToDocBook(stats.data);
    });
  }

  if (exportCSVButton !== null) {
    exportCSVButton.addEventListener('click', async () => {
      await exportToCSV(stats.data);
    });
  }
};

const exportToDocBook = async (stats: IStats | null): Promise<void> => {
  const favouriteBooks = await getFavouriteBooks();
  const allBooks = await getBooks();

  if (favouriteBooks.data === null || allBooks.data === null) {
    showAlert('Error', 'Failed to fetch books data.');
    return;
  }

  const books = allBooks.data.filter(book => favouriteBooks.data.includes(book._id));

  const bookEntries = books
    .map(
      book => `
    <book>
      <title>${book.title}</title>
      <para>Author: ${book.author}</para>
      <para>Genre: ${book.genre}</para>
      <para>Year: ${book.year}</para>
      <para>Publishing House: ${book.publishingHouse}</para>
      <para>Edition: ${book.edition}</para>
    </book>
  `,
    )
    .join('');

  const docBookContent = `
<statistics>
  <title>Statistics</title>
  <chapter>
    <title>Books Read</title>
    <para>${stats.booksRead}</para>
  </chapter>
  <chapter>
    <title>Favourite Genre</title>
    <para>${stats.favouriteGenre}</para>
  </chapter>
  <chapter>
    <title>Favourite Author</title>
    <para>${stats.favouriteAuthor}</para>
  </chapter>
  <chapter>
    <title>Reading Now</title>
    <para>${stats.readingNow}</para>
  </chapter>
  <chapter>
    <title>Reviews Left</title>
    <para>${stats.reviewsLeft}</para>
  </chapter>
  ${bookEntries}
</statistics>
  `;

  const blob = new Blob([docBookContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'statistics.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const exportToCSV = async (stats: IStats | null): Promise<void> => {
  const favouriteBooks = await getFavouriteBooks();
  const allBooks = await getBooks();

  if (favouriteBooks.data === null || allBooks.data === null) {
    showAlert('Error', 'Failed to fetch books data.');
    return;
  }

  const books = allBooks.data.filter(book => favouriteBooks.data.includes(book._id));

  let csvContent = 'Title,Author,Genre,Year,Publishing House,Edition\n';
  books.forEach(book => {
    csvContent += `${book.title},${book.author},${book.genre},${book.year},${book.publishingHouse},${book.edition}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'books.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

document.addEventListener('DOMContentLoaded', statsScript);
