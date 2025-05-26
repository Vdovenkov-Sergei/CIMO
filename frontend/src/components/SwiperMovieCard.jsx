import { motion } from 'framer-motion';
import React from 'react';

const SwipeableMovieCard = ({ movie, onClick, onSwipe, className }) => {
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
        if (info.offset.x > 100) onSwipe("right");
        else if (info.offset.x < -100) onSwipe("left");
      }}
    >
      <img src={movie.poster} alt={movie.title} />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <div className="movie-meta">
          <span>{movie.year}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeableMovieCard;