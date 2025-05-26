import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyMovies.scss';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import WatchListScroll from '../../components/WatchListScroll';
import WatchedScroll from '../../components/WatchedScroll';
import RateMovieModal from '../../components/RateMovieModal/RateMovieModal';

const MyMovies = () => {
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [watchlistOffset, setWatchlistOffset] = useState(0);
  const [watchedOffset, setWatchedOffset] = useState(0);
  const [hasMoreWatchlist, setHasMoreWatchlist] = useState(true);
  const [hasMoreWatched, setHasMoreWatched] = useState(true);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [movieToRate, setMovieToRate] = useState(null);
  const [reviewSort, setReviewSort] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWatchlist = async (offset = 0, limit = 10) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/movies/later/?offset=${offset}&limit=${limit}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки отложенных фильмов');
      }

      const data = await response.json();
      
      if (offset === 0) {
        setWatchlistMovies(data);
      } else {
        setWatchlistMovies(prev => [...prev, ...data]);
      }
      setHasMoreWatchlist(data.length === limit);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWatched = async (offset = 0, limit = 10) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `/api/movies/viewed/?offset=${offset}&limit=${limit}&order_review=${reviewSort}`, 
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error('Ошибка загрузки просмотренных фильмов');
      }

      const data = await response.json();
      
      if (offset === 0) {
        setWatchedMovies(data);
      } else {
        setWatchedMovies(prev => [...prev, ...data]);
      }
      setHasMoreWatched(data.length === limit);
    } catch (err) {
      console.error('Error fetching watched movies:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
    fetchWatched();
  }, [reviewSort]);

  const handleWatchClick = (movie) => {
    setMovieToRate(movie);
    setRatingModalOpen(true);
  };

  const handleRatingSubmit = async (rating) => {
    setIsLoading(true);
    setError('');
    
    try {
      const addResponse = await fetch('/api/movies/viewed/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movie_id: movieToRate.id,
          review: rating.toString()
        }),
      });
  
      if (!addResponse.ok) {
        throw new Error('Ошибка добавления рецензии');
      }
  
      const deleteResponse = await fetch(`/api/movies/later/${movieToRate.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
  
      if (!deleteResponse.ok) {
        throw new Error('Ошибка удаления из отложенных');
      }

      await Promise.all([fetchWatchlist(0), fetchWatched(0)]);
      
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setRatingModalOpen(false);
      setMovieToRate(null);
    }
  };

  const markAsUnwatched = async (movie) => {
    setIsLoading(true);
    setError('');
    
    try {
      const addResponse = await fetch('/api/movies/later/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movie_id: movie.id
        }),
      });

      if (!addResponse.ok) {
        throw new Error('Ошибка добавления в отложенные');
      }

      const deleteResponse = await fetch(`/api/movies/viewed/${movie.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!deleteResponse.ok) {
        throw new Error('Ошибка удаления из просмотренных');
      }

      await fetchWatchlist(0);
      await fetchWatched(0);
    } catch (err) {
      console.error('Error marking as unwatched:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeMovie = async (movieId) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/movies/later/${movieId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Ошибка удаления фильма');
      }
  
      await Promise.all([
        fetchWatchlist(0),
        fetchWatched(0)
      ]);
      
    } catch (err) {
      console.error('Error removing movie:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreWatchlist = () => {
    const newOffset = watchlistOffset + 10;
    setWatchlistOffset(newOffset);
    fetchWatchlist(newOffset);
  };

  const loadMoreWatched = () => {
    const newOffset = watchedOffset + 10;
    setWatchedOffset(newOffset);
    fetchWatched(newOffset);
  };

  return (
    <div className="my-movies-page">
      <Header />

      <main className="movies-main container">
        <div className="navigation">
          <Link to='/modeSelection' className="navigation__link">Главная страница</Link>
          <span className="delimeter">-</span>
          <Link to='/Profile' className="navigation__link">Профиль</Link>
          <span className="delimeter">-</span>
          <Link to='/myMovies' className="navigation__link">Мои фильмы</Link>
        </div>

        {error && <div className="error-message">{error}</div>}
        {isLoading && <div className="loading-indicator">Загрузка...</div>}

        <section className="movies-section">
          <h2 className="movies-section__title">Отложенные фильмы</h2>
          <WatchListScroll
            movies={watchlistMovies}
            onWatch={handleWatchClick}
            onDelete={removeMovie}
            loadMore={loadMoreWatchlist}
            hasMore={hasMoreWatchlist}
          />
        </section>

        <section className="movies-section">
          <div className="movies-section__header">
            <h2 className="movies-section__title">Просмотренные фильмы</h2>
          </div>
          <WatchedScroll
            movies={watchedMovies}
            onUnwatch={markAsUnwatched}
            loadMore={loadMoreWatched}
            hasMore={hasMoreWatched}
          />
        </section>
      </main>

      <RateMovieModal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        onSubmit={handleRatingSubmit}
        movie={movieToRate}
        isLoading={isLoading}
      />

      <Footer />
    </div>
  );
};

export default MyMovies;