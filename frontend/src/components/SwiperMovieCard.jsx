import { motion } from 'framer-motion';
import React from 'react';

const SwipeableMovieCard = ({ movie, onClick, onSwipe, className }) => {
  if (!movie) return null;

  return (
    <motion.div
      className={`movie-card ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, info) => {
        if (info.offset.x > 100) {
          // Свайп вправо - лайк
          onSwipe("right");
        } else if (info.offset.x < -100) {
          // Свайп влево - дизлайк
          onSwipe("left");
        }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <img 
        src={movie.poster_url} 
        alt={movie.name} 
        className="movie-card__poster"
        onError={(e) => {
          e.target.src = '/path-to-default-poster.jpg';
          e.target.onerror = null;
        }}
      />
      <div className="movie-info">
        <h3 className="movie-card__title">{movie.name}</h3>
        <div className="movie-meta">
          <span>{movie.release_year}</span>
        </div>
      </div>
      
      {/* Индикаторы свайпа */}
      <motion.div 
        className="swipe-indicator right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        whileDrag={{ opacity: 1 }}
        hidden
      >
        👍
      </motion.div>
      
      <motion.div 
        className="swipe-indicator left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        whileDrag={{ opacity: 1 }}
        hidden
      >
        👎
      </motion.div>
    </motion.div>
  );
};

export default SwipeableMovieCard;