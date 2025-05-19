import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MyMovies.scss';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import WatchListScroll from '../../components/WatchListScroll';
import WatchedScroll from '../../components/WatchedScroll';

const MyMovies = () => {
  
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

  const markAsWatched = (id) => {
    setMovies(prev => {
      const film = prev.watchlist.find(m => m.id === id);
      return {
        watchlist: prev.watchlist.filter(m => m.id !== id),
        watched: [...prev.watched, { ...film, watched: true }]
      };
    });
  };

  const markAsUnwatched = (id) => {
    setMovies(prev => {
      const film = prev.watched.find(m => m.id === id);
      return {
        watched: prev.watched.filter(m => m.id !== id),
        watchlist: [...prev.watchlist, { ...film, watched: false }]
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

        <section className="movies-section">
          <h2 className="movies-section__title">Отложенные фильмы</h2>
          <WatchListScroll 
            movies={movies.watchlist} 
            onWatch={markAsWatched}
            onDelete={(id) => removeMovie(id, false)}
          />
        </section>

        <section className="movies-section">
          <h2 className="movies-section__title">Просмотренные фильмы</h2>
          <WatchedScroll 
            movies={movies.watched} 
            onUnwatch={markAsUnwatched}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MyMovies;