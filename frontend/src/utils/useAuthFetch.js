import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { fetchWithTokenRefresh } from '@/utils/authFetch';
import { UnauthorizedError } from '@/utils/exceptions';

export const useAuthFetch = () => {
  const navigate = useNavigate();

  return useCallback(async (url, options) => {
    try {
        const { status, ok, data } = await fetchWithTokenRefresh(url, options);
      
        if (status === 401) throw new UnauthorizedError();
      
        return { status, ok, data };
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          navigate('/');
        }
        throw error;
      }
      
  }, [navigate]);
};
