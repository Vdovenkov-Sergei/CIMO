import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Session.scss';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SwipeableMovieCard from '../../components/SwiperMovieCard';
import FinishSelectionButton from '../../components/FinishSelectionButton';
import XControlButton from '../../components/XControlButton';
import CheckControlButton from '../../components/CheckControlButton';
import LikedMoviesScroll from '../../components/LikedMoviesScroll';
import MovieDetailsModal from '../../components/MovieDetailsModal/MovieDetailsModal';
import CountdownModal from '../../components/CountdownModal/CountdownModal';
import { useWebSocket } from '@/context/WebSocketContext';

const Notification = ({ movie }) => {
  return (
    <div className="push-notification">
      <img 
        src={movie.poster_url} 
        alt={movie.name} 
        className="notification-poster" 
      />
      <div className="notification-text">
        🎉 Совпадение найдено! Фильм: {movie.name}
      </div>
    </div>
  );
};

const STORAGE_KEYS = {
  CURRENT_MOVIE: 'session_current_movie',
  LIKED_MOVIES: 'session_liked_movies',
  SHOW_COUNTDOWN: 'session_show_countdown',
  CURRENT_MOVIE_ID: 'session_current_movie_id',
  SHOW_LIKED_MOVIES: 'session_show_liked_movies',
  OFFSET: 'session_offset',
  HAS_MORE: 'session_has_more',
  SESSION_ID: 'session_id'
};

