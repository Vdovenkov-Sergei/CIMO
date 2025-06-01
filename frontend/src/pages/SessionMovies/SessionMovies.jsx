import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SessionMovies.scss';
import WatchLaterScroll from '../../components/WatchLaterScroll';
import WatchLaterAllButton from '../../components/WatchLaterAllButton';
import FinishSessionButton from '../../components/FinishSessionButton';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

const SessionMovies = () => {
  const [movies, setMovies] = useState({
    watchlist: [
      { id: 1, title: 'Фильм1', poster: '/movies/poster1.jpg', watched: false },
      { id: 2, title: 'Фильм2', poster: '/movies/poster2.jpg', watched: false },
      { id: 3, title: 'Фильм3', poster: '/movies/poster3.jpg', watched: false },
      { id: 4, title: 'Фильм4', poster: '/movies/poster4.jpg', watched: false },
    ],
    watched: [
      { id: 5, title: 'Фильм5', poster: '/movies/poster5.jpg', watched: true },
      { id: 6, title: 'Фильм6', poster: '/movies/poster6.jpg', watched: true },
    ]
  });

  const toggleWatchLater = (id) => {
    setMovies(prev => ({
      ...prev,
      watchlist: prev.watchlist.map(movie => 
        movie.id === id ? { ...movie, watchedLater: !movie.watchedLater } : movie
      )
    }));
  };

  /*const watchLaterAll = () => {
    setMovies(prev => ({
      ...prev,
      watchlist: prev.watchlist.map(movie => ({ ...movie, watchedLater: true }))
    }));
  };*/

  const markAsWatched = (id) => {
    setMovies(prev => {
      const film = prev.watchlist.find(m => m.id === id);
      return {
        watchlist: prev.watchlist.filter(m => m.id !== id),
        watched: [...prev.watched, { ...film, watched: true }]
      };
    });
  };

  const removeMovie = (id, isWatched) => {
    setMovies(prev => ({
      ...prev,
      [isWatched ? 'watched' : 'watchlist']: 
        prev[isWatched ? 'watched' : 'watchlist'].filter(m => m.id !== id)
    }));
  };

  const finishSession = () => {
    // Логика завершения сессии
    console.log('Сессия завершена');
  };

  return (
    <div className="session-movies-page">
      <Header />

      <main className="movies-main container">
        <section className="movies-section">
          <h2 className="movies-section__title">Отложенные фильмы</h2>
          <WatchLaterScroll 
            movies={movies.watchlist} 
            onToggleWatchLater={toggleWatchLater}
            onWatch={markAsWatched}
            onDelete={(id) => removeMovie(id, false)}
          />
        </section>

        <div className="buttons">
          <FinishSessionButton onClick={finishSession} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SessionMovies;