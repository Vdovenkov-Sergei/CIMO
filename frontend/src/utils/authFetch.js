import { UnauthorizedError } from '@/utils/exceptions';

export const refreshToken = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json().catch((err) => {
      console.warn('Failed to parse JSON:', err);
      return {};
    });
    throw new UnauthorizedError(data.detail.message);
  }
};

export const fetchWithTokenRefresh = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
  });

  const data = await response.json().catch((err) => {
    console.warn('Failed to parse JSON:', err);
    return {};
  });

  if (response.status === 401 && data.detail.message === "Token expired") {
    await refreshToken();
    const retryResponse = await fetch(url, {
      ...options,
      credentials: 'include',
    });
    const retryData = await retryResponse.json().catch((err) => {
      console.warn('Failed to parse JSON:', err);
      return {};
    });
    return {
      status: retryResponse.status,
      ok: retryResponse.ok,
      data: retryData
    };
  }
  return {
    status: response.status,
    ok: response.ok,
    data: data
  };
};
