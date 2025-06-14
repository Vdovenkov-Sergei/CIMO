import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Invite.scss';
import { useAuthFetch } from '../../utils/useAuthFetch';

const Invite = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('id');
  const authFetch = useAuthFetch();

  const joinSession = async () => {
    try {
      console.log('Attempting to join session:', sessionId);
      
      const joinResponse = await authFetch(`${import.meta.env.VITE_API_URL}/sessions/join/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!joinResponse.ok) {
        throw new Error(joinResponse.data.detail);
      }
      console.log('Join response status:', joinResponse.data.status);
  
      const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/sessions/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'PREPARED' }),
      });
      console.log('Status update response:', data.status);
      navigate(`/session?id=${sessionId}`, { 
        state: { session_id: sessionId, is_pair: true } 
      });
    } catch (err) {
      console.error('Full error joining session:', err);
      navigate(`/?redirect=/invite&id=${sessionId}`);
    }
  };

  useEffect(() => {
    joinSession();
  }, [sessionId]);

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
