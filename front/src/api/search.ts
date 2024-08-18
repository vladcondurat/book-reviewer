import { type ISearchResults } from '@app/types/api/ISearchResults';
import { apiFetch, type ApiResponse } from './api';

const search = async (searchInput: string): Promise<ApiResponse<ISearchResults>> => {
  return await apiFetch<ISearchResults>(`search/?search-input=${encodeURIComponent(searchInput)}`, {
    method: 'GET',
  });
};

export { search };
