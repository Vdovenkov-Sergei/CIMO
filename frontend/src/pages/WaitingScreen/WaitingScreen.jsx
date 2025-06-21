import React, { useEffect, useState, useRef } from 'react';
import { useNavigate  } from 'react-router-dom';
import './WaitingScreen.scss';
import { useAuthFetch } from '../../utils/useAuthFetch';

const WaitingScreen = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const hasRun = useRef(false);
  const authFetch = useAuthFetch();
  const [isCreated, setIsCreated] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [badRequest, setBadRequest] = useState(false);

  const createTrySession = async () => {
    try {
      const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/sessions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_pair: false, is_onboarding: true }),
      });
      if (!ok && data.detail.error_code === 'USER_NOT_FOUND') setIsNotFound(true);
      if (!ok && data.detail.error_code === 'USER_ALREADY_IN_SESSION') setBadRequest(true);
      if (ok) setIsCreated(true);
    } catch (err) {
      console.error('Error starting try session:', err);
    }
  };
  
  useEffect(() => {
    if (!hasRun.current) createTrySession();
    hasRun.current = true;
    
    if (isCreated) {
      const timer = setInterval(() => {
      setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/session', { state: { is_pair: false, is_onboarding: true } });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
    
  }, [countdown, isCreated]);

  if (isNotFound) {
    return (
      <div className="error">
        <h1 className="code">404</h1>
        <h3 className="text">Страница не найдена</h3>
      </div>
    );
  }

  if (badRequest) {
    return (
      <div className="error">
        <h1 className="code">Упс</h1>
        <h3 className="text">Вы уже участвуете в другом подборе фильмов - завершите его прежде, чем начать новый.</h3>
      </div>
    )
  }

  return (
    <div className="waiting-screen-page">
      <h1 className='message'>Подготавливаем для Вас пробную сессию</h1>
    </div>
  );
};

export default WaitingScreen;


