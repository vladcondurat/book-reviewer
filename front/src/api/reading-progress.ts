import { showAlert } from '@app/components/alert/alert';
import { type ApiResponse, apiFetch } from './api';

export const setReadingProgress = async (userId: string, bookId: string, progress: number): Promise<ApiResponse<Record<string, number>>> => {
  const response = await apiFetch<Record<string, number>>(`users/books/progress/${userId}`, {
    method: 'POST',
    body: JSON.stringify({ bookId, progress }),
  });

  if (response.error != null) {
    showAlert('Error', response.error);
  }

  return response;
};

export const getReadingProgress = async (bookId: string): Promise<ApiResponse<number>> => {
  const response = await apiFetch<number>(`users/books/progress/${bookId}`, {
    method: 'GET',
  });

  if (response.error != null) {
    showAlert(response.error, 'error');
  }

  return response;
};
