import { addBookFormScript } from '@app/pages/add-book-form/add-book-form';
import { bookPageScript } from '@app/pages/book-page/book-page';
import { contactScript } from '@app/pages/contact/contact';
import { forgotPasswordScript } from '@app/pages/forgot-password/forgot-password';
import { indexScript } from '@app/pages/index';
import { latestBooksScript } from '@app/pages/latest-books/latest-books';
import { myBooksScript } from '@app/pages/my-books/my-books';
import { newsScript } from '@app/pages/news/news';
import { registerScript } from '@app/pages/register/register';
import { resetPasswordScript } from '@app/pages/reset-password/reset-password';
import { signInScript } from '@app/pages/signin/signin';
import { statsScript } from '@app/pages/stats/stats';

const pageTitle = 'BookHub';

const routes = {
  404: {
    template: '/src/pages/404/404.html',
    title: '404 | ' + pageTitle,
    description: 'Page not found',
  },
  '/': {
    template: '/src/pages/index/index.html',
    title: 'Home | ' + pageTitle,
    script: indexScript,
  },
  latestbooks: {
    template: '/src/pages/latest-books/latest-books.html',
    title: 'Latest Books | ' + pageTitle,
    script: latestBooksScript,
  },
  mybooks: {
    template: '/src/pages/my-books/my-books.html',
    title: 'My Books | ' + pageTitle,
    script: myBooksScript,
  },
  signin: {
    template: '/src/pages/signin/signin.html',
    title: 'Sign In | ' + pageTitle,
    script: signInScript,
  },
  news: {
    template: '/src/pages/news/news.html',
    title: 'News | ' + pageTitle,
    script: newsScript,
  },
  stats: {
    template: '/src/pages/stats/stats.html',
    title: 'Stats | ' + pageTitle,
    script: statsScript,
  },
  register: {
    template: '/src/pages/register/register.html',
    title: 'Register | ' + pageTitle,
    script: registerScript,
  },
  bookpage: {
    template: '/src/pages/book-page/book-page.html',
    title: 'Book Page | ' + pageTitle,
    script: bookPageScript,
  },
  contact: {
    template: '/src/pages/contact/contact.html',
    title: 'Contact | ' + pageTitle,
    script: contactScript,
  },
  addBookForm: {
    template: '/src/pages/add-book-form/add-book-form.html',
    title: 'Add Book | ' + pageTitle,
    script: addBookFormScript,
  },
  'forgot-password': {
    template: '/src/pages/forgot-password/forgot-password.html',
    title: 'Forgot Password | ' + pageTitle,
    script: forgotPasswordScript,
  },
  'reset-password': {
    template: '/src/pages/reset-password/reset-password.html',
    title: 'Reset Password | ' + pageTitle,
    script: resetPasswordScript,
  },
  help: {
    template: '/src/pages/help/help.html',
    title: 'Help | ' + pageTitle,
  },
  about: {
    template: '/src/pages/about/about.html',
    title: 'About | ' + pageTitle,
  },
};

const locationHandler = async () => {
  let location = window.location.hash.replace('#', '').split('/')[0];

  if (location.length === 0) {
    location = '/';
  }
  const route = routes[location] || routes['404'];
  const html = await fetch(route.template).then(response => response.text());
  const content = document.getElementById('content');

  if (content) content.innerHTML = html;
  document.title = route.title;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', route.description);

  if (route.script != null) {
    route.script();
  }
};
window.addEventListener('hashchange', locationHandler);
void locationHandler();
