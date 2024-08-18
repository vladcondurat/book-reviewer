import { contact } from '@app/api/contact';
import { showAlert } from '@app/components/alert/alert';

export const contactScript = async (): Promise<void> => {
  const contactForm = document.getElementById('contact-form');
  const email = document.getElementById('email') as HTMLInputElement;
  const content = document.getElementById('message') as HTMLTextAreaElement;

  if (contactForm !== null) {
    contactForm.addEventListener('submit', async event => {
      event.preventDefault();

      try {
        const response = await contact(email.value, content.value);
        if (response.error !== null) {
          throw new Error(response.error);
        } else {
          showAlert('Message Sent', 'Your message has been sent.');
          window.location.href = '#';
        }
      } catch (error) {
        console.error('Error sending message:', error);
        showAlert('Error', 'An error occurred while sending your message. Please try again.');
      }
    });
  }
};
