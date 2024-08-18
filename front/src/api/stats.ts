import { type IStats } from '@app/types/api/IStats';
import { apiFetch, type ApiResponse } from './api';

const getStats = async (): Promise<ApiResponse<IStats>> => {
  return await apiFetch<IStats>('stats', {
    method: 'GET',
  });
};

export { getStats };
