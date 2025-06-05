import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Invite.scss';

const Invite = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('id');

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
      return retryResponse;
    }
    return response;
  };

  const joinSession = async () => {
    try {
      console.log('Attempting to join session:', sessionId);
      
      const joinResponse = await fetchWithTokenRefresh(`/api/sessions/join/${sessionId}`, {
        method: 'POST',
      });

      if (!joinResponse.ok) {
        throw new Error(joinResponse.detail);
      }
      console.log('Join response status:', joinResponse.status);
  
      const statusResponse = await fetchWithTokenRefresh('/api/sessions/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'PREPARED' }),
      });
      console.log('Status update response:', statusResponse.status);
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