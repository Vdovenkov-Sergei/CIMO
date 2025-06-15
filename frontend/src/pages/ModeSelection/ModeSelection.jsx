import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModeSelection.scss';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import SingleModeCard from '../../components/SingleModeCard';
import PairModeCard from '../../components/PairModeCard';
import ActiveSession from '../../components/ActiveSession/ActiveSession';
import FAQComponent from '../../components/Q&A/Q&A';
import { useAuthFetch } from '../../utils/useAuthFetch';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';

const STORAGE_KEYS = {
  CURRENT_MOVIE: 'session_current_movie',
  SHOW_COUNTDOWN: 'session_show_countdown',
  SHOW_LIKED_MOVIES: 'session_show_liked_movies',
  TIMER: 'session_timer',
  TIME_SWIPED: 'session_time_swiped',
  STEP: 'step'
};

const ModeSelection = () => {
  const navigate = useNavigate();
  const [inviteLink, setInviteLink] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [activeSession, setActiveSession] = useState(false);
  const authFetch = useAuthFetch();
  const [isActiveSessionModalOpen, setIsActiveSessionModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const handleStartSingleSession = async (showModalCallback) => {
    try {
      await authFetch(`${import.meta.env.VITE_API_URL}/sessions/`, {
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
      await authFetch(`${import.meta.env.VITE_API_URL}/sessions/leave`, {
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
      const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/sessions/status`, {
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
      const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/sessions/`, {
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
      await authFetch(`${import.meta.env.VITE_API_URL}/sessions/leave`, {
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
      const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/sessions/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'PREPARED' }),
      });
      
      navigate(`/session?id=${sessionId}`, { state: { session_id: sessionId, is_pair: true, movie_id: data.movie_id, is_onboarding: false } });
    } catch (err) {
      console.error('Error preparing pair session:', err);
    }
  };

  const handleFinishActiveSession = () => {
    setIsActiveSessionModalOpen(false);
    setIsConfirmationModalOpen(true);
  };

  const handleCancelConfirmation = () => {
    setIsConfirmationModalOpen(false);
    setIsActiveSessionModalOpen(true);
  };

  const clearSavedState = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    localStorage.removeItem('session_accumulated_time');
    localStorage.removeItem('session_start_time');
  };

  const handleConfirmFinish = async () => {
    setIsConfirmationModalOpen(false);
    clearSavedState();
    try {
      await authFetch(`${import.meta.env.VITE_API_URL}/sessions/leave`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
    } catch (err) {
      console.error('Error finishing session:', err);
    }
  };

  const checkUserSession = async () => {
    try {
      const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/sessions/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (status !== 404) {
        setActiveSession(true);
        setIsActiveSessionModalOpen(true);
      }
      console.log(activeSession);
    } catch (err) {
      console.error('Error checking user\'s session:', err);
    }
  };

  useEffect(() => {
    checkUserSession();
  }, [])

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

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
            copyIconUrl='/copy.svg'
          />
        </div>

        <FAQComponent />

        <ActiveSession
          isOpen={isActiveSessionModalOpen}
          onCancel={handleFinishActiveSession}
          onConfirm={() => { }}
        />

        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onCancel={handleCancelConfirmation}
          onConfirm={handleConfirmFinish}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ModeSelection;