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
  CURRENT_MOVIE_ID: 'session_current_movie_id',
  SHOW_COUNTDOWN: 'session_show_countdown',
  SHOW_LIKED_MOVIES: 'session_show_liked_movies',
  START_TIME: 'session_start_time',
  STEP: 'step'
};

const ModeSelection = () => {
  const navigate = useNavigate();
  const [inviteLink, setInviteLink] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [activeSessionData, setActiveSessionData] = useState(null);
  const authFetch = useAuthFetch();
  const [isActiveSessionModalOpen, setIsActiveSessionModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [badRequest, setBadRequest] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  const checkExistingSession = async () => {
    try {
      const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/sessions/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!ok && data.detail.error_code === 'USER_NOT_FOUND') setIsNotFound(true);

      if (!ok) {
        setActiveSessionData(null);
        return null;
      } else {
        setActiveSessionData(data);
        return data;
      }
    } catch (err) {
      console.error('Error checking user session:', err);
      setActiveSessionData(null);
      return null;
    }
  };

  const handleStartSingleSession = async (showModalCallback) => {
    const hasSession = await checkExistingSession();
    if (hasSession) {
      setIsActiveSessionModalOpen(true);
      return;
    }

    try {
      const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/sessions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_pair: false, is_onboarding: false }),
      });
      if (!ok && data.detail.error_code === 'USER_ALREADY_IN_SESSION') setBadRequest(true);
      else if (!ok && data.detail.error_code === 'USER_NOT_FOUND') setIsNotFound(true);
      else if (ok) showModalCallback();
    } catch (err) {
      console.error('Error starting single session:', err);
    }
  };

  const handleCancelSingleSession = async () => {
    try {
      const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/sessions/leave`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!ok && data.detail.error_code === 'USER_NOT_IN_SESSION') setForbidden(true);
      else if (!ok && data.detail.error_code === 'USER_NOT_FOUND') setIsNotFound(true);
    } catch (err) {
      console.error('Error canceling session:', err);
    }
  };

  const handleConfirmSingleSession = async () => {
    navigate('/session', { state: { is_pair: false, is_onboarding: false } });
  };

  const handleStartPairSession = async (showModalCallback) => {
    const hasSession = await checkExistingSession();
    if (hasSession) {
      setIsActiveSessionModalOpen(true);
      return;
    }

    try {
      const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/sessions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_pair: true }),
      });
      if (!ok && data.detail.error_code === 'USER_ALREADY_IN_SESSION') setBadRequest(true);
      else if (!ok && data.detail.error_code === 'USER_NOT_FOUND') setIsNotFound(true);
      else if (ok) {
        const newSessionId = data.id;
        setSessionId(newSessionId);
        setInviteLink(`${import.meta.env.VITE_URL}/invite?id=${newSessionId}`);
        showModalCallback();
      }
    } catch (err) {
      console.error('Error starting pair session:', err);
    }
  };

  const handleCancelPairSession = async () => {
    try {
      const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/sessions/leave`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!ok && data.detail.error_code === 'USER_NOT_IN_SESSION') setForbidden(true);
      else if (!ok && data.detail.error_code === 'USER_NOT_FOUND') setIsNotFound(true);
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
      if (!ok && data.detail.error_code === 'USER_NOT_IN_SESSION') setForbidden(true);
      else if (!ok && data.detail.error_code === 'USER_NOT_FOUND') setIsNotFound(true);
      else if (ok) navigate(`/session?id=${sessionId}`, { state: { session_id: sessionId, is_pair: true, is_onboarding: false } });
    } catch (err) {
      console.error('Error preparing pair session:', err);
    }
  };

  const updateSessionStatus = async () => {
    try {
      const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/sessions/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'PREPARED' }),
      });
      if (!ok && data.detail.error_code === 'USER_NOT_IN_SESSION') setForbidden(true);
      else if (!ok && data.detail.error_code === 'USER_NOT_FOUND') setIsNotFound(true);
      console.log('Status update response:', data.status);
    } catch (err) {
      console.error('Error update session status:', err);
    }
  }

  const handleFinishActiveSession = () => {
    setIsActiveSessionModalOpen(false);
    setIsConfirmationModalOpen(true);
  };

  const handleContinueActiveSession = () => {
    setIsActiveSessionModalOpen(false);
    if (activeSessionData) {
      const { id, is_pair, status, is_onboarding } = activeSessionData;

      if (!is_pair) {
        switch (status) {
          case "PENDING":
          case "PREPARED":
          case "ACTIVE":
            navigate('/session', { state: { is_pair: is_pair, is_onboarding: is_onboarding } });
            break;
          case "REVIEW":
            navigate('/sessionMovies', { state: { isPair: is_pair, isOnboarding: is_onboarding } });
            break;
        }
      } else {
        switch (status) {
          case "PENDING":
            updateSessionStatus();
            navigate(`/session?id=${sessionId}`, { state: { session_id: id, is_pair: is_pair, is_onboarding: is_onboarding } });
            break;
          case "PREPARED":
          case "ACTIVE":
            navigate(`/session?id=${sessionId}`, { state: { session_id: id, is_pair: is_pair, is_onboarding: is_onboarding } });
            break;
          case "REVIEW":
            navigate('/sessionMovies', { state: { sessionId: id, isPair: is_pair, isOnboarding: is_onboarding } });
            break;
        }
      }
    }
  };

  const handleCancelConfirmation = () => {
    setIsConfirmationModalOpen(false);
    setIsActiveSessionModalOpen(true);
  };

  const clearSavedState = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  };

  const handleConfirmFinish = async () => {
    setIsConfirmationModalOpen(false);
    clearSavedState();
    try {
      const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/sessions/leave`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!ok && data.detail.error_code === 'USER_NOT_IN_SESSION') setForbidden(true);
      else if (!ok && data.detail.error_code === 'USER_NOT_FOUND') setIsNotFound(true);
    } catch (err) {
      console.error('Error finishing session:', err);
    }
  };

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

  if (forbidden) {
    return (
      <div className='error'>
        <h1 className='code'>403</h1>
        <h3 className='text'>Что-то пошло не так. Попробуйте снова.</h3>
      </div>
    )
  }

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
          onConfirm={handleContinueActiveSession}
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