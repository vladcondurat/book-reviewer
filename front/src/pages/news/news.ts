import { getBookById } from '@app/api/book-requests';
import { getNews } from '@app/api/news';
import { getUserById } from '@app/api/user-requests';

const activityTypes: Record<string, string> = {
  started_reading: 'started reading',
  registered_now: 'has just joined our community',
  added_new_book: 'added a new book',
};

const formatActivityString = (type: string, username: string, bookTitle?: string): string => {
  const activityType = activityTypes[type];

  if (activityType.length === 0) {
    throw new Error('Invalid activity type code');
  }

  if (activityType === 'has just joined our community') {
    return `${username} has ${activityType}.`;
  }

  return `${username} has ${activityType} ${bookTitle}. Check it out!`;
};

export const newsScript = async (): Promise<void> => {
  const news = await getNews();

  const newsContainer = document.querySelector('.news-container');

  if (newsContainer == null) {
    return;
  }

  if (news.data === null) {
    newsContainer.innerHTML = `
    <div class="header">
      <div class="title">No news found</div>
    </div>`;
    return;
  }

  newsContainer.innerHTML = `
    <div class="header">
      <div class="title">News</div>
    </div>`;

  news.data.forEach(async newsItem => {
    const user = (await getUserById(newsItem.userId)).data;

    if (newsItem.bookId != null) {
      const book = (await getBookById(newsItem.bookId)).data;
      newsContainer.innerHTML += `
      <a href="#bookpage/${book?._id}" class="notification-link">
      <div class="news-notification">
        <img src="${user?.avatarUrl}" alt="Notification Png" class="notification-image" />
        <div class="notification-text">${formatActivityString(newsItem.type, user?.username ?? 'Unkown', book?.title)}</div>
      </div>
      </a>
    `;
    } else {
      newsContainer.innerHTML += `
      <div class="news-notification">
        <img src="${user?.avatarUrl}" alt="Notification Png" class="notification-image" />
        <div class="notification-text">${formatActivityString(newsItem.type, user?.username ?? 'Unkown')}</div>
      </div>
    `;
    }
  });
};
