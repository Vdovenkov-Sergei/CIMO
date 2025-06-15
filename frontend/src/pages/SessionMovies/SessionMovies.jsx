import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import './SessionMovies.scss';
import WatchLaterScroll from '../../components/WatchLaterScroll';
import FinishSessionButton from '../../components/FinishSessionButton';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import MovieDetailsModal from '../../components/MovieDetailsModal/MovieDetailsModal';
import RateMovieModal from '../../components/RateMovieModal/RateMovieModal';
import { useAuthFetch } from '../../utils/useAuthFetch';

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
  const [queue, setQueue] = useState([]);
  const [step, setStep] = useState(0);
  const isOnboarding = location.state.isOnboarding;
  const authFetch = useAuthFetch();
  
  const steps = [
    { id: 0, content: 'Удаляйте или откладывайте фильмы из списка понравившихся.'},
    { id: 1, content: 'Поделитесь мнением — это помогает нам становиться лучше.'},
    { id: 2, content: 'Нажмите, чтобы завершить текущую сессию.'}
  ];

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const updateSessionStatus = async () => {
    try {
      const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/sessions/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'REVIEW' }),
      });
    } catch (err) {
      console.error('Error updating session status:', err);
    }
  };

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const url = new URL(import.meta.env.VITE_API_URL);
    const protocol = url.protocol === 'https:' ? 'wss' : 'ws';
    const host = url.host;
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
      fetchMovies(0);

      const timer = setTimeout(() => {
        setShowNotification(false);
        dequeue();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [queue]);

  const fetchMovies = async (offset = 0) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');

    try {
      const { status, ok, data } = await authFetch(
        `${import.meta.env.VITE_API_URL}/movies/session/?offset=${offset}&limit=${limit}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

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
    updateSessionStatus();
  }, []);

  useEffect(() => {
    fetchMovies(0);
  }, []);

  const handleCardClick = async (movieId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/movies/${movieId}/detailed`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
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
      await authFetch(`${import.meta.env.VITE_API_URL}/movies/later/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movie_id: movieId
        }),
      });

      await authFetch(`${import.meta.env.VITE_API_URL}/movies/session/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
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
      await authFetch(`${import.meta.env.VITE_API_URL}/movies/session/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
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
      await authFetch(`${import.meta.env.VITE_API_URL}/movies/viewed/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movie_id: movieToRate.id,
          review: rating.toString()
        }),
      });

      await authFetch(`${import.meta.env.VITE_API_URL}/movies/session/${movieToRate.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
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
      await authFetch(`${import.meta.env.VITE_API_URL}/sessions/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'COMPLETED'
        }),
      });
      localStorage.removeItem('step');
      navigate('/modeSelection');
    } catch (err) {
      console.error('Error finishing session:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (step >= 0 && step < steps.length) {
      const timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 180000);
  
      return () => clearTimeout(timer);
    }
  }, [step]);
  
  useEffect(() => {
    const storedValue = localStorage.getItem('step');
    if (storedValue !== null) {
      setStep(Number(storedValue));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('step', step);
  }, [step]);

  return (
    <div className="session-movies-page">
      <Header />

      <main className="movies-main">
        <section className="movies-section">
          <div className='movies-section__title'>
            <Tippy
              zIndex={999}
              content={
                <div className='tooltip'>
                  <p className='tooltip-info'>{steps[0].content}</p>
                  <button className='tooltip-button' onClick={handleNext}>Далее</button>
                </div>
              }
              visible={step === 0 && isOnboarding}
              placement="bottom"
              interactive={true}
            >
              <h3>Отложенные фильмы</h3>
            </Tippy>
          </div>

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
          <Tippy
            zIndex={999}
            content={
              <div className='tooltip'>
                <p className='tooltip-info'>{steps[2].content}</p>
                <button className='tooltip-button' onClick={() => setStep(-1)}>Готово</button>
              </div>
            }
            visible={step === 2 && isOnboarding}
            placement={window.innerWidth < 1000 ? "top" : "right"}
            interactive={true}
          >
            <div><FinishSessionButton onClick={finishSession} /></div>
          </Tippy>
          <Tippy
            zIndex={999}
            content={
              <div className='tooltip'>
                <p className='tooltip-info'>{steps[1].content}</p>
                <button className='tooltip-button' onClick={handleNext}>Далее</button>
              </div>
            }
            visible={step === 1 && isOnboarding}
            placement={window.innerWidth < 1000 ? "bottom" : "left"}
            interactive={true}
          >
            <a href="https://forms.yandex.ru/u/681a215ad046880a127479a7/" className='feedback-btn' target='_blank'>Оставить отзыв</a>
          </Tippy>
          
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