const Session = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentMovie, setCurrentMovie] = useState(null);
  const [likedMovies, setLikedMovies] = useState([]);
  const [showDetails, setShowDetails] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [currentMovieId, setCurrentMovieId] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;
  const [showLikedMovies, setShowLikedMovies] = useState(true);
  const { sessionId, latestMessage, connect } = useWebSocket();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMovie, setNotificationMovie] = useState(null);

  // Сохранение состояния
  const saveState = () => {
    try {
      const stateToSave = {
        [STORAGE_KEYS.CURRENT_MOVIE]: currentMovie,
        [STORAGE_KEYS.LIKED_MOVIES]: likedMovies,
        [STORAGE_KEYS.SHOW_COUNTDOWN]: showCountdown,
        [STORAGE_KEYS.CURRENT_MOVIE_ID]: currentMovieId,
        [STORAGE_KEYS.SHOW_LIKED_MOVIES]: showLikedMovies,
        [STORAGE_KEYS.OFFSET]: offset,
        [STORAGE_KEYS.HAS_MORE]: hasMore,
        [STORAGE_KEYS.SESSION_ID]: sessionId
      };

      Object.entries(stateToSave).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      });
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  // Восстановление состояния
  const loadState = () => {
    try {
      const storedCurrentMovie = localStorage.getItem(STORAGE_KEYS.CURRENT_MOVIE);
      const storedLikedMovies = localStorage.getItem(STORAGE_KEYS.LIKED_MOVIES);
      const storedShowCountdown = localStorage.getItem(STORAGE_KEYS.SHOW_COUNTDOWN);
      const storedCurrentMovieId = localStorage.getItem(STORAGE_KEYS.CURRENT_MOVIE_ID);
      const storedShowLikedMovies = localStorage.getItem(STORAGE_KEYS.SHOW_LIKED_MOVIES);
      const storedOffset = localStorage.getItem(STORAGE_KEYS.OFFSET);
      const storedHasMore = localStorage.getItem(STORAGE_KEYS.HAS_MORE);
      const storedSessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);

      if (storedCurrentMovie) setCurrentMovie(JSON.parse(storedCurrentMovie));
      if (storedLikedMovies) setLikedMovies(JSON.parse(storedLikedMovies));
      if (storedShowCountdown) setShowCountdown(JSON.parse(storedShowCountdown));
      if (storedCurrentMovieId) setCurrentMovieId(JSON.parse(storedCurrentMovieId));
      if (storedShowLikedMovies) setShowLikedMovies(JSON.parse(storedShowLikedMovies));
      if (storedOffset) setOffset(JSON.parse(storedOffset));
      if (storedHasMore) setHasMore(JSON.parse(storedHasMore));
      
      // Восстанавливаем WebSocket соединение
      if (storedSessionId) {
        connect(JSON.parse(storedSessionId));
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
  };

  // Очистка сохраненного состояния
  const clearSavedState = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  };

  useEffect(() => {
    loadState();
    checkSessionStatus();

    if (location.state?.movie_id) {
      setCurrentMovieId(location.state.movie_id);
      fetchCurrentMovie(location.state.movie_id);
    }
    fetchLikedMovies(true);

    return () => {
      clearSavedState();
    };
  }, []);

  useEffect(() => {
    saveState();
  }, [currentMovie, likedMovies, showCountdown, currentMovieId, showLikedMovies, offset, hasMore, sessionId]);

  useEffect(() => {
    if (latestMessage) {
      console.log('🔔 New WebSocket message:', latestMessage);

      if (latestMessage.movie) {
        setNotificationMovie(latestMessage.movie);
        setShowNotification(true);
        
        const timer = setTimeout(() => {
          setShowNotification(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [latestMessage]);

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

  const checkSessionStatus = async () => {
    try {
      const response = await fetchWithTokenRefresh('/api/sessions/me');
      const data = await response.json();
      if (data.status === 'PREPARED') {
        setShowCountdown(true);
      }
    } catch (err) {
      console.error('Error checking session status:', err);
    }
  };

  const finishSession = async () => {
    setIsLoading(true);
    try {
      await fetchWithTokenRefresh('/api/sessions/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'REVIEW' }),
      });
      navigate('/sessionMovies');
    } catch (err) {
      console.error('Error finishing session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentMovie = async (movieId) => {
    try {
      const response = await fetchWithTokenRefresh(`/api/movies/${movieId}`);
      const data = await response.json();
      setCurrentMovie(data);
    } catch (err) {
      console.error('Error fetching current movie:', err);
    }
  };

  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await fetchWithTokenRefresh(`/api/movies/${movieId}/detailed`);
      const data = await response.json();
      setShowDetails(data);
    } catch (err) {
      console.error('Error fetching movie details:', err);
    }
  };

  const fetchLikedMovies = async (reset = false) => {
    try {
      const newOffset = reset ? 0 : offset;
      const response = await fetchWithTokenRefresh(
        `/api/movies/session/?limit=${limit}&offset=${newOffset}`
      );
      const data = await response.json();
      
      setHasMore(data.length === limit);
      
      if (reset) {
        setLikedMovies(data);
        setOffset(data.length);
      } else {
        setLikedMovies(prev => [...prev, ...data]);
        setOffset(prev => prev + data.length);
      }
    } catch (err) {
      console.error('Error fetching liked movies:', err);
    }
  };

  const handleMovieAction = async (movieId, isLiked) => {
    try {
      const response = await fetchWithTokenRefresh('/api/movies/session/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movie_id: movieId, is_liked: isLiked }),
      });
      
      const data = await response.json();
      setCurrentMovieId(data.movie_id);
      fetchCurrentMovie(data.movie_id);
      if (isLiked) {
        fetchLikedMovies(true);
      }
    } catch (err) {
      console.error('Error handling movie action:', err);
    }
  };

  const handleSwipe = (direction) => {
    if (!currentMovie) return;
    
    const isLiked = direction === "right";
    handleMovieAction(currentMovie.id, isLiked);
  };

  const activateSession = async () => {
    try {
      const response = await fetchWithTokenRefresh('/api/sessions/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'ACTIVE' }),
      });
      
      const data = await response.json();
      if (data.movie_id) {
        setCurrentMovieId(data.movie_id);
        fetchCurrentMovie(data.movie_id);
      }
    } catch (err) {
      console.error('Error activating session:', err);
    }
  };

  useEffect(() => {
    if (currentMovieId) {
      fetchCurrentMovie(currentMovieId);
    }
  }, [currentMovieId]);

  useEffect(() => {
    if (showDetails?.id) {
      fetchMovieDetails(showDetails.id);
    }
  }, [showDetails?.id]);

  return (
    <div className="session-container">
      <Header />

      <main className="main">
        <CountdownModal 
          isOpen={showCountdown} 
          onClose={() => {
            setShowCountdown(false);
            activateSession();
          }}
          onActivate={(movieId) => {
            setCurrentMovieId(movieId);
            fetchCurrentMovie(movieId);
          }}
          is_pair={location.state?.is_pair}
          session_id={location.state?.session_id}
        />

        <div className="movie-card-container">
          <AnimatePresence>
            {currentMovie && !showCountdown && (
              <>
                <SwipeableMovieCard 
                  movie={currentMovie} 
                  onClick={() => setShowDetails(currentMovie)}
                  onSwipe={handleSwipe}
                  className="block1"
                />
              </>
            )}
          </AnimatePresence>
        </div>

        {!showCountdown && (
          <>
            <div className="action-buttons">
              <XControlButton onClick={() => handleMovieAction(currentMovie.id, false)} />
              <CheckControlButton onClick={() => handleMovieAction(currentMovie.id, true)} />
            </div>

            <div className="session-controls">
              <FinishSelectionButton 
                onClick={finishSession} 
                disabled={isLoading}
              />
            </div>

            <div className="liked-movies">
              <h3 
                onClick={() => setShowLikedMovies(!showLikedMovies)}
                style={{ cursor: 'pointer' }}
              >
                Понравившиеся фильмы
              </h3>
              {showLikedMovies && (
                <LikedMoviesScroll 
                  movies={likedMovies} 
                  hasMore={hasMore}
                  onMovieClick={(movie) => setShowDetails(movie)}
                  onLoadMore={() => fetchLikedMovies()}
                />
              )}
            </div>
          </>
        )}

        <MovieDetailsModal 
          movie={showDetails} 
          onClose={() => setShowDetails(null)}
          onSwipeLeft={() => handleMovieAction(showDetails.id, false)}
          onSwipeRight={() => handleMovieAction(showDetails.id, true)}
        />

        {showNotification && (
          <div className="notification-container">
            <Notification movie={notificationMovie} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Session;