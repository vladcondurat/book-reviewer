import { register } from '@app/api/auth/register';
import { showAlert } from '@app/components/alert/alert';

export const registerScript = (): void => {
  const avatarElement = document.getElementById('avatar');
  if (avatarElement !== null) {
    avatarElement.addEventListener('change', function (event) {
      const input = event.target;
      const file = (input as HTMLInputElement).files?.[0];
      if (file !== null) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = document.getElementById('avatar-preview') as HTMLImageElement;
          const svg = document.getElementById('avatar-svg');
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

  const form = document.getElementById('register-form');
  const username = document.getElementById('username') as HTMLInputElement;
  const email = document.getElementById('email') as HTMLInputElement;
  const password = document.getElementById('password') as HTMLInputElement;
  const confirmPassword = document.getElementById('confirm-password') as HTMLInputElement;
  const avatar = document.getElementById('avatar') as HTMLInputElement;

  if (form !== null) {
    form.addEventListener('submit', async event => {
      event.preventDefault();

      if (password.value !== confirmPassword.value) {
        showAlert('Error', 'Passwords do not match. Please make sure your passwords match.');
        return;
      }

      const credentials = {
        username: username.value,
        email: email.value,
        password: password.value,
      };

      const file = avatar.files?.[0];
      if (!file) {
        showAlert('Error', 'Please select an avatar.');
        return;
      }

      try {
        const response = await register(credentials.username, credentials.email, credentials.password, file);
        if (response.error != null) {
          throw new Error(response.error);
        }
        showAlert('Register Successful', 'You have successfully registered.');

        window.location.href = '/#signin';
      } catch (error) {
        showAlert('Register Failed', 'An error occurred while registering. Please try again.');
        console.error('Error registering:', error);
      }
    });
  }
};
