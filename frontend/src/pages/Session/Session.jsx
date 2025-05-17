import React, { useState } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Session.scss';
import xIconUrl from '../../../src/assets/images/x-circle.svg'
import checkIconUrl from '../../../src/assets/images/check-circle.svg'

const Session = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedMovies, setLikedMovies] = useState([]);
  const [showDetails, setShowDetails] = useState(null);
  const controls = useDragControls();

  const movies = [
    {
      id: 1,
      title: "Inception",
      poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
      year: 2010,
      kpRating: 8.7,
      imdbRating: 8.8,
      age: "16+",
      country: "USA",
      duration: "148 min",
      genre: "Sci-Fi, Action",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task..."
    },
    // другие фильмы
  ];

  const currentMovie = movies[currentIndex];

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleSwipe = (direction) => {
    if (direction === "right") {
      setLikedMovies([...likedMovies, currentMovie]);
    }
    if (currentIndex < movies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="session-container">
      {/* Header */}
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

      {/* Main Content */}
      <main className="main">
        <div className="movie-card-container">
          <AnimatePresence>
            {currentMovie && (
              <motion.div
                key={currentMovie.id}
                className="movie-card block1"
                onClick={() => setShowDetails(currentMovie)}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x > 100) handleSwipe("right");
                  else if (info.offset.x < -100) handleSwipe("left");
                }}
              >
                <img src={currentMovie.poster} alt={currentMovie.title} />
                <div className="movie-info">
                  <h3>{currentMovie.title}</h3>
                  <div className="movie-meta">
                    <span>{currentMovie.year}</span>
                    <span>★ {currentMovie.kpRating}</span>
                  </div>
                </div>
              </motion.div>
            )}
            {currentMovie && (
              <motion.div
                key={currentMovie.id}
                className="movie-card block2"
                onClick={() => setShowDetails(currentMovie)}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0}}
                exit={{ opacity: 0, x: -300 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x > 300) handleSwipe("right");
                  else if (info.offset.x < -100) handleSwipe("left");
                }}
              >
                <img src={currentMovie.poster} alt={currentMovie.title} />
                <div className="movie-info">
                  <h3>{currentMovie.title}</h3>
                  <div className="movie-meta">
                    <span>{currentMovie.year}</span>
                    <span>★ {currentMovie.kpRating}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="action-btn dislike" onClick={() => handleSwipe("left")}>
            <img src={xIconUrl} alt="" />
          </button>
          <button className="action-btn like" onClick={() => handleSwipe("right")}>
            <img src={checkIconUrl} alt="" />
          </button>
        </div>

        {/* Session Controls */}
        <div className="session-controls">
          <button className="secondary-btn">Завершить подбор</button>
        </div>

        {/* Liked Movies */}
        <div className="liked-movies">
          <h3>Понравившиеся фильмы</h3>
          <div className="liked-movies-scroll">
            {likedMovies.map((movie) => (
              <div key={movie.id} className="liked-movie">
                <img src={movie.poster} alt={movie.title} />
              </div>
            ))}
          </div>
        </div>

        {/* Movie Detail Modal */}
        {showDetails && (
          <div className="movie-detail-overlay" onClick={() => setShowDetails(null)}>
            <div className="movie-detail" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowDetails(null)}>✕</button>
              <div className="detail-content">
                <div className="detail-info">
                  <h2>{showDetails.title}</h2>
                  <div className="detail-meta">
                    <div className="meta-item">
                      <span className="meta-label">КиноПоиск:</span>
                      <span className="meta-value">{showDetails.kpRating}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">IMDB:</span>
                      <span className="meta-value">{showDetails.imdbRating}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Год:</span>
                      <span className="meta-value">{showDetails.year}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Возраст:</span>
                      <span className="meta-value">{showDetails.age}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Страна:</span>
                      <span className="meta-value">{showDetails.country}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Длительность:</span>
                      <span className="meta-value">{showDetails.duration}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Жанр:</span>
                      <span className="meta-value">{showDetails.genre}</span>
                    </div>
                  </div>
                </div>
                <div className="detail-poster">
                  <img src={showDetails.poster} alt={showDetails.title} />
                </div>
              </div>
              <div className="detail-description">
                <p>{showDetails.description}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <h2 className="footer-title">Наши контакты</h2>
        <a href="mailto:cinemood.corp@gmail.com" className="footer-email">
          cinemood.corp@gmail.com
        </a>
      </footer>
    </div>
  );
};

export default Session;