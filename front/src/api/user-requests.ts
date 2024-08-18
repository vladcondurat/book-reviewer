import { type IUser } from '@app/types/api/IUser';
import { apiFetch, type ApiResponse } from './api';

export const getUserById = async (userId: string): Promise<ApiResponse<IUser>> => {
  return await apiFetch<IUser>(`users/${userId}`, {
    method: 'GET',
  });
};

export const getCurrentUser = async (): Promise<ApiResponse<IUser>> => {
  return await apiFetch<IUser>('users/current-user', {
    method: 'GET',
  });
};
