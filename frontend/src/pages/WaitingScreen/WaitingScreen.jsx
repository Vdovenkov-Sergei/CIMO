import React, { useEffect, useState, useRef } from 'react';
import { useNavigate  } from 'react-router-dom';
import './WaitingScreen.scss';

const WaitingScreen = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const hasRun = useRef(false);

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        navigate('/');
        throw new Error('Token refresh failed');
      }
      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      navigate('/');
      throw error;
    }
  };

  const fetchWithTokenRefresh = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok && data.detail === "Token expired") {
      await refreshToken();
      const retryResponse = await fetch(url, {
        ...options,
        credentials: 'include',
      });
      const retryData = await retryResponse.json().catch(() => ({}));
      return retryData;
    }
    return data;
  };

  const createTrySession = async () => {
    try {
      await fetchWithTokenRefresh('/api/sessions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_pair: false, is_onboarding: true }),
      });
    } catch (err) {
      console.error('Error starting try session:', err);
    }
  };
    
  const activateSingleSession = async () => {
    try {
      const data = await fetchWithTokenRefresh('/api/sessions/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'ACTIVE' }),
      });
          
      navigate('/session', { state: { is_pair: false, movie_id: data.movie_id, is_onboarding: true } });
    } catch (err) {
      console.error('Error preparing session:', err);
    }
  };
  
  useEffect(() => {
    if (!hasRun.current) createTrySession();
    hasRun.current = true;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            activateSingleSession();
            return 0;
          }
          return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="waiting-screen-page">
      <div className="waiting-screen-message">
        <h1>Подготавливаем для Вас пробную сессию</h1>
      </div>
    </div>
  );
};

export default WaitingScreen;