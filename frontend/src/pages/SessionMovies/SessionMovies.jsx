import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './SessionMovies.scss';
import WatchLaterScroll from '../../components/WatchLaterScroll';
import FinishSessionButton from '../../components/FinishSessionButton';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import MovieDetailsModal from '../../components/MovieDetailsModal/MovieDetailsModal';
import RateMovieModal from '../../components/RateMovieModal/RateMovieModal';

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

const SessionMovies = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [movies, setMovies] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [movieToRate, setMovieToRate] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const limit = 10;
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMovie, setNotificationMovie] = useState(null);
  const [latestMessage, setLatestMessage] = useState(null);
  const ws = useRef(null);
  const sessionId = location.state?.sessionId;
  
  useEffect(() => {
    if (!sessionId) {
      console.error('Session ID not found');
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

  useEffect(() => {
    if (latestMessage) {
      console.log('🔔 New message from WebSocket in /session:', latestMessage);
  
      if (latestMessage.movie) {
        setNotificationMovie(latestMessage.movie);
        setShowNotification(true);
        fetchMovies(0);
          
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

  const fetchMovies = async (offset = 0) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetchWithTokenRefresh(
        `/api/movies/session/?offset=${offset}&limit=${limit}`
      );

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid data format for movies');
      }

      setMovies(data);
      setOffset(data.length);
      setHasMore(data.length === limit);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(0);
  }, []);

  const handleCardClick = async (movieId) => {
    try {
      const response = await fetchWithTokenRefresh(`/api/movies/${movieId}/detailed`);
      const data = await response.json();
      setSelectedMovie(data);
      setIsDetailsModalOpen(true);
    } catch (err) {
      console.error('Error fetching movie details:', err);
      setError(err.message);
    }
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handleToggleWatchLater = async (movieId) => {
    setIsLoading(true);
    setError('');

    try {
      await fetchWithTokenRefresh('/api/movies/later/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movie_id: movieId
        }),
      });

      await fetchWithTokenRefresh(`/api/movies/session/${movieId}`, {
        method: 'DELETE',
      });

      await fetchMovies(0);
    } catch (err) {
      console.error('Error toggling watch later:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (movieId) => {
    setIsLoading(true);
    setError('');

    try {
      await fetchWithTokenRefresh(`/api/movies/session/${movieId}`, {
        method: 'DELETE',
      });

      await fetchMovies(0);
    } catch (err) {
      console.error('Error deleting movie:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWatchClick = (movieId) => {
    setMovieToRate({ id: movieId });
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmit = async (rating) => {
    setIsLoading(true);
    setError('');

    try {
      await fetchWithTokenRefresh('/api/movies/viewed/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movie_id: movieToRate.id,
          review: rating.toString()
        }),
      });

      await fetchWithTokenRefresh(`/api/movies/session/${movieToRate.id}`, {
        method: 'DELETE',
      });

      await fetchMovies(0);
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRatingModalOpen(false);
      setMovieToRate(null);
    }
  };

  const finishSession = async () => {
    setIsLoading(true);
    setError('');

    try {
      await fetchWithTokenRefresh('/api/sessions/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'COMPLETED'
        }),
      });
      navigate('/modeSelection');
    } catch (err) {
      console.error('Error finishing session:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="session-movies-page">
      <Header />

      <main className="movies-main container">
        <section className="movies-section">
          <h2 className="movies-section__title">Отложенные фильмы</h2>
          {movies.length > 0 ? (
            <WatchLaterScroll 
              movies={movies} 
              onToggleWatchLater={handleToggleWatchLater}
              onWatch={handleWatchClick}
              onDelete={handleDelete}
              onCardClick={handleCardClick}
            />
          ) : (
            <div className="empty-watch-later">
              Список пуст
            </div>
          )}
        </section>

        <div className="buttons">
          <FinishSessionButton onClick={finishSession} />
          <a href="#" className='feedback-btn' target='_blank'>Оставить обратную связь</a>
        </div>

        {showNotification && (
          <div className="notification-container">
            <Notification movie={notificationMovie} />
          </div>
        )}
      </main>

      <MovieDetailsModal
        movie={selectedMovie}
        onClose={handleCloseModal}
        isOpen={isDetailsModalOpen}
      />

      <RateMovieModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmit={handleRatingSubmit}
        movie={movieToRate}
        isLoading={isLoading}
      />

      <Footer />
    </div>
  );
};

export default SessionMovies;