import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Session.scss';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SwipeableMovieCard from '../../components/SwiperMovieCard';
import FinishSelectionButton from '../../components/FinishSelectionButton';
import XControlButton from '../../components/XControlButton';
import CheckControlButton from '../../components/CheckControlButton';
import LikedMoviesScroll from '../../components/LikedMoviesScroll';
import MovieDetailsModal from '../../components/MovieDetailsModal/MovieDetailsModal';
import CountdownModal from '../../components/CountdownModal/CountdownModal';

const Notification = ({ movie }) => {
  return (
    <div className="push-notification">
      <img 
        src={movie.poster_url} 
        alt={movie.name} 
        className="notification-poster" 
      />
      <div className="notification-text">
        <span className='notification-match'>Совпадение найдено!</span>🎉 <p>Фильм: <span className='notification-movie-info'>{movie.name} ({movie.release_year})</span></p>
      </div>
    </div>
  );
};

const CaretDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-caret-down" viewBox="0 0 16 16">
    <path d="M3.204 5h9.592L8 10.481zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659"/>
  </svg>
);

const CaretUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-caret-up" viewBox="0 0 16 16">
    <path d="M3.204 11h9.592L8 5.519zm-.753-.659 4.796-5.48a1 1 0 0 1 1.506 0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 0 1-.753-1.659"/>
  </svg>
);

const STORAGE_KEYS = {
  CURRENT_MOVIE: 'session_current_movie',
  LIKED_MOVIES: 'session_liked_movies',
  SHOW_COUNTDOWN: 'session_show_countdown',
  CURRENT_MOVIE_ID: 'session_current_movie_id',
  SHOW_LIKED_MOVIES: 'session_show_liked_movies',
  OFFSET: 'session_offset',
  HAS_MORE: 'session_has_more',
  TIMER: 'session_timer',
  TIME_SWIPED: 'session_time_swiped'
};

