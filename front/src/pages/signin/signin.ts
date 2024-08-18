import { login } from '@app/api/auth/login';
import { showAlert } from '@app/components/alert/alert';

export const signInScript = (): void => {
  const form = document.getElementById('signin-form');
  const email = document.getElementById('email') as HTMLInputElement;
  const password = document.getElementById('password') as HTMLInputElement;

  if (form !== null) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const credentials = {
        email: email.value,
        password: password.value,
      };

      try {
        const response = await login(credentials.email, credentials.password);
        if (response.error == null) {
          showAlert('Login Successful', 'You have successfully logged in.');
          window.location.href = '/';
        } else {
          showAlert('Login Failed', 'Invalid email or password. Please try again.');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        showAlert('Login Failed', 'Invalid email or password. Please try again.');
      }
    });
  }
};
