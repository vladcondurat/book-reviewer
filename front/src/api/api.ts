const API_BASE_URL = 'http://localhost:5100/api/';

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

interface ApiResponse<T> {
  data: T | null;
  error?: string;
}

const apiFetch = async <T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const config: RequestInit = {
    headers: { ...defaultHeaders, ...options.headers },
    credentials: 'include',
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${error.message}`);
    }

    if (response.status === 204) return { data: null };

    const data: T = await response.json();
    return { data };
  } catch (error) {
    console.error('API call failed:', error);

    let errorMessage = 'An unknown error occurred';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    if (error instanceof TypeError) {
      errorMessage = 'Network error. Please check your internet connection.';
    }

    return { data: null, error: errorMessage };
  }
};

export { apiFetch };
export type { ApiResponse };
