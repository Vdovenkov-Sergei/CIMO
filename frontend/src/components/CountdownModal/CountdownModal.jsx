import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CountdownModal.scss';

const CountdownModal = ({ isOpen, onClose, onActivate, is_pair, session_id }) => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);
    const [isReady, setIsReady] = useState(false);
    const [checkingReady, setCheckingReady] = useState(false);
    
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

    const handleLeave = async () => {
        try {
          await fetchWithTokenRefresh('/api/sessions/leave', {
            method: 'DELETE',
          });
          navigate('/modeSelection');
          onClose();
        } catch (err) {
          console.error('Error leaving session:', err);
        }
    };

    const checkSessionReady = async () => {
        try {
          console.log('Checking if session is ready...');
          const response = await fetchWithTokenRefresh(`/api/sessions/ready/${session_id}`);
          const data = await response.json();
          console.log('Ready check response:', data);
          
          return data === true;
        } catch (err) {
          console.error('Error checking session ready status:', err);
          return false;
        }
    };

    
    useEffect(() => {
        if (!isOpen || !is_pair || isReady) return;

        setCheckingReady(true);
        const interval = setInterval(async () => {
            const ready = await checkSessionReady();
            if (ready) {
                console.log('Both participants are ready! Starting countdown...');
                setIsReady(true);
                setCheckingReady(false);
                clearInterval(interval);
            }
        }, 4000);

        return () => {
            clearInterval(interval);
            setCheckingReady(false);
        };
    }, [isOpen, is_pair, session_id]);
  
    useEffect(() => {
      if (isOpen && !is_pair && !isReady) {
          console.log('Single session detected — skipping wait and starting countdown immediately.');
          setIsReady(true);
      }
  }, [isOpen, is_pair, isReady]);

    useEffect(() => {
        if (!isOpen || !isReady) return;

        console.log('Starting countdown...');
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, isReady]);

    useEffect(() => {
        if (countdown === 0 && isOpen) {
            console.log('Countdown finished, activating session...');
            const activate = async () => {
                try {
                    const response = await fetchWithTokenRefresh('/api/sessions/status', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ status: 'ACTIVE' }),
                    });
                    
                    const data = await response.json();
                    if (onActivate) {
                        onActivate(data.movie_id);
                    }
                    onClose();
                } catch (err) {
                    console.error('Error activating session:', err);
                }
            };
            activate();
        }
    }, [countdown, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="countdown-modal">
            <div className="countdown-modal__content">
                <h3>
                    {is_pair && !isReady ? (
                        checkingReady ? "Проверяем готовность участников..." : "Ожидаем других участников"
                    ) : (
                        `Сессия начнётся через: ${countdown}`
                    )}
                </h3>
                <button 
                    className="countdown-modal__leave-button"
                    onClick={handleLeave}
                >
                    Выйти
                </button>
            </div>
        </div>
    );
};

export default CountdownModal;