import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Invite.scss';
import { useAuthFetch } from '../../utils/useAuthFetch';

const Invite = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('id');
  const authFetch = useAuthFetch();
  const [badRequest, setBadRequest] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  const joinSession = async () => {
    try {
      console.log('Attempting to join session:', sessionId);
      
      const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/sessions/join/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!ok && data.detail.error_code === 'USER_ALREADY_IN_SESSION') setBadRequest(true);
      else if (!ok && (data.detail.error_code === 'USER_NOT_FOUND' || data.detail.error_code === 'SESSION_NOT_FOUND')) setIsNotFound(true);
      else if (!ok && (data.detail.error_code === 'SESSION_ALREADY_STARTED' || data.detail.error_code === 'MAX_PARTICIPANTS_IN_SESSION')) setForbidden(true);
      else if (!ok) throw new Error(data.detail.message);

      // console.log('Join response status:', status, data.detail.error_code);
      if (ok) {
        const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/sessions/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'PREPARED' }),
        });

        if (!ok && data.detail.error_code === 'USER_NOT_IN_SESSION') setForbidden(true);
        if (!ok && data.detail.error_code === 'USER_NOT_FOUND') setIsNotFound(true);

        if (ok) {
          console.log('Status update response:', status);
          navigate(`/session?id=${sessionId}`, { 
            state: { session_id: sessionId, is_pair: true } 
          });
        }
      }
    } catch (err) {
      console.error('Full error joining session:', err);
      navigate(`/?redirect=/invite&id=${sessionId}`);
    }
  };

  useEffect(() => {
    joinSession();
  }, [sessionId]);

  if (forbidden) {
    return (
      <div className='error'>
        <h1 className='code'>403</h1>
        <h3 className='text'>Что-то пошло не так. Попробуйте снова.</h3>
      </div>
    )
  }
  
  if (isNotFound) {
    return (
      <div className='error'>
        <h1 className='code'>404</h1>
        <h3 className='text'>Страница не найдена</h3>
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
    <div className="invite-page">
      <div className="invite-message">
        <h1>Подключение к сессии</h1>
        <p>Пожалуйста, подождите...</p>
      </div>
    </div>
  );
};

export default Invite;
