import { resetPassword } from '@app/api/auth/forgot-password';
import { showAlert } from '@app/components/alert/alert';

const getTokenFromUrl = (): string | null => {
  const hash = window.location.hash;
  const hashParams = new URLSearchParams(hash.substring(hash.indexOf('?')));
  return hashParams.get('token');
};

export const resetPasswordScript = (): void => {
  const form = document.getElementById('reset-password-form');
  const password = document.getElementById('password') as HTMLInputElement;
  const confirmPassword = document.getElementById('confirm-password') as HTMLInputElement;

  if (form == null) {
    console.error('Form not found');
    return;
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();

    if (password.value !== confirmPassword.value) {
      showAlert('Error', 'Passwords do not match. Please make sure your passwords match.');
      return;
    }

    const token = getTokenFromUrl();

    if (token == null) {
      showAlert('Error', 'Invalid reset password link. Please try again.');
      return;
    }

    try {
      const response = await resetPassword(password.value, token);
      if (response.data === null && response.error !== null) {
        showAlert('Success', 'Password was reset successfully. Please login.');
        window.location.href = '#signin';
      } else {
        showAlert('Error', 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      showAlert('Error', 'An error occurred. Please try again.');
    }
  });
};
