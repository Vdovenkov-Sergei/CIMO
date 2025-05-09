import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MyMovies.scss';

const MyMovies = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  // Пример данных фильмов
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

  // Пометить фильм как просмотренный
  const markAsWatched = (id) => {
    setMovies(prev => {
      const film = prev.watchlist.find(m => m.id === id);
      return {
        watchlist: prev.watchlist.filter(m => m.id !== id),
        watched: [...prev.watched, { ...film, watched: true }]
      };
    });
  };

  // Пометить фильм как непросмотренный
  const markAsUnwatched = (id) => {
    setMovies(prev => {
      const film = prev.watched.find(m => m.id === id);
      return {
        watched: prev.watched.filter(m => m.id !== id),
        watchlist: [...prev.watchlist, { ...film, watched: false }]
      };
    });
  };

  // Удалить фильм
  const removeMovie = (id, isWatched) => {
    setMovies(prev => ({
      ...prev,
      [isWatched ? 'watched' : 'watchlist']: 
        prev[isWatched ? 'watched' : 'watchlist'].filter(m => m.id !== id)
    }));
  };

  return (
    <div className="my-movies-page">
      <header className="header">
        <img src="./src/assets/images/CIMO_logo.svg" class="logo" alt="" />
        <div className="header__profile">
          <div className="profile-menu-container">
            {isProfileMenuOpen && (
              <ul className="profile-menu__list">
                <li><Link to="/profile">Профиль</Link></li>
                <li><Link to="/myMovies">Мои фильмы</Link></li>
                <li><Link to="/">Выход</Link></li>
              </ul>
            )}
            <div 
              className="profile-icon"
              onClick={toggleProfileMenu}
            >
              <img 
                src="src/assets/images/person-square.svg" 
                alt="Профиль" 
                className="profile-icon__image"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Основная часть */}
      <main className="movies-main container">
        {/* Секция отложенных фильмов */}
        <section className="movies-section">
          <h2 className="movies-section__title">Отложенные фильмы</h2>
          <div className="movies-scroll">
            {movies.watchlist.map(movie => (
              <div key={movie.id} className="movie-card">
                <img 
                  src={movie.poster} 
                  alt={movie.title} 
                  className="movie-card__poster"
                />
                <h3 className="movie-card__title">{movie.title}</h3>
                <div className="movie-card__buttons">
                  <button 
                    onClick={() => markAsWatched(movie.id)}
                    className="movie-button movie-button--primary"
                  >
                    Пометить как просмотренный
                  </button>
                  <button 
                    onClick={() => removeMovie(movie.id, false)}
                    className="movie-button movie-button--danger"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Секция просмотренных фильмов */}
        <section className="movies-section">
          <h2 className="movies-section__title">Просмотренные фильмы</h2>
          <div className="movies-scroll">
            {movies.watched.map(movie => (
              <div key={movie.id} className="movie-card">
                <img 
                  src={movie.poster} 
                  alt={movie.title} 
                  className="movie-card__poster"
                />
                <h3 className="movie-card__title">{movie.title}</h3>
                <div className="movie-card__buttons">
                  <button 
                    onClick={() => markAsUnwatched(movie.id)}
                    className="movie-button movie-button--secondary"
                  >
                    Пометить как непросмотренный
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Футер (оставляем как было) */}
      <footer className="footer">
        <h2 className="footer__title">Наши контакты</h2>
        <a href="mailto:cinemood.corp@gmail.com" className="footer__email">cinemood.corp@gmail.com</a>
      </footer>
    </div>
  );
};

export default MyMovies;