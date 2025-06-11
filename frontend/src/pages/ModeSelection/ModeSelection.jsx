import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModeSelection.scss';
import copyIconUrl from '../../../src/assets/images/copy.svg';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import SingleModeCard from '../../components/SingleModeCard';
import PairModeCard from '../../components/PairModeCard';
import ActiveSession from '../../components/ActiveSession/ActiveSession';
import Onboarding from '../../components/Onboarding';
import FAQComponent from '../../components/Q&A/Q&A';
import { useAuthFetch } from '../../utils/useAuthFetch';

const ModeSelection = () => {
  const navigate = useNavigate();
  const [inviteLink, setInviteLink] = useState('');
  const [sessionId, setSessionId] = useState('');
  let activeSession = false;
  const authFetch = useAuthFetch();

  const handleStartSingleSession = async (showModalCallback) => {
    try {
      await authFetch('/api/sessions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_pair: false, is_onboarding: false }),
      });
      showModalCallback();
    } catch (err) {
      console.error('Error starting single session:', err);
    }
  };

  const handleCancelSingleSession = async () => {
    try {
      await authFetch('/api/sessions/leave', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.error('Error canceling session:', err);
    }
  };

  const handleConfirmSingleSession = async () => {
    try {
      const { status, ok, data } = await authFetch('/api/sessions/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'ACTIVE' }),
      });
      
      navigate('/session', { state: { is_pair: false, movie_id: data.movie_id, is_onboarding: false } });
    } catch (err) {
      console.error('Error preparing session:', err);
    }
  };

  const handleStartPairSession = async (showModalCallback) => {
    try {
      const { status, ok, data } = await authFetch('/api/sessions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_pair: true }),
      });

      const newSessionId = data.id;
      setSessionId(newSessionId);
      setInviteLink(`http://localhost:5173/invite?id=${newSessionId}`);
      showModalCallback();
    } catch (err) {
      console.error('Error starting pair session:', err);
    }
  };

  const handleCancelPairSession = async () => {
    try {
      await authFetch('/api/sessions/leave', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.error('Error canceling pair session:', err);
    }
  };

  const handleConfirmPairSession = async () => {
    try {
      const { status, ok, data } = await authFetch('/api/sessions/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'PREPARED' }),
      });
      
      navigate(`/session?id=${sessionId}`, { state: { session_id: sessionId, is_pair: true, movie_id: data.movie_id } });
    } catch (err) {
      console.error('Error preparing pair session:', err);
    }
  };

  const checkUserSession = async () => {
    try {
      const { status, ok, data } = await authFetch('/api/sessions/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (status !== 404) {
        activeSession = true;
      }
      console.log(activeSession);
    } catch (err) {
      console.error('Error checking user\'s session:', err);
    }
  };

  useEffect(() => {
    checkUserSession();
  }, [])

  return (
    <div className="mode-selection-page">
      <Header />

      <main className="main-content-modes">
        <h2 className="main-title">Хотите подобрать фильм?</h2>
        
        <div className="modes-container">
          <SingleModeCard 
            onStartSession={handleStartSingleSession}
            onCancelSession={handleCancelSingleSession}
            onConfirmSession={handleConfirmSingleSession}
          />

          <PairModeCard 
            onStartSession={handleStartPairSession}
            onCancelSession={handleCancelPairSession}
            onConfirmSession={handleConfirmPairSession}
            inviteLink={inviteLink}
            copyIconUrl={copyIconUrl}
          />
        </div>

        <FAQComponent />
      </main>

      <Footer />
    </div>
  );
};

export default ModeSelection;