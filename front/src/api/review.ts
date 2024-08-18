import { showAlert } from '@app/components/alert/alert';
import { type ApiResponse, apiFetch } from './api';
import { type IReview } from '@app/types/api/IReview';

export const addReviewToBook = async (bookId: string, description: string, rating: number): Promise<ApiResponse<IReview>> => {
  const response = await apiFetch<IReview>(`reviews/${bookId}`, {
    method: 'POST',
    body: JSON.stringify({ description, rating }),
  });

  if (response.error != null) {
    showAlert('Error', response.error);
  }

  return response;
};

export const getReviewsForBook = async (bookId: string): Promise<ApiResponse<IReview[]>> => {
  const response = await apiFetch<IReview[]>(`reviews/${bookId}`, {
    method: 'GET',
  });

  if (response.error != null) {
    showAlert(response.error, 'error');
  }

  return response;
};
