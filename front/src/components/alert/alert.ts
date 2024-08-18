export const showAlert = (title: string, description: string): void => {
  const alertContainer = document.getElementById('alert-container') as HTMLDivElement;

  alertContainer.innerHTML = `
    <div class="alert-container">
      <div class="alert-popup-container">
        <div class="alert-details-container">
          <div class="alert-icon">
            <img src="/public/BookHubLogo.svg" alt="Alert Icon" />
          </div>
          <div class="alert-text-container">
            <div class="alert-title">${title}</div>
            <div class="alert-description">${description}</div>
          </div>
          <button class="alert-close-button">Close</button>
        </div>
      </div>
    </div>
  `;

  alertContainer.addEventListener('click', event => {
    if ((event.target as HTMLElement).classList.contains('alert-close-button')) {
      alertContainer.innerHTML = '';
    }
  });
};
