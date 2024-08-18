import { apiFetch, type ApiResponse } from '../api';
import { type LoginResponse } from '@app/types/auth/LoginResponse';

const login = async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
  return await apiFetch<LoginResponse>('auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export { login };
