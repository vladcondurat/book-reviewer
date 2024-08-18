import { type RegisterResponse } from '@app/types/auth/RegisterResponse';
import { apiFetch, type ApiResponse } from '../api';
import { uploadFile } from '../firebase/storage-requests';

const register = async (username: string, email: string, password: string, avatarFile: File): Promise<ApiResponse<RegisterResponse>> => {
  try {
    const avatarUrl = await uploadFile(avatarFile);

    const response = await apiFetch<RegisterResponse>('auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        email,
        password,
        avatarUrl,
      }),
    });

    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export { register };
