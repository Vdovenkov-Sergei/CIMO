import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Invite.scss';
import { useWebSocket } from '../../context/WebSocketContext';

const Invite = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('id');
  const { connect } = useWebSocket();

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
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.detail === "Token expired") {
          await refreshToken();
          const retryResponse = await fetch(url, {
            ...options,
            credentials: 'include',
          });
          if (!retryResponse.ok) {
            navigate('/');
            throw new Error('Request failed after token refresh');
          }
          return retryResponse;
        }
        throw new Error(errorData.detail || 'Request failed');
      }
      return response;
    } catch (error) {
      if (error.message === 'Token refresh failed') {
        navigate('/');
      }
      throw error;
    }
  };

  const joinSession = async () => {
    try {
      console.log('Attempting to join session:', sessionId);
      
      const joinResponse = await fetchWithTokenRefresh(`/api/sessions/join/${sessionId}`, {
        method: 'POST',
      });
      console.log('Join response status:', joinResponse.status);
  
      const statusResponse = await fetchWithTokenRefresh('/api/sessions/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'PREPARED' }),
      });
      console.log('Status update response:', statusResponse.status);
      connect(sessionId);
      navigate(`/session?id=${sessionId}`, { 
        state: { session_id: sessionId, is_pair: true } 
      });
    } catch (err) {
      console.error('Full error joining session:', err);
      navigate('/');
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