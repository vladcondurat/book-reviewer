import { apiFetch, type ApiResponse } from '../api';

export const forgotPassword = async (email: string): Promise<ApiResponse<string>> => {
  return await apiFetch<string>('auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async (newPassword: string, token: string): Promise<ApiResponse<string>> => {
  return await apiFetch<string>('auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ newPassword, token }),
  });
};
