import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModeSelection.scss';
import copyIconUrl from '../../../src/assets/images/copy.svg';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import SingleModeCard from '../../components/SingleModeCard';
import PairModeCard from '../../components/PairModeCard';

const ModeSelection = () => {
  const navigate = useNavigate();
  const [inviteLink] = useState('https://cinemood.app/invite/xyz123');

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

  const handleStartSingleSession = async (showModalCallback) => {
    try {
      await fetchWithTokenRefresh('/api/sessions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_pair: false }),
      });
      showModalCallback();
    } catch (err) {
      console.error('Error starting single session:', err);
    }
  };

  const handleCancelSingleSession = async () => {
    try {
      await fetchWithTokenRefresh('/api/sessions/leave', {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Error canceling session:', err);
    }
  };

  const handleConfirmSingleSession = async () => {
    try {
      const response = await fetchWithTokenRefresh('/api/sessions/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'PREPARED' }),
      });
      
      const data = await response.json();
      navigate('/session', { state: { movie_id: data.movie_id } });
    } catch (err) {
      console.error('Error preparing session:', err);
    }
  };

  const handleStartPairSession = () => {
    console.log('Парная сессия начата');
  };

  return (
    <div className="mode-selection-page">
      <Header />

      <main className="main-content-modes container">
        <h2 className="main-title">Хотите подобрать фильм?</h2>
        
        <div className="modes-container">
          <SingleModeCard 
            onStartSession={handleStartSingleSession}
            onCancelSession={handleCancelSingleSession}
            onConfirmSession={handleConfirmSingleSession}
          />

          <PairModeCard 
            onStartSession={handleStartPairSession}
            inviteLink={inviteLink}
            copyIconUrl={copyIconUrl}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ModeSelection;