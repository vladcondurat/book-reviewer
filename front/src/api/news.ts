import { apiFetch, type ApiResponse } from './api';
import { type INews } from '@app/types/api/INews';

const getNews = async (): Promise<ApiResponse<INews[]>> => {
  return await apiFetch<INews[]>('news', {
    method: 'GET',
  });
};

export { getNews };
