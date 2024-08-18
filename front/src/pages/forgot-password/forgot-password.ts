import { forgotPassword } from '@app/api/auth/forgot-password';
import { showAlert } from '@app/components/alert/alert';

export const forgotPasswordScript = async (): Promise<void> => {
  const form = document.getElementById('forgot-password-form');
  const email = document.getElementById('email') as HTMLInputElement;

  if (form == null) {
    console.error('Form not found');
    return;
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    try {
      const response = await forgotPassword(email.value);
      if (response.data === null && response.error !== null) {
        showAlert('Success', 'Password reset email sent. Please check your email.');
      } else {
        showAlert('Error', 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      showAlert('Error', 'An error occurred. Please try again.');
    }
  });
};
