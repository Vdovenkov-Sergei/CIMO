import React, { useState } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Session.scss';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SwipeableMovieCard from '../../components/SwiperMovieCard';
import FinishSelectionButton from '../../components/FinishSelectionButton';
import XControlButton from '../../components/XControlButton';
import CheckControlButton from '../../components/CheckControlButton';
import LikedMoviesScroll from '../../components/LikedMoviesScroll';
import MovieDetailsModal from '../../components/MovieDetailsModal';

const Session = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedMovies, setLikedMovies] = useState([]);
  const [showDetails, setShowDetails] = useState(null);

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
      <Header />

      {/* Main Content */}
      <main className="main">
        <div className="movie-card-container">
          <AnimatePresence>
          {movies[currentIndex] && (
            <>
              <SwipeableMovieCard 
                movie={movies[currentIndex]} 
                onClick={() => setShowDetails(movies[currentIndex])}
                onSwipe={handleSwipe}
                className="block1"
              />
              <SwipeableMovieCard 
                movie={movies[currentIndex]} 
                onClick={() => setShowDetails(movies[currentIndex])}
                onSwipe={handleSwipe}
                className="block2"
              />
            </>
          )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <XControlButton onClick={() => handleSwipe("left")} />
          <CheckControlButton onClick={() => handleSwipe("right")} />
        </div>

        {/* Session Controls */}
        <div className="session-controls">
          <FinishSelectionButton onClick={() => console.log('Подбор завершен')} />
        </div>

        {/* Liked Movies */}
        <div className="liked-movies">
          <h3>Понравившиеся фильмы</h3>
          <LikedMoviesScroll movies={likedMovies} />
        </div>

        <MovieDetailsModal 
          movie={showDetails} 
          onClose={() => setShowDetails(null)} 
        />
      </main>

      <Footer />
    </div>
  );
};

export default Session;