const Session = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentMovie, setCurrentMovie] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const [likedMovies, setLikedMovies] = useState([]);
  const [showDetails, setShowDetails] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [currentMovieId, setCurrentMovieId] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;
  const [showLikedMovies, setShowLikedMovies] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMovie, setNotificationMovie] = useState(null);
  const [latestMessage, setLatestMessage] = useState(null);
  const ws = useRef(null);
  const [timeSwiped, setTimeSwiped] = useState(0);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const accumulatedTimeRef = useRef(0);
  const [queue, setQueue] = useState([]);

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
        [STORAGE_KEYS.TIMER]: timer,
        [STORAGE_KEYS.TIME_SWIPED]: timeSwiped
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
      const storedTimer = localStorage.getItem(STORAGE_KEYS.TIMER);
      const storedTimeSwiped = localStorage.getItem(STORAGE_KEYS.TIME_SWIPED);

      if (storedCurrentMovie) setCurrentMovie(JSON.parse(storedCurrentMovie));
      if (storedLikedMovies) setLikedMovies(JSON.parse(storedLikedMovies));
      if (storedShowCountdown) setShowCountdown(JSON.parse(storedShowCountdown));
      if (storedCurrentMovieId) setCurrentMovieId(JSON.parse(storedCurrentMovieId));
      if (storedShowLikedMovies) setShowLikedMovies(JSON.parse(storedShowLikedMovies));
      if (storedOffset) setOffset(JSON.parse(storedOffset));
      if (storedHasMore) setHasMore(JSON.parse(storedHasMore));
      if (storedTimer) setTimer(Number(JSON.parse(storedTimer)));
      if (storedTimeSwiped) setTimeSwiped(Number(JSON.parse(storedTimeSwiped)));
    } catch (error) {
      console.error('Error loading state:', error);
    }
  };

  // Очистка сохраненного состояния
  const clearSavedState = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    localStorage.removeItem('session_accumulated_time');
    localStorage.removeItem('session_start_time');
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
  }, [currentMovie, likedMovies, showCountdown, currentMovieId, showLikedMovies, offset, hasMore, timer, timeSwiped]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('id');
    setSessionId(sessionId);
      
    if (!sessionId) {
      return;
    }
  
    const protocol = import.meta.env.VITE_WS_PROTOCOL || 'ws';
    const host = import.meta.env.VITE_WS_HOST || 'localhost:8000';
    const wsUrl = `${protocol}://${host}/movies/session/ws/${sessionId}`;
      
    ws.current = new WebSocket(wsUrl);
  
    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };
  
    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };
  
    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setLatestMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  
    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, []);

  const enqueue = (item) => {
    setQueue(prevQueue => [...prevQueue, item]);
  }

  const dequeue = () => {
    if (queue.length > 0) {
      setQueue(prevQueue => prevQueue.slice(1));
    }
  }

  useEffect(() => {
    if (latestMessage) {
      console.log('🔔 New WebSocket message:', latestMessage);

      if (latestMessage.movie) {
        enqueue(latestMessage.movie);
      }
    }
  }, [latestMessage]);

  useEffect(() => {
    if (queue.length > 0) {
      const item = queue[0];
      setNotificationMovie(item);
      setShowNotification(true);
      fetchLikedMovies(true);

      const timer = setTimeout(() => {
        setShowNotification(false);
        dequeue();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [queue]);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    startTimeRef.current = Date.now() - timer * 1000;
    
    timerRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsedSinceStart = Math.floor((currentTime - startTimeRef.current) / 1000);
      setTimer(accumulatedTimeRef.current + elapsedSinceStart);
    }, 1000);
  };

  useEffect(() => {
    const savedAccumulatedTime = localStorage.getItem('session_accumulated_time');
    const savedStartTime = localStorage.getItem('session_start_time');
    
    if (savedAccumulatedTime && savedStartTime) {
      const parsedAccumulated = parseFloat(savedAccumulatedTime);
      const parsedStartTime = parseInt(savedStartTime, 10);
      
      if (Date.now() - parsedStartTime < 86400000) {
        accumulatedTimeRef.current = parsedAccumulated;
        startTimeRef.current = parsedStartTime;
        const elapsedSinceSave = Math.floor((Date.now() - parsedStartTime) / 1000);
        setTimer(parsedAccumulated + elapsedSinceSave);
      }
    }
    
    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentAccumulated = Math.floor(accumulatedTimeRef.current + 
                               (Date.now() - startTimeRef.current) / 1000);
      
      localStorage.setItem('session_accumulated_time', currentAccumulated.toString());
      localStorage.setItem('session_start_time', Date.now().toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, []);

  useEffect(() => {
    loadState();
    checkSessionStatus();
  
  
    if (location.state?.movie_id) {
      setCurrentMovieId(location.state.movie_id);
      fetchCurrentMovie(location.state.movie_id);
    }
    fetchLikedMovies(true);
  
    startTimer(timer);
  
    return () => {
      clearSavedState();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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
      const retryData = await retryResponse.json().catch(() => ({}));
      return retryData;
    }
    return data;
  };

  const checkSessionStatus = async () => {
    try {
      const data = await fetchWithTokenRefresh('/api/sessions/me');
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
      localStorage.removeItem('session_accumulated_time');
      localStorage.removeItem('session_start_time');
      await fetchWithTokenRefresh('/api/sessions/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'REVIEW' }),
      });
      navigate('/sessionMovies', { state: { sessionId: sessionId } });
    } catch (err) {
      console.error('Error finishing session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentMovie = async (movieId) => {
    try {
      const data = await fetchWithTokenRefresh(`/api/movies/${movieId}`);
      if (data.detail === "Movie with id=-1 not found") {
        setCurrentMovie({ id: -1 });
      }
      else {
        setCurrentMovie(data);
      }
    } catch (err) {
      console.error('Error fetching current movie:', err);
    }
  };

  const fetchMovieDetails = async (movieId) => {
    try {
      const data = await fetchWithTokenRefresh(`/api/movies/${movieId}/detailed`);
      setShowDetails(data);
    } catch (err) {
      console.error('Error fetching movie details:', err);
    }
  };

  const fetchLikedMovies = async (reset = false) => {
    try {
      const newOffset = reset ? 0 : offset;
      const data = await fetchWithTokenRefresh(
        `/api/movies/session/?limit=${limit}&offset=${newOffset}`
      );
      
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
      const totalTime = Math.floor(accumulatedTimeRef.current + 
                       (Date.now() - startTimeRef.current) / 1000);
      setTimeSwiped(totalTime);
      
      accumulatedTimeRef.current = 0;
      startTimeRef.current = Date.now();
      setTimer(0);

      const data = await fetchWithTokenRefresh('/api/movies/session/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movie_id: movieId, is_liked: isLiked, time_swiped: timeSwiped }),
      });
      
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
      const data = await fetchWithTokenRefresh('/api/sessions/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'ACTIVE' }),
      });
      
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
                {currentMovie.id !== -1 ? (
                  <SwipeableMovieCard 
                    movie={currentMovie} 
                    onClick={() => setShowDetails(currentMovie)}
                    onSwipe={handleSwipe}
                    className="block1"
                  />
                ) : (
                  <div className="empty-movie-card">
                    Пробная сессия закончена
                  </div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        {!showCountdown && (
          <>
            {currentMovieId !== -1 ? (
              <div className="action-buttons">
                <XControlButton onClick={() => handleMovieAction(currentMovie.id, false)} />
                <CheckControlButton onClick={() => handleMovieAction(currentMovie.id, true)} />
              </div>
            ) : (
              <div className='empty-space'></div>
            )}
            

            <div className="session-controls">
              <FinishSelectionButton 
                onClick={finishSession} 
                disabled={isLoading}
              />
            </div>

            <div className="liked-movies">
              <div 
                className="liked-movies-header"
                onClick={() => setShowLikedMovies(!showLikedMovies)}
                style={{ 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                {showLikedMovies ? <CaretUp /> : <CaretDown />}
                <h3 style={{ margin: 0 }}>Понравившиеся фильмы</h3>
              </div>
              {showLikedMovies && (
                likedMovies.length > 0 ? (
                  <LikedMoviesScroll 
                    movies={likedMovies} 
                    hasMore={hasMore}
                    onMovieClick={(movie) => setShowDetails(movie)}
                    onLoadMore={() => fetchLikedMovies()}
                  />
                ) : (
                  <div className="empty-liked-movies">
                    Список пуст
                  </div>
                )
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