import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MyMovies.scss';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import WatchListScroll from '../../components/WatchListScroll';
import WatchedScroll from '../../components/WatchedScroll';
import RateMovieModal from '../../components/RateMovieModal/RateMovieModal';
import MovieDetailsModal from '../../components/MovieDetailsModal/MovieDetailsModal';
import { useAuthFetch } from '../../utils/useAuthFetch';

const MyMovies = () => {
  const navigate = useNavigate();
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
  const [isPatchMode, setIsPatchMode] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const authFetch = useAuthFetch();
  const limit = 10;

  const fetchWatchlist = async (offset = 0, shouldReset = false) => {
    if (isLoading && !shouldReset) return;
    
    setIsLoading(true);
    setError('');

    try {
      const { status, ok, data } = await authFetch(
        `${import.meta.env.VITE_API_URL}/movies/later/?offset=${offset}&limit=${limit}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!Array.isArray(data)) {
        throw new Error('Invalid data format for watchlist');
      }

      if (shouldReset || offset === 0) {
        setWatchlistMovies(data);
        setWatchlistOffset(data.length);
      } else {
        const newMovies = data.filter(newMovie => 
          !watchlistMovies.some(existingMovie => 
            existingMovie.movie.id === newMovie.movie.id
          )
        );
        setWatchlistMovies(prev => [...prev, ...newMovies]);
        setWatchlistOffset(prev => prev + newMovies.length);
      }
      setHasMoreWatchlist(data.length === limit);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  const fetchWatched = async (offset = 0, shouldReset = false) => {
    if (isLoading && !shouldReset) return;
    
    setIsLoading(true);
    setError('');

    try {
      const { status, ok, data } = await authFetch(
        `${import.meta.env.VITE_API_URL}/movies/viewed/?offset=${offset}&limit=${limit}&order_review=${reviewSort}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!Array.isArray(data)) {
        throw new Error('Invalid data format for watched movies');
      }

      if (shouldReset || offset === 0) {
        setWatchedMovies(data);
        setWatchedOffset(data.length);
      } else {
        const newMovies = data.filter(newMovie => 
          !watchedMovies.some(existingMovie => 
            existingMovie.movie.id === newMovie.movie.id
          )
        );
        setWatchedMovies(prev => [...prev, ...newMovies]);
        setWatchedOffset(prev => prev + newMovies.length);
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
    const loadData = async () => {
      setWatchlistMovies([]);
      setWatchedMovies([]);
      setWatchlistOffset(0);
      setWatchedOffset(0);
      await fetchWatchlist(0, true);
      await fetchWatched(0, true);
    };
    
    loadData();
  }, [reviewSort]);

  const handleWatchClick = (movie) => {
    setMovieToRate(movie);
    setRatingModalOpen(true);
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

      await authFetch(`${import.meta.env.VITE_API_URL}/movies/later/${movieToRate.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      await Promise.all([fetchWatchlist(0, true), fetchWatched(0, true)]);
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setRatingModalOpen(false);
      setMovieToRate(null);
    }
  };


  const handleEditRatingSubmit = async (rating) => {
    setIsLoading(true);
    setError('');

    try {
      await authFetch(`${import.meta.env.VITE_API_URL}/movies/viewed/${movieToRate.movie.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movie_id: movieToRate.movie.id,
          review: rating.toString()
        }),
      });

      await fetchWatched(0, true);
    } catch (err) {
      console.error('Error updating review:', err);
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
      await authFetch(`${import.meta.env.VITE_API_URL}/movies/later/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movie_id: movie.id
        }),
      });

      await authFetch(`${import.meta.env.VITE_API_URL}/movies/viewed/${movie.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      await Promise.all([fetchWatchlist(0, true), fetchWatched(0, true)]);
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
      await authFetch(`${import.meta.env.VITE_API_URL}/movies/later/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      await Promise.all([fetchWatchlist(0, true), fetchWatched(0, true)]);
    } catch (err) {
      console.error('Error removing movie:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreWatchlist = () => {
    if (!hasMoreWatchlist || isLoading) return;
    fetchWatchlist(watchlistOffset);
  };

  const loadMoreWatched = () => {
    if (!hasMoreWatched || isLoading) return;
    fetchWatched(watchedOffset);
  };

  const handleMovieCardClick = async (movieId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/movies/${movieId}/detailed`);
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

  return (
    <div className="my-movies-page">
      <Header />

      <main className="movies-main">

        {error && <div className="error-message">{error}</div>}

        <section className="movies-section">
          <h2 className="movies-section__title">Отложенные фильмы</h2>
          {watchlistMovies.length > 0 ? (
            <WatchListScroll
              movies={watchlistMovies}
              onWatch={handleWatchClick}
              onDelete={removeMovie}
              loadMore={loadMoreWatchlist}
              hasMore={hasMoreWatchlist}
              onCardClick={handleMovieCardClick}
            />
          ) : (
            <div className="empty-scroll watchlist">
              Список пуст
            </div>
          )}
          
        </section>

        <section className="movies-section">
          <div className="movies-section__header">
            <h2 className="movies-section__title">Просмотренные фильмы</h2>
          </div>
          {watchedMovies.length > 0 ? (
            <WatchedScroll
              movies={watchedMovies}
              onUnwatch={markAsUnwatched}
              loadMore={loadMoreWatched}
              hasMore={hasMoreWatched}
              onRatingClick={(watchedMovie) => {
                setMovieToRate({ ...watchedMovie.movie, review: watchedMovie.review });
                setIsPatchMode(true);
                setRatingModalOpen(true);
              }}
              onCardClick={handleMovieCardClick}
            />
          ) : (
            <div className="empty-scroll watched">
              Список пуст
            </div>
          )}
          
        </section>
      </main>

      <RateMovieModal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        onSubmit={
          movieToRate?.movie ? handleEditRatingSubmit : handleRatingSubmit
        }
        movie={movieToRate?.movie || movieToRate}
        isLoading={isLoading}
      />

      <MovieDetailsModal
        movie={selectedMovie}
        onClose={handleCloseModal}
      />

      <Footer />
    </div>
  );
};

export default MyMovies;