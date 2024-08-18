import { apiFetch, type ApiResponse } from './api';

const contact = async (email: string, content: string): Promise<ApiResponse<unknown>> => {
  const response = await apiFetch<unknown>('contact', {
    method: 'POST',
    body: JSON.stringify({ email, content }),
  });

  return response;
};

export { contact };
