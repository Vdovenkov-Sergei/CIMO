import React, { useEffect, useState, useRef } from 'react';
import { useNavigate  } from 'react-router-dom';
import './WaitingScreen.scss';
import { useAuthFetch } from '../../utils/useAuthFetch';

const WaitingScreen = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const hasRun = useRef(false);
  const authFetch = useAuthFetch();

  const createTrySession = async () => {
    try {
      const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/sessions/`, {
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
      const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/sessions/status`, {
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
      <h1 className='message'>Подготавливаем для Вас пробную сессию</h1>
    </div>
  );
};

export default WaitingScreen;


