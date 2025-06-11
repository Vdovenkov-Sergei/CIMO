import { UnauthorizedError } from '@/utils/exceptions';

export const refreshToken = async () => {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json().catch((err) => {
      console.warn('Failed to parse JSON:', err);
      return {};
    });
    throw new UnauthorizedError(data.detail);
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

  if (response.status === 401 && data.detail === "Token expired") {
